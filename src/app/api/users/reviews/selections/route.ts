import { countMyReviews, getMyReviews } from "@/services/review.services";

export async function GET(
  req: Request
) {
  try {
    const { searchParams } = new URL(req.url);
    let page = searchParams.get("page") ?? 1;
    page = Number(page);
    
    const userId = 1;

    if (!userId) {
      return;
    }
    
    const reviewList = await getMyReviews(
      "selection",
      userId,
      page
    );

    const count = await countMyReviews("selection", userId);

    const result = {
      reviews: reviewList,
      pagination: {
        currentPage: +page,
        limit: 5,
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