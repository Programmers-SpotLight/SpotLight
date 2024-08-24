import authOptions from "@/libs/authOptions";
import { checkIfFileExistsInS3, deleteFileFromS3, uploadFileToS3 } from "@/libs/s3";
import { extractFilePathFromUrl } from "@/services/selectionReview.services";
import { deleteSpotReviews, getSpotReviewImages, putSpotReviews } from "@/services/spotReview.services";
import { uuidToBinary, uuidToString } from "@/utils/uuidToBinary";
import { getServerSession } from "next-auth";
import { posix } from "path";

export async function PUT (
  req: Request,
  { params }: { params: { spotId: string, reviewId: string } }
) {
  try {
    const spotId = params.spotId;
    const reviewId = params.reviewId;
    const session = await getServerSession(authOptions());
    const userId = session?.user?.id;

    if (!userId) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    
    const data:IReviewFormData = await req.json();

    const oldReviewImages = await getSpotReviewImages(reviewId);
    const newImageUrls = data.reviewImg?.map((img) => img.reviewImgSrc);

    // 기존 이미지를 S3에서 삭제
    await Promise.all(
      oldReviewImages.map(async (img) => {
        if (!newImageUrls || !newImageUrls.includes(img.reviewImgSrc)) {
          const fileName = extractFilePathFromUrl(img.reviewImgSrc);
          const fileExists = await checkIfFileExistsInS3(fileName);
          if (fileExists) {
            await deleteFileFromS3(fileName);
          }
        }
      })
    );

    // 새 이미지 업로드 또는 기존 이미지 유지
    const reviewImgPromises = data.reviewImg?.map(async (img, index) => {
      const reviewImgId = uuidToBinary();
      if (!(img.reviewImgSrc.startsWith('https://') || img.reviewImgSrc.startsWith('http://'))) {
        const [meta, base64Data] = img.reviewImgSrc.split(",");
        const fileType = meta.split(";")[0].split(":")[1];
        const fileContent = Buffer.from(base64Data, "base64");
        const fileName = `public/images/reviews/spot/${uuidToString(reviewImgId)}.${fileType.split("/")[1]}`;
        const fileDirectory = posix.join(fileName);

        await uploadFileToS3({
          fileName: fileDirectory,
          fileType,
          fileContent,
        });

        const s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileDirectory}`;

        return {
          reviewImgId,
          reviewImgSrc: s3Url,
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
      reviewId: reviewId,
      userId: userId,
      sltOrSpotId: spotId,
      reviewDescription: data.reviewDescription,
      reviewScore: data.reviewScore,
      reviewImg: reviewImages
    };

    await putSpotReviews(review);

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

export async function DELETE (
  req: Request,
  { params }: { params: { spotId: string, reviewId: string } }
) {
  try {
    const reviewId = params.reviewId;
    const session = await getServerSession(authOptions());
    const userId = session?.user?.id;

    if (!userId) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const reviewImg = await getSpotReviewImages(reviewId);

    await Promise.all(reviewImg.map(async (img) => {
      const fileName = extractFilePathFromUrl(img.reviewImgSrc);
      const fileExists = await checkIfFileExistsInS3(fileName);
      if (fileExists) {
        await deleteFileFromS3(fileName);
      }
    }));

    await deleteSpotReviews(reviewId);

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
    console.error(err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}