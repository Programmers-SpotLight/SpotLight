import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { countReviews } from "@/services/selection-review.services";
import { getSpotReviews, postSpotReviews } from "@/services/spot-review.services";
import { uuidToBinary } from "@/utils/uuidToBinary";
import { getServerSession } from "next-auth";

export async function GET(
  req: Request,
  { params }: { params: { spotId: string } }
) {
  try {
    const spotId = params.spotId;
    const { searchParams } = new URL(req.url);
    let page = searchParams.get("page") ?? 1;
    let sort = searchParams.get("sort") ?? "like";
    page = Number(page);

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const reviewList = await getSpotReviews({
      sltOrSpotId: spotId,
      sort,
      page,
      userId
    });

    const count = await countReviews(spotId, "spot");
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
  { params }: { params: { spotId: string } }
) {
  try {
    const spotId = params.spotId;
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
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
      sltOrSpotId: spotId,
      reviewDescription: data.reviewDescription,
      reviewScore: data.reviewScore,
      reviewImg: reviewImg
    };

    await postSpotReviews(review);

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
