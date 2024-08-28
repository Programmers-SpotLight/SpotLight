import authOptions from "@/libs/authOptions";
import { addLike, getLike, removeLike } from "@/services/review.services";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { reviewId, reviewType } = await req.json();

  const session = await getServerSession(authOptions());
  if (!reviewId || !reviewType || !session?.user.id) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    addLike(reviewId, reviewType, session.user.id);
    const likeData = await getLike(reviewId, "spot", session.user.id);

    return NextResponse.json(
      { message: "Review like added successfully", data: likeData },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "failed to add review like" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const data = await req.json();
    const { reviewId, reviewType } = data;

    const session = await getServerSession(authOptions());
    if (!reviewId || !reviewType || !session?.user.id) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await removeLike(reviewId, reviewType, session.user.id);
    const likeData = await getLike(reviewId, "spot", session.user.id);

    return NextResponse.json(
      { message: "Review like removed successfully", data: likeData },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to remove review like" },
      { status: 500 }
    );
  }
}
