import authOptions from '@/libs/authOptions';
import { manualRecommendationQueue } from '@/libs/queue';
import { Ihashtags } from '@/models/hashtag.model';
import { IsearchData } from '@/models/searchResult.model';
import { ErrorResponse } from '@/models/user.model';
import { serviceLoginRandomSelection, serviceRandomSelection, serviceRecommendationSelection } from '@/services/selectionMain.services';
import { getUserHashTags } from '@/services/user.services';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req : NextRequest) : Promise<NextResponse<any | ErrorResponse>> {
    try {
        const session = await getServerSession(authOptions());
        const session_userId = session ? session.user.id : null;
        let data;
        if(session_userId) {
            const hashtags = await getUserHashTags(session_userId)
            if(hashtags.length === 0) {
            data = await serviceLoginRandomSelection(session_userId);
            } else {
            await manualRecommendationQueue.add('recommendation', { userId: session_userId }); 
            data = await serviceRecommendationSelection(session_userId)
            }
        } else {
            data = await serviceRandomSelection();
        }

        const mappingResults = mapSearchResults(data);

        return  NextResponse.json(mappingResults);
    } catch (error) {
        return NextResponse.json({ error: "조회에 실패하였습니다." }, { status: 500 });
    }
}

const mapSearchResults = (results: IsearchData[]): any[] => {
    return results.map((item: IsearchData) => ({
      thumbnail: item.slt_img,
      category: item.slt_category_name,
      region: item.slt_location_option_name,
      selectionId: item.slt_id,
      hashtags:
        typeof item.slt_hashtags === "string"
          ? (JSON.parse(item.slt_hashtags) as Ihashtags[])
          : item.slt_hashtags,
      description: item.slt_description,
      title: item.slt_title,
      userName: item.user_nickname,
      userImage: item.user_img,
      status: item.slt_status,
      booked: item.is_bookmarked
    }));
  };
  