import { Ihashtags } from "@/models/hashtag.model";
import { ISelectionDetailInfo } from "@/models/selection.model";
import { ISpotImage, ISpotInfo } from "@/models/spot.model";
import {
  getBookMarks,
  getSelectionDetailInfo,
  getSelectionHashTags,
  getSpotDetailInfo,
  getSpotHashTags,
  getSpotImages
} from "@/services/selectionDetail.services";

import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { selectionId: number } }
) {
  const selectionId = params.selectionId;

  let selectionData = {};

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

  for (let i = 0; i < spotDetailInfo.length; i++) {
    const spotImages: ISpotImage[] = await getSpotImages(spotDetailInfo[i].id);
    if (spotImages.length) spotDetailInfo[i].images = spotImages;

    const spotHashtags: Ihashtags[] = await getSpotHashTags(
      spotDetailInfo[i].id
    );
    if (spotHashtags.length) spotDetailInfo[i].hashtags = spotHashtags;
  }

  const booked = await getBookMarks(selectionId, 1); //임시로 userId 1로 설정

  selectionData = {
    ...selecitonDetailInfo,
    hashtags,
    spotList: spotDetailInfo,
    booked: booked.length ? true : false
  };
  return NextResponse.json(selectionData);
}