import { QUERY_STRING_NAME } from "@/constants/queryString.constants";
import { dbConnectionPool } from "@/libs/db";
import { Ihashtags } from "@/models/hashtag.model";
import {
  ISelectionCreateCompleteData,
  ISelectionDetailInfo,
  ISelectionInfo
} from "@/models/selection.model";
import { ISpotImage, ISpotInfo } from "@/models/spot.model";
import { prepareAndValidateSelectionCreateFormData } from "@/services/selectionCreate.validation";
import {
  ErrorResponse,
  SuccessResponse,
  TuserSelection
} from "@/models/user.model";
import {
  getBookMarks,
  getSelectionDetailInfo,
  getSelectionHashTags,
  getSpotDetailInfo,
  getSpotHashTags,
  getSpotImages
} from "@/services/selectionDetail.services";
import { editSelection } from "@/services/selectionEdit.services";
import {
  serviceDeleteSelection,
  serviceDeleteTempSelection
} from "@/services/selectionUser.services";
import { getUserInfo } from "@/services/user.services";
import { getServerSession } from "next-auth";

import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { selectionId: number } }
) {
  const selectionId = params.selectionId;

  const session = await getServerSession(authOptions);

  if (!selectionId) {
    return NextResponse.json(
      { error: "Invalid selection ID" },
      { status: 400 }
    );
  }

  const selecitonDetailInfo: ISelectionDetailInfo =
    await getSelectionDetailInfo(selectionId);

  if (!selecitonDetailInfo) {
    return NextResponse.json(
      { error: "There Is No Selection Data" },
      { status: 404 }
    );
  }

  const hashtags: Ihashtags[] = await getSelectionHashTags(selectionId);
  if (hashtags.length === 0) {
    return NextResponse.json(
      { error: "There Is No HashTags" },
      { status: 404 }
    );
  }

  const spotDetailInfo: ISpotInfo[] = await getSpotDetailInfo(selectionId);
  if (spotDetailInfo.length === 0) {
    return NextResponse.json({ error: "There Is No Spots" }, { status: 404 });
  }

  if (!spotDetailInfo) {
    return NextResponse.json(
      { error: "There Is No Spot Data" },
      { status: 404 }
    );
  }
  spotDetailInfo.sort((a, b) => a.order - b.order);

  for (let i = 0; i < spotDetailInfo.length; i++) {
    const spotImages: ISpotImage[] = await getSpotImages(spotDetailInfo[i].id);
    if (spotImages.length) spotDetailInfo[i].images = spotImages;

    const spotHashtags: Ihashtags[] = await getSpotHashTags(
      spotDetailInfo[i].id
    );
    if (spotHashtags.length) spotDetailInfo[i].hashtags = spotHashtags;
  }

  const bookMark = await getBookMarks(selectionId, session?.user.id);
  const selectionWriterInfo = await getUserInfo(
    selecitonDetailInfo.writerId.toString()
  );

  const selectionData: ISelectionInfo = {
    ...selecitonDetailInfo,
    writer: selectionWriterInfo,
    hashtags,
    spotList: spotDetailInfo,
    booked: bookMark ? true : false
  };
  return NextResponse.json(selectionData);
}

export async function DELETE(
  req: NextRequest,
  {
    params
  }: { params: { selectionId: number; user_selection: TuserSelection } }
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    const url = req.nextUrl;
    const query = url.searchParams;
    const selectionId = params.selectionId;
    const selectionType = query.get(
      QUERY_STRING_NAME.userSelection
    ) as TuserSelection;

    console.log(selectionId, selectionType);
    const userId = "1"; // temp

    const validationError = deleteSelectionValidator(
      selectionId,
      selectionType,
      userId
    );
    if (validationError) return validationError;

    if (selectionType === "temp") {
      await serviceDeleteTempSelection(userId, selectionId);
      return NextResponse.json(
        { message: "성공적으로 임시 데이터를 삭제하였습니다." },
        { status: 200 }
      );
    } else {
      await serviceDeleteSelection(userId, selectionId);
      return NextResponse.json(
        { message: "성공적으로 데이터를 삭제하였습니다." },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "서버에서 오류가 발생했습니다." },
      { status: 500 } // Internal Server Error
    );
  }
}

const deleteSelectionValidator = (
  selectionId: number,
  selectionType: TuserSelection,
  userId: string
): NextResponse<ErrorResponse> | null => {
  const validSelectionTypes: TuserSelection[] = ["temp", "my", "bookmark"];
  if (!validSelectionTypes.includes(selectionType)) {
    return NextResponse.json(
      { error: "유효하지 않은 selectionType입니다." },
      { status: 400 }
    );
  }

  if (!selectionId) {
    return NextResponse.json(
      { error: "유효하지 않은 selectionId입니다." },
      { status: 400 }
    );
  }

  if (!userId) {
    return NextResponse.json(
      { error: "유효하지 않은 사용자입니다." },
      { status: 401 } // Unauthorized
    );
  }

  return null;
};

export async function PUT(
  request: NextRequest,
  { params }: { params: { selectionId: number } }
) {
  const selectionId = params.selectionId;

  if (!selectionId) {
    return new Response(JSON.stringify({ error: "Invalid selection ID" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  if (isNaN(selectionId)) {
    return new Response(JSON.stringify({ error: "Invalid selection ID" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  const transaction = await dbConnectionPool.transaction();
  try {
    const formData: FormData = await request.formData();
    // 데이터 유효성 검사
    const data: ISelectionCreateCompleteData =
      await prepareAndValidateSelectionCreateFormData(formData);
    // add logic for updating temporary selection
    await editSelection(transaction, selectionId, data);

    await transaction.commit();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error: any) {
    await transaction.rollback();
    console.error(error);
    return new Response(error.message, {
      status: error.statusCode || 500,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  }
}
