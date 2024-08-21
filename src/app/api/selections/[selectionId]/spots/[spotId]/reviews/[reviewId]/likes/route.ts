import { addLike, getLike, removeLike } from "@/services/review.services";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { reviewId, reviewType, userId } = await req.json();

  if (!reviewId || !reviewType || !userId) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    addLike(reviewId, reviewType, userId);
    const likeData = await getLike(reviewId, "spot", userId);

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
    const { reviewId, reviewType, userId } = data;

    if (!reviewId || !reviewType || !userId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await removeLike(reviewId, reviewType, userId);
    const likeData = await getLike(reviewId, "spot", userId);

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
