import authOptions from "@/libs/authOptions";
import { countMyReviews, getMyReviews } from "@/services/review.services";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";


export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest
) {
  try {
    const { searchParams } = new URL(req.url);
    let page = searchParams.get("page") ?? 1;
    page = Number(page);
    
    const session = await getServerSession(authOptions());
    const userId = session?.user?.id;

    if (!userId) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
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