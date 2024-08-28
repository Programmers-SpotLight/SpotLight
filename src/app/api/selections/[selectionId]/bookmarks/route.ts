import authOptions from "@/libs/authOptions";
import { addBookMarks, removeBookMarks } from "@/services/selection.services";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  const { selectionId } = await req.json();
  const session = await getServerSession(authOptions());

  if (!selectionId || !session?.user.id) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    await addBookMarks(selectionId, session.user.id);
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
  const { selectionId } = await req.json();

  const session = await getServerSession(authOptions());
  try {
    if (!selectionId || !session?.user.id) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await removeBookMarks(selectionId, session.user.id);

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
