export interface ISelectionCategory {
    id: number;
    name: string;
  }
  
  export interface ISelectionLocation {
    id: number;
    name: string;
    options: Array<{
      id: number;
      name: string;
    }>;
  }
  
  export interface ISelectionSpotSearchResult {
    name: string;
    id: string;
    formattedAddress: string;
    displayName: {
      text: string;
      languageCode: string;
    };
  }
  
  export interface ISelectionSpotGeolocation {
    latitude: number;
    longitude: number;
    formatted_address: string;
  }
  
  export interface ISelectionSpotReverseGeolocation {
    formatted_address: string;
    place_id: string;
  }
  
  export interface ISelectionSpot {
    placeId: string;
    name: string;
    description: string;
    formattedAddress: string;
    latitude: number;
    longitude: number;
    hashtags: string[];
    photos: Array<File | string>;
  }
  
  export interface ISelectionCreateFormData {
    temp?: boolean;
    category?: number;
    location?: { location: number, subLocation: number };
    name: string;
    description?: string;
    spots?: ISelectionSpot[];
    hashtags?: string[];
  }

export interface ISelectionDetail { // 임시 작성 타입 입니다. 수정하시면 될 것 같습니다.
    title : string;
    description : string;
    created_date? : Date;
    user : {
        id : number;
        nickname : string;
        image? : string;
    }
    category : {
        id : number,
        name : string
    }
    location : {
        is_world : boolean,
        region : string
    },
    image? : string;
    hashtag : string[];
    status : string | null;
}