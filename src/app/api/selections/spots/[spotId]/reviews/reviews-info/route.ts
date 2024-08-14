import { averageReviews, countReviews, getSelectionReviews } from "@/services/selection-review.services";

export async function GET(
  req: Request,
  { params }: { params: { spotId: string } }
) {
  try {
    const spotId = params.spotId;
    const userId = 1;

    if (!userId) {
      return;
    }

    const count = await countReviews(spotId, "spot");
    const avg = await averageReviews(spotId, "spot");
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