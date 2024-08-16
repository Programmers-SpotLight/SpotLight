import { Ihashtags } from "@/models/hashtag.model";
import { ISelectionDetailInfo } from "@/models/selection.model";
import { ISpotImage, ISpotInfo } from "@/models/spot.model";
import { ErrorResponse, SuccessResponse } from "@/models/user.model";
import {
  getBookMarks,
  getSelectionDetailInfo,
  getSelectionHashTags,
  getSpotDetailInfo,
  getSpotHashTags,
  getSpotImages
} from "@/services/selectionDetail.services";
import { serviceDeleteSelection } from "@/services/selectionUser.services";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { selectionId: number } }
) {
  const selectionId = params.selectionId;

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

  const booked = await getBookMarks(selectionId, 1); //임시로 userId 1로 설정

  const selectionData = {
    ...selecitonDetailInfo,
    hashtags,
    spotList: spotDetailInfo,
    booked: booked.length ? true : false
  };
  return NextResponse.json(selectionData);
}

export async function DELETE(req: NextRequest, { params }: { params: { selectionId: number }}): Promise<NextResponse<SuccessResponse | ErrorResponse >> {
  try {
    const selectionId = params.selectionId;
    const validationError = deleteSelectionValidator(selectionId);
      if (validationError) return validationError;
      const deleteSelection = await serviceDeleteSelection("1", selectionId);
      return NextResponse.json({ message: "성공적으로 삭제하였습니다."}, {status: 200});
  } catch (error) {
      return NextResponse.json({ error: "유효하지 않은 데이터입니다." }, { status: 400 });
  }
}

const deleteSelectionValidator = (selectionId : number): NextResponse<ErrorResponse> | null => {
 if (!selectionId) {
      return NextResponse.json({ error: "유효하지 않은 데이터입니다." }, { status: 400 });
  }
  // Todo: 쿠키로 받은 데이터와 ID가 일치하는지 유효성 추가
  return null;
};