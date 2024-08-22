import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { uploadFileToS3 } from "@/libs/s3";
import { countReviews, getSelectionReviews, postSelectionReviews } from "@/services/selectionReview.services";
import { uploadImage } from "@/utils/s3Utils";
import { uuidToBinary } from "@/utils/uuidToBinary";
import { getServerSession, Session } from "next-auth";

export async function GET(
  req: Request,
  { params }: { params: { selectionId: string } }
) {
  try {
    const selectionId = parseInt(params.selectionId, 10);
    const { searchParams } = new URL(req.url);
    let page = searchParams.get("page") ?? 1;
    let sort = searchParams.get("sort") ?? "like";
    page = Number(page);
    
    const session: Session | null = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const reviewList = await getSelectionReviews({
      sltOrSpotId: selectionId,
      sort,
      page,
      userId
    });

    const count = await countReviews(selectionId, "selection");
    const result = {
      reviews: reviewList,
      pagination: {
        currentPage: +page,
        totalCount: count,
      },
    };
    return Response.json(result);
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function POST (
  req: Request,
  { params }: { params: { selectionId: string } }
) {
  try {
    const selectionId = parseInt(params.selectionId, 10);
    
    const session: Session | null = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const data: IReviewFormData = await req.json();
    const reviewId = uuidToBinary();

    // 이미지 업로드 처리
    const reviewImgPromises = data.reviewImg?.map(async (img, index) => {
      const [meta, base64Data] = img.reviewImgSrc.split(',');
      const fileType = meta.split(';')[0].split(':')[1];
      const fileContent = Buffer.from(base64Data, 'base64');
      const fileName = `reviews/${reviewId}_${index}`;

      console.log(fileName);

      const s3Url = await uploadFileToS3({
        fileName,
        fileType, 
        fileContent,
      });

      const reviewImage: IReviewImageFormData = {
        reviewImgId: uuidToBinary(),
        reviewImgSrc: s3Url, // S3 URL
        reviewImageOrder: img.reviewImageOrder,
      };

      console.log(reviewImage);

      return reviewImage;
    }) || [];

    const reviewImages = await Promise.all(reviewImgPromises);
    

    const review = {
      reviewId,
      userId: userId,
      sltOrSpotId: selectionId,
      reviewDescription: data.reviewDescription,
      reviewScore: data.reviewScore,
      reviewImg: reviewImages
    };

    await postSelectionReviews(review);

    if (!review) {
      return new Response(JSON.stringify({ message: 'Bad Request' }), {
        status: 400,
      });
    }

    return new Response(
      JSON.stringify({ message: 'Review has been created.' }),
      {
        status: 201,
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
