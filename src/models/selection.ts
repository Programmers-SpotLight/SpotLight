interface ISelectionDetail { // 임시 작성 타입 입니다. 수정하시면 될 것 같습니다.
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
