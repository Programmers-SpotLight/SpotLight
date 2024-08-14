import { serviceUserDescription } from "@/services/user.services";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest): Promise<NextResponse<any>> {
    try {
        const { data } = await req.json();

        console.log(data)

        const validationError = updateUserDescriptionValidator(data);
        if (validationError) return validationError;

        const updateDescription = await serviceUserDescription("1", data.description);
        console.log(updateDescription);

        return NextResponse.json({ message: "성공적으로 수정하였습니다."}, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: "유효하지 않은 데이터입니다." }, { status: 400 });
    }
}

const updateUserDescriptionValidator = (data: any): NextResponse | null => {
   if (!data || !data.description) {
        return NextResponse.json({ error: "유효하지 않은 데이터입니다." }, { status: 400 });
    }
    if (data.description.length > 30) {
        return NextResponse.json({ error: "30자 이내로 입력해주세요" }, { status: 400 });
    }
    // Todo: 쿠키로 받은 데이터와 ID가 일치하는지

    return null;
};