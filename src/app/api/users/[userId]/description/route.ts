import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ErrorResponse } from "@/models/searchResult.model";
import { SuccessResponse } from "@/models/user.model";
import { serviceUserDescription } from "@/services/user.services";
import { userIdValidator } from "@/utils/authUtils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { userId: string }}): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
    try {
        const { description } = await req.json();
        const session = await getServerSession(authOptions);
        const session_userId = session ? session.user.id : null;

        const validationError = validateUpdate(description, params.userId, session_userId);
        if (validationError) return validationError;

        await serviceUserDescription(session_userId, description);
        return NextResponse.json({ message: "성공적으로 수정하였습니다." }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "유효하지 않은 데이터입니다." }, { status: 400 });
    }
}

const validateUpdate = (description: string, userId: string, session_userId: number | null): NextResponse<ErrorResponse> | null => {
    const userIdError = userIdValidator(userId, session_userId);
    if (userIdError) return userIdError;

    if (!description) {
        return NextResponse.json({ error: "유효하지 않은 데이터입니다." }, { status: 400 });
    }

    if (description.length > 50) {
        return NextResponse.json({ error: "50자 이내로 입력해주세요" }, { status: 400 });
    }

    return null;
};
