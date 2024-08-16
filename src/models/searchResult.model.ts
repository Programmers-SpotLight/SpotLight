import { IColCardProps } from "@/components/common/card/ColCard";
import { Ihashtags } from "./hashtag.model"
import { ITempCardProps } from "@/components/common/card/TempCard";

export type TselectionStatus = "public" | "private" | "temp" | "delete"
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
	slt_location_option_name : string,
	slt_category_name : string,
	slt_hashtags : Ihashtags[],
	user_id: number,
	user_nickname : string,
	user_img : string
}

export interface ItempSelectionData {
	slt_temp_id : number,
	slt_temp_title : string,
	user_nickname : string,
	slt_category_name : string,
	slt_location_option_name : string,
	user_id : number,
	slt_category_id : number,
	slt_location_option_id : number;
	slt_temp_description: string,
    slt_temp_img: string,
    slt_temp_created_date: string,
    slt_temp_updated_date: string
}

export interface IsearchResult {
    data : IColCardProps[] // 카드 매핑 데이터 반환
    pagination : Ipagination
}

export interface ItempResult {
	data : ITempCardProps[],
	pagination : Ipagination
}

export interface ItempSelectionResult {
	data : ItempSelectionData[],
	pagination : Ipagination
}

export interface ErrorResponse { // 병합 시 작성 모델 적용
	error: string;
  }
  