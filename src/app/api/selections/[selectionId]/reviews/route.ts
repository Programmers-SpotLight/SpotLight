import authOptions from "@/libs/authOptions";
import { uploadFileToS3 } from "@/libs/s3";
import { countReviews, getSelectionReviews, postSelectionReviews } from "@/services/selectionReview.services";
import { BadRequestError, UnauthorizedError } from "@/utils/errors";
import { logWithIP } from "@/utils/logUtils";
import { uuidToBinary, uuidToString } from "@/utils/uuidToBinary";
import { getServerSession, Session } from "next-auth";
import { NextRequest } from "next/server";
import { posix } from "path";

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
    
    const session: Session | null = await getServerSession(authOptions());
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
  req: NextRequest,
  { params }: { params: { selectionId: string } }
) {
  try {
    const selectionId = parseInt(params.selectionId, 10);
    
    const session: Session | null = await getServerSession(authOptions());
    const userId = session?.user?.id;

    if (!userId) {
      throw new UnauthorizedError("User is not authorized");
    }

    const data: IReviewFormData = await req.json();
    const reviewId = uuidToBinary();
    
    // 이미지 업로드 처리
    const reviewImgPromises = data.reviewImg?.map(async (img, index) => {
      const reviewImgId = uuidToBinary();
      const [meta, base64Data] = img.reviewImgSrc.split(',');
      const fileType = meta.split(';')[0].split(':')[1];
      const fileContent = Buffer.from(base64Data, 'base64');
      const fileName = `public/images/reviews/selection/${uuidToString(reviewImgId)}.${fileType.split('/')[1]}`;
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
        reviewImageOrder: img.reviewImageOrder,
      };

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
      throw new BadRequestError("Bad Request");
    }

    return new Response(
      JSON.stringify({ message: 'Review has been created.' }),
      {
        status: 201,
      }
    );
  } catch (err: any) {
    await logWithIP(
      'POST /api/selections/%5BselectionId%5D/reviews - ' + err.message,
      req,
      'error'
    );

    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
