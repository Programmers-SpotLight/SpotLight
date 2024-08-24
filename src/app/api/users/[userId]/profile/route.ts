import { checkIfFileExistsInS3, deleteFileFromS3, uploadFileToS3 } from "@/libs/s3";
import { ErrorResponse } from "@/models/searchResult.model";
import { SuccessResponse } from "@/models/user.model";
import { serviceGetUserProfile, serviceUserUpdateProfile } from "@/services/user.services";
import { userIdValidator } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest, 
  { params }: { params: { userId: string } }
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
    try {
        const formData = await req.formData();
        const img = formData.get('image') as File | null;

        if (!img) return NextResponse.json({ error: "파일이 제공되지 않았습니다." }, { status: 400 });
        const validationError = await validateProfileUpdate(img, params.userId);
        if (validationError) return validationError;

        const arrayBuffer = await img.arrayBuffer();
        const fileContent = Buffer.from(arrayBuffer);
        const fileName = `public/images/users/${params.userId}.${img.name}`

        await deleteUserProfileImage(params.userId); // 수정하는 경우 버킷에 기존 업로드 된 이미지 삭제
        
        await uploadFileToS3({
            fileName, 
            fileType: img.type, 
            fileContent
        });

        const s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        await serviceUserUpdateProfile(params.userId, s3Url);
        return NextResponse.json({ message: "성공적으로 수정하였습니다." }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "서버 오류가 발생하였습니다." }, { status: 500 });
    }
}

const validateProfileUpdate = async (
  file: File | null, 
  userId: string
): Promise<NextResponse<ErrorResponse> | null> => {
    const userIdError = await userIdValidator(userId);
    if (userIdError) return userIdError;

    if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: "파일이 제공되지 않았습니다." }, { status: 400 });
    }

    const validFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validFileTypes.includes(file.type)) {
        return NextResponse.json({ error: "유효하지 않은 파일 형식입니다." }, { status: 400 });
    }

    return null;
};

export const deleteUserProfileImage = async (userId: string) => {
    try {
        const imgUrl = await serviceGetUserProfile(userId);

        if (imgUrl) {
            const fileName = imgUrl.split('/').slice(3).join('/');
            const exists = await checkIfFileExistsInS3(fileName);
            if (exists) {
                await deleteFileFromS3(fileName);
            }
        }
    } catch (error) {
        console.error("Error deleting user image:", error);
        throw error;
    }
};