import { Ihashtags } from "./hashtag.model"

export type TselectionStatus = "public" | "private" | "temp"
export type TsortType = "popular" | "latest" | "asc"

export interface Ipagination {
    currentPage: number,
    totalPages: number,
    totalElements: number,
    limit: number,
}

export interface IsearchData {
	slt_title : string,
	slt_id: number,
	slt_img : string,
	slt_status : TselectionStatus,
	slt_cr_date : Date,
	slt_description : string,
	slt_category_name : string,
	slt_hashtags : Ihashtags[],
	user_id: number,
	user_nickname : string,
	user_img : string
}

export interface IsearchResult {
    data : IsearchData[]
    pagination : Ipagination
}

export interface ErrorResponse { // 병합 시 작성 모델 적용
	error: string;
  }
  