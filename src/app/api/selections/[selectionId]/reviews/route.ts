import { countReviews, getSelectionReviews, postSelectionReviews, putSelectionReviews } from "@/services/selection-review.services";
import { uuidToBinary } from "@/utils/uuidToBinary";

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
    
    const userId = 1;

    if (!userId) {
      return;
    }

    const reviewList = await getSelectionReviews({
      sltOrSpotId: selectionId,
      sort,
      page
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
      reviewId: uuidToBinary(),
      userId: userId,
      sltOrSpotId: selectionId,
      reviewDescription: data.reviewDescription,
      reviewScore: data.reviewScore,
      reviewImg: reviewImg
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
