import { Ihashtags } from "@/models/hashtag.model";
import { ErrorResponse } from "@/models/searchResult.model";
import { IUserInfoData, IUserInfoMapping } from "@/models/user.model";
import { getUserHashTags, getUserInfo } from "@/services/user.services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) : Promise<NextResponse<IUserInfoMapping | ErrorResponse>>{
    const userId = params.userId
    try {
      const userData : IUserInfoData = await getUserInfo(userId)
      const userHashData : Ihashtags[] = await getUserHashTags(userId)
      const userInfo : IUserInfoMapping = {
        image : userData.user_img,
        nickname : userData.user_nickname,
        description : userData.user_description,
        is_private : userData.user_is_private,
        isMyPage : true, //로그인 로직 생기면 로그인 검사,
        hashtags : userHashData,
        selection_count: userData.selection_count,
        bookmark_count: userData.bookmark_count,
        spot_review_count: userData.spot_review_count,
        selection_review_count: userData.selection_review_count
      }
      return NextResponse.json(userInfo);
    } catch (error) {
      return NextResponse.json(
        { error: "데이터 조회 중 오류 발생" },{ status: 500 }
      ); // Todo : 에러 처리
    }
  };
