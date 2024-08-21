import { averageReviews, countReviews, getSelectionReviews } from "@/services/selectionReview.services";

export async function GET(
  req: Request,
  { params }: { params: { selectionId: string } }
) {
  try {
    const selectionId = parseInt(params.selectionId, 10);
    const userId = 1;

    if (!userId) {
      return;
    }

    const count = await countReviews(selectionId, "selection");
    const avg = await averageReviews(selectionId, "selection");
    const result = { 
      reviewAvg: avg, 
      reviewCount: count 
    };
    return Response.json(result);
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}