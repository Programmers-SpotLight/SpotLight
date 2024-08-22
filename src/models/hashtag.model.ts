import { Knex } from "knex";

export type ThtagType = "none" | "popular"

export interface Ihashtags {
    htag_id: number;
    user_htag_id?: number;
    htag_name: string;
    htag_type: ThtagType;
}

export interface IInsertHashtag {
  htag_name: string;
}

export interface IInsertSelectionHashtag {
  slt_htag_id: Knex.Raw<any>;
  slt_id: number;
  htag_id: number;
}

export interface IInsertTemporarySelectionHashtag {
  slt_temp_htag_id: Knex.Raw<any>;
  slt_temp_id: number;
  htag_id: number;
}

export interface IInsertSpotHashtag {
  spot_htag_id: Knex.Raw<any>;
  spot_id: Knex.Raw<any>;
  htag_id: number;
}

export interface IInsertTemporarySpotHashtag {
  spot_temp_htag_id: Knex.Raw<any>;
  spot_temp_id: Knex.Raw<any>;
  htag_id: number;
}

export interface ISelectSelectionHashtag {
  name: string;
}