import { Ihashtags } from "@/models/hashtag.model";
import { getAutoCompleteRecommendTag } from "@/services/selectionSearch.services";
import { NextRequest, NextResponse } from "next/server";

export interface IAutoCompleteRecommendTagResult extends Ihashtags{
    reference_count : number
}

export async function GET(req: NextRequest): Promise<NextResponse<Ihashtags[]> > {
  const searchResult: IAutoCompleteRecommendTagResult[] = await getAutoCompleteRecommendTag();
  const mappingResult = mapAutoCompleteRecommendTagResult(searchResult)
  return NextResponse.json(mappingResult || []);

}

const mapAutoCompleteRecommendTagResult = (searchResult : IAutoCompleteRecommendTagResult[] ) : Ihashtags[] => {
    return searchResult.map((item) => (
        {
            htag_id : item.htag_id,
            htag_name : item.htag_name,
            htag_type : item.htag_type
        }
    ))
} 