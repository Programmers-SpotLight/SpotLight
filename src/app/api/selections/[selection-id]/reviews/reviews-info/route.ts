import { averageReviews, countReviews, getSelectionReviews } from "@/services/review-service";

export async function GET(
  req: Request,
  { params }: { params: { selectionId: number } }
) {
  try {
    const { searchParams } = new URL(req.url);
    let selectionId = searchParams.get("selectionId") ?? 1;
    const sltOrSpotId = Number(selectionId);
    const userId = 1;

    if (!userId) {
      return;
    }

    const count = await countReviews(sltOrSpotId, "selection");
    const avg = await averageReviews(sltOrSpotId, "selection");
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