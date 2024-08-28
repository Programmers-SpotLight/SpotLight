import authOptions from "@/libs/authOptions";
import { checkIfFileExistsInS3, deleteFileFromS3, uploadFileToS3 } from "@/libs/s3";
import { deleteSelectionReviews, extractFilePathFromUrl, getSelectionReviewImages, putSelectionReviews } from "@/services/selectionReview.services";
import { logWithIP } from "@/utils/logUtils";
import { uuidToBinary, uuidToString } from "@/utils/uuidToBinary";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { posix } from "path";

export async function PUT (
  req: NextRequest,
  { params }: { params: { selectionId: string, reviewId: string } }
) {
  try {
    const selectionId = parseInt(params.selectionId, 10);
    const reviewId = params.reviewId;
    
    const session = await getServerSession(authOptions());
    const userId = session?.user?.id;

    if (!userId) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const data : IReviewFormData = await req.json();

    // 현재 리뷰의 기존 이미지 가져오기
    const oldReviewImages = await getSelectionReviewImages(reviewId);
    const newImageUrls = data.reviewImg?.map(img => img.reviewImgSrc);
    
    // 기존 이미지를 S3에서 삭제
    await Promise.all(oldReviewImages.map(async (img) => {
      if (!newImageUrls || !newImageUrls.includes(img.reviewImgSrc)) {
        const fileName = extractFilePathFromUrl(img.reviewImgSrc);
        const fileExists = await checkIfFileExistsInS3(fileName);
        if (fileExists) {
          await deleteFileFromS3(fileName);
        }
      }
    }));

    const reviewImgPromises = data.reviewImg?.map(async (img, index) => {
      const reviewImgId = uuidToBinary();
      if (!(img.reviewImgSrc.startsWith('https://') || img.reviewImgSrc.startsWith('http://'))) {
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
        
        return {
          reviewImgId,
          reviewImgSrc: s3Url, // 새 S3 URL
          reviewImageOrder: index,
        };
      } else {
        return {
          reviewImgId,
          reviewImgSrc: img.reviewImgSrc,
          reviewImageOrder: index,
        };
      }
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

    await putSelectionReviews(review);

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
  } catch (err: any) {
    await logWithIP(
      'PUT /api/selections/:selectionId/reviews/:reviewId - ' + err.message,
      req,
      'error'
    );

    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function DELETE (
  req: Request,
  { params }: { params: { selectionId: string, reviewId: string } }
) {
  try {
    const reviewId = params.reviewId;
    const session = await getServerSession(authOptions());
    const userId = session?.user?.id;

    if (!userId) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const reviewImg = await getSelectionReviewImages(reviewId);

    await Promise.all(reviewImg.map(async (img) => {
      const fileName = extractFilePathFromUrl(img.reviewImgSrc);
      const fileExists = await checkIfFileExistsInS3(fileName);
      if (fileExists) {
        await deleteFileFromS3(fileName);
      }
    }));

    await deleteSelectionReviews(reviewId);

    if (!reviewId) {
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
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}