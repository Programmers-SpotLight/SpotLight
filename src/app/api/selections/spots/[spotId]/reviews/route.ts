import authOptions from "@/libs/authOptions";
import { uploadFileToS3 } from "@/libs/s3";
import { countReviews } from "@/services/selectionReview.services";
import { getSpotReviews, postSpotReviews } from "@/services/spotReview.services";
import { uuidToBinary, uuidToString } from "@/utils/uuidToBinary";
import { getServerSession } from "next-auth";
import { posix } from "path";

export async function GET(
  req: Request,
  { params }: { params: { spotId: string } }
) {
  try {
    const spotId = params.spotId;
    const { searchParams } = new URL(req.url);
    let page = searchParams.get("page") ?? 1;
    let sort = searchParams.get("sort") ?? "like";
    page = Number(page);

    const session = await getServerSession(authOptions());
    const userId = session?.user?.id;

    const reviewList = await getSpotReviews({
      sltOrSpotId: spotId,
      sort,
      page,
      userId
    });

    const count = await countReviews(spotId, "spot");
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
  { params }: { params: { spotId: string } }
) {
  try {
    const spotId = params.spotId;
    const session = await getServerSession(authOptions());
    const userId = session?.user?.id;

    if (!userId) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const data:IReviewFormData = await req.json();
    const reviewId = uuidToBinary();

    // 이미지 업로드 처리
    const reviewImgPromises = data.reviewImg?.map(async (img, index) => {
      const reviewImgId = uuidToBinary();
      const [meta, base64Data] = img.reviewImgSrc.split(',');
      const fileType = meta.split(';')[0].split(':')[1];
      const fileContent = Buffer.from(base64Data, 'base64');
      const fileName = `public/images/reviews/spot/${uuidToString(reviewImgId)}.${fileType.split('/')[1]}`;
      const fileDirectory = posix.join(fileName);

      await uploadFileToS3({
        fileName: fileDirectory,
        fileType,
        fileContent,
      });

      const s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileDirectory}`;

      const reviewImage: IReviewImageFormData = {
        reviewImgId,
        reviewImgSrc: s3Url, // S3 URL
        reviewImageOrder: index,
      };

      return reviewImage;
    }) || [];

    const reviewImages = await Promise.all(reviewImgPromises);
    const review = {
      reviewId,
      userId: userId,
      sltOrSpotId: spotId,
      reviewDescription: data.reviewDescription,
      reviewScore: data.reviewScore,
      reviewImg: reviewImages
    };

    await postSpotReviews(review);

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
