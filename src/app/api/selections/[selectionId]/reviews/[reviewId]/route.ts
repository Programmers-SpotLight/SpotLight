import { deleteSelectionReviews, putSelectionReviews } from "@/services/selection-review.services";
import { uuidToBinary } from "@/utils/uuidToBinary";
import { getServerSession } from "next-auth";
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'; 

export async function PUT (
  req: Request,
  { params }: { params: { selectionId: string, reviewId: string } }
) {
  try {
    const selectionId = parseInt(params.selectionId, 10);
    const reviewId = params.reviewId;
    
    const session = await getServerSession(authOptions);
    console.log(session);

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
      sltOrSpotId: selectionId,
      reviewDescription: data.reviewDescription,
      reviewScore: data.reviewScore,
      reviewImg: reviewImg
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
  } catch (err) {
    console.error(err);
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
    const userId = 1;
    if (!userId) {
      return;
    }

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
    console.error(err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}