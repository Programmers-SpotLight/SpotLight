import { addLike, removeLike } from "@/services/review.services";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { reviewId, reviewType, userId } = await req.json();

  try {
    addLike(reviewId, reviewType, userId);
    return NextResponse.json(
      { message: "Review like added successfully" },
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
  const { reviewId, reviewType, userId } = await req.json();

  console.log(reviewId, reviewType, userId);
  try {
    // removeLike(reviewId, reviewType, userId);
    return NextResponse.json(
      { message: "Review like removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to remove review like" },
      { status: 500 }
    );
  }
}
