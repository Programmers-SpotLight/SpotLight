import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { GetObjectCommandOutput } from '@aws-sdk/client-s3';

// AWS S3 설정
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

interface UploadFileParams {
  fileName: string;
  fileType: string;
  fileContent: Buffer | ArrayBuffer | string; // 파일 내용의 타입
}

export const uploadFileToS3 = async ({ fileName, fileType, fileContent }: UploadFileParams) => {
  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Key: fileName,
    Body: fileContent,
    ContentType: fileType,
    ACL: 'public-read', // 파일을 공개적으로 읽을 수 있도록 설정
  };

  try {
    const command = new PutObjectCommand(s3Params);
    const uploadResponse = await s3.send(command);
    return uploadResponse; // 업로드된 파일의 정보 반환
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('S3 Upload Error: ' + error.message);
    } else {
      throw new Error('S3 Upload Error: An unknown error occurred.');
    }
  }
};

// S3에서 파일 읽기 함수
export const getFileFromS3 = async (fileName: string): Promise<GetObjectCommandOutput['Body']> => {
  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Key: fileName,
  };

  try {
    const command = new GetObjectCommand(s3Params);
    const data = await s3.send(command);
    return data.Body; // 파일 내용 반환
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('S3 Read Error: ' + error.message);
    } else {
      throw new Error('S3 Read Error: An unknown error occurred.');
    }
  }
};

export default s3;