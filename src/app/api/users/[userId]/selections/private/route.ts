import { ErrorResponse } from "@/models/searchResult.model";
import { SuccessResponse } from "@/models/user.model";
import { servicePutUserSelectionPrivate } from "@/services/selectionUser.services";
import { userIdValidator } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { userId: string }}): Promise<NextResponse<SuccessResponse | ErrorResponse >> {
    try {
        const { selectionId } = await req.json();
        const validationError = await updateUserSelectionPrivateValidator(selectionId, params.userId);
        if (validationError) return validationError;
        await servicePutUserSelectionPrivate(params.userId, selectionId);
        return NextResponse.json({ message: "성공적으로 수정하였습니다."}, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: "유효하지 않은 데이터입니다." }, { status: 400 });
    }
}

const updateUserSelectionPrivateValidator = async (selectionId : number, userId : string): Promise<NextResponse<ErrorResponse> | null> => {
    const userIdError = await userIdValidator(userId);
    if (userIdError) return userIdError;
   
    if (!selectionId) {
        return NextResponse.json({ error: "유효하지 않은 데이터입니다." }, { status: 400 });
    }
    return null;
};