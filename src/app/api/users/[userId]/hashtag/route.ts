import { ErrorResponse } from "@/models/searchResult.model";
import { SuccessResponse } from "@/models/user.model";
import { serviceDeleteUserHashtag, servicePostUserHashtag } from "@/services/user.services";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse<SuccessResponse | ErrorResponse >> {
    try {
        const { data } = await req.json();
        const validationError = postUserHashtagValidator(data);
        if (validationError) return validationError;
        await servicePostUserHashtag(data.userId, data.hashtag);

        return NextResponse.json({ message: "성공적으로 생성하였습니다."}, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: "생성에 실패하였습니다." }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest): Promise<NextResponse<SuccessResponse | ErrorResponse >> {
    try {
        const { data } = await req.json();
        const validationError = deleteUserHashtagValdator(data);
        await serviceDeleteUserHashtag(data.userId, data.hashtagId);

        if (validationError) return validationError;

        console.log(data.userId)

        return NextResponse.json({ message: "성공적으로 삭제하였습니다."}, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: "생성에 실패하였습니다." }, { status: 400 });
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

const deleteUserHashtagValdator = (data : {userId : string, hashtagId : number}) : NextResponse<ErrorResponse> | null => { 
    if (!data || !data.hashtagId) {
        return NextResponse.json({ error: "유효하지 않은 데이터입니다." }, { status: 400 });
    }
    return null
}