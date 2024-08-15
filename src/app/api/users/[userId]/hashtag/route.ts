import { Ihashtags } from "@/models/hashtag.model";
import { ErrorResponse } from "@/models/searchResult.model";
import { SuccessResponse } from "@/models/user.model";
import { getUserHashTags, serviceDeleteUserHashtagById, servicePostUserHashtag } from "@/services/user.services";
import { NextRequest, NextResponse } from "next/server";

export interface IResponsePostUserHashtag {
    data : Ihashtags
}

export interface IResponseGetUserHashtag {
    data : Ihashtags[]
}

export async function GET(req : NextRequest, { params }: { params: { userId: string }}) : Promise<NextResponse<IResponseGetUserHashtag | ErrorResponse>> {
    try {
        const userId = params.userId
        const validationError = getHashtagValdator(userId);
        const hashtags = await getUserHashTags(userId);
        return  NextResponse.json({ data : hashtags});
    } catch (error) {
        return NextResponse.json({ error: "조회에 실패하였습니다." }, { status: 500 });
    }
}

export async function POST(req: NextRequest): Promise<NextResponse<IResponsePostUserHashtag | ErrorResponse >> {
    try {
        const { data } = await req.json();
        console.log(data);
        const validationError = postUserHashtagValidator(data);
        if (validationError) return validationError;
        const {htag_id, htag_name, htag_type} = await servicePostUserHashtag(data.userId, data.hashtag);

        return NextResponse.json({ data : {htag_id : htag_id, htag_name : htag_name, htag_type : htag_type}}, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "생성에 실패하였습니다." }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest): Promise<NextResponse<SuccessResponse | ErrorResponse >> {
        try {
        const { userId,userHashtagId } = await req.json();
        console.log(userId, userHashtagId)
        const validationError = deleteUserHashtagValdator(userId,userHashtagId);
        if (validationError) return validationError;
        await serviceDeleteUserHashtagById(userId,userHashtagId);
        return NextResponse.json({ message: "성공적으로 삭제하였습니다."}, {status: 200});
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "삭제에 실패하였습니다." }, { status: 400 });
    }
}

const postUserHashtagValidator = (data: {userId : string, hashtag : string}): NextResponse<ErrorResponse> | null => {
    if (!data || !data.hashtag) {
        return NextResponse.json({ error: "유효하지 않은 데이터입니다." }, { status: 400 });
    }
    if(data.hashtag.length > 10) {
        return NextResponse.json({ error: "10자 이내로 입력해주세요" }, { status: 400 });
    }
    // Todo: 쿠키로 받은 데이터와 ID가 일치하는지 유효성 추가
    return null;
};

const deleteUserHashtagValdator = (userId : string,userHashtagId : number) : NextResponse<ErrorResponse> | null => { 
    if (!userId || !userHashtagId) {
        return NextResponse.json({ error: "유효하지 않은 데이터입니다." }, { status: 400 });
    }
    return null
}

const getHashtagValdator = (userId : string) : NextResponse<ErrorResponse> | null => { 
    if (!userId) {
        return NextResponse.json({ error: "유효하지 않은 데이터입니다." }, { status: 400 });
    }
    return null
}