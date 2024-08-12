import { deleteSpotReviews, putSpotReviews } from "@/services/spot-review.services";
import { uuidToBinary } from "@/utils/uuidToBinary";

export async function PUT (
  req: Request,
  { params }: { params: { spotId: string, reviewId: string } }
) {
  try {
    const spotId = params.spotId;
    const reviewId = params.reviewId;
    const userId = 1;

    if (!userId) {
      return;
    }

    const data:IReviewFormData = await req.json();

    const reviewImg: IReviewImage[] | null = data.reviewImg?.map((img, index) => ({
      reviewImgId: uuidToBinary(),
      reviewImgSrc: img.reviewImgSrc,
      reviewImageOrder: index,
    })) || null;

    const review = {
      reviewId: reviewId,
      userId: userId,
      sltOrSpotId: spotId,
      reviewDescription: data.reviewDescription,
      reviewScore: data.reviewScore,
      reviewImg: reviewImg
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
    const userId = 1;
    if (!userId) {
      return;
    }

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