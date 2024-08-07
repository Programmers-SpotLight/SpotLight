import { ISelectionDetailInfo } from "@/models/selection";
import { ISpotDetail, ISpotImage } from "@/models/spot";
import {
  getSelectionDetailInfo,
  getSelectionHashTags,
  getSpotDetailInfo,
  getSpotHashTags,
  getSpotImages
} from "@/services/selection-detail-service";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { selectionId: string } }
) {
  const selectionId = parseInt(params.selectionId, 10);

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

  const hashtags: string[] = await getSelectionHashTags(selectionId);
  if (hashtags.length === 0) {
    return NextResponse.json(
      { error: "There Is No HashTags" },
      { status: 404 }
    );
  }

  const spotDetailInfo: ISpotDetail[] = await getSpotDetailInfo(selectionId);
  if (spotDetailInfo.length === 0) {
    return NextResponse.json({ error: "There Is No Spots" }, { status: 404 });
  }

  for (let i = 0; i < spotDetailInfo.length; i++) {
    const spotImages: ISpotImage[] = await getSpotImages(spotDetailInfo[i].id);
    if (spotImages.length) spotDetailInfo[i].images = spotImages;

    const spotHashtags: string[] = await getSpotHashTags(spotDetailInfo[i].id);
    if (spotHashtags.length) spotDetailInfo[i].hashtags = spotHashtags;
  }

  selectionData = {
    ...selecitonDetailInfo,
    hashtags,
    spotList: spotDetailInfo
  };
  return NextResponse.json(selectionData);
}
