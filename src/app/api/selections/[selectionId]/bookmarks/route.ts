import { addBookMarks, removeBookMarks } from "@/services/selection.services";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { selectionId, userId } = await req.json();

  if (!selectionId || !userId) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    await addBookMarks(selectionId, userId);
    return NextResponse.json(
      { message: "Bookmark added successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to add Bookmark" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const { selectionId, userId } = await req.json();
  try {
    if (!selectionId || !userId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await removeBookMarks(selectionId, userId);

    return NextResponse.json(
      { message: "BookMark removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to remove BookMark" },
      { status: 500 }
    );
  }
}
