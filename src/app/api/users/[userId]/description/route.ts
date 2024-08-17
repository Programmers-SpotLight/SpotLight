import { ErrorResponse } from "@/models/searchResult.model";
import { SuccessResponse } from "@/models/user.model";
import { serviceUserDescription } from "@/services/user.services";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest): Promise<NextResponse<SuccessResponse | ErrorResponse >> {
    try {
        const { data } = await req.json();
        const validationError = updateUserDescriptionValidator(data);
        if (validationError) return validationError;
        const updateDescription = await serviceUserDescription(data.userId, data.description);
        return NextResponse.json({ message: "성공적으로 수정하였습니다."}, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: "유효하지 않은 데이터입니다." }, { status: 400 });
    }
}

const updateUserDescriptionValidator = (data: {description : string, userId : string}): NextResponse<ErrorResponse> | null => {
   if (!data || !data.description) {
        return NextResponse.json({ error: "유효하지 않은 데이터입니다." }, { status: 400 });
    }
    if (data.description.length > 50) {
        return NextResponse.json({ error: "50자 이내로 입력해주세요" }, { status: 400 });
    }
    // Todo: 쿠키로 받은 데이터와 ID가 일치하는지 유효성 추가
    return null;
};