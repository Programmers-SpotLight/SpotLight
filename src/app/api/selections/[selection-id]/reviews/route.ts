import { averageReviews, countReviews, getSelectionReviews } from "@/services/review-service";

export async function GET(
  req: Request,
  { params }: { params: { selectionId: number } }
) {
  try {
    const { searchParams } = new URL(req.url);
    let selectionId = searchParams.get("selectionId") ?? 1;
    let page = searchParams.get("page") ?? 1;
    let sort = searchParams.get("sort") ?? "like";

    const sltOrSpotId = Number(selectionId);
    page = Number(page);
    
    const userId = 1;

    if (!userId) {
      return;
    }

    const reviewList = await getSelectionReviews({
      sltOrSpotId,
      sort,
      page
    });

    const count = await countReviews(sltOrSpotId, "selection");
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