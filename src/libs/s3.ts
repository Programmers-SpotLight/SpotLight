import { S3Client, PutObjectCommand, GetObjectCommand, GetObjectCommandOutput, ObjectCannedACL, HeadObjectCommand } from '@aws-sdk/client-s3';

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
  fileContent: Buffer | string | Uint8Array;
}
export const uploadFileToS3 = async ({ fileName, fileType, fileContent }: UploadFileParams) => {
  let body;

  if (fileContent instanceof Buffer) {
    body = fileContent;
  } else if (fileContent instanceof Uint8Array) {
    body = Buffer.from(fileContent);
  } else {
    body = Buffer.from(fileContent, 'base64');
  }

  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Key: fileName,
    Body: body,
    ContentType: fileType,
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

export const checkIfFileExistsInS3 = async (fileName: string): Promise<boolean> => {
  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Key: fileName,
  };

  try {
    const command = new HeadObjectCommand(s3Params);
    await s3.send(command);
    return true;
  } catch (error) {
    return false;
  }
}

export default s3;