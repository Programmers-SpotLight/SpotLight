import { ErrorResponse } from "@/models/searchResult.model";
import { SuccessResponse } from "@/models/user.model";
import { servicePutUserSelectionPrivate } from "@/services/selectionUser.services";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest): Promise<NextResponse<SuccessResponse | ErrorResponse >> {
    try {
        const { data } = await req.json();
        const validationError = updateUserSelectionPrivateValidator(data);
        if (validationError) return validationError;
        await servicePutUserSelectionPrivate(data.userId, data.selectionId);
        return NextResponse.json({ message: "성공적으로 수정하였습니다."}, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: "유효하지 않은 데이터입니다." }, { status: 400 });
    }
}

const updateUserSelectionPrivateValidator = (data: {description : string, selectionId : number}): NextResponse<ErrorResponse> | null => {
   if (!data || !data.selectionId) {
        return NextResponse.json({ error: "유효하지 않은 데이터입니다." }, { status: 400 });
    }
    // Todo: 쿠키로 받은 데이터와 ID가 일치하는지 유효성 추가
    return null;
};