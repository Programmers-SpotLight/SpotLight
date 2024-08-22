import { S3Client, PutObjectCommand, GetObjectCommand, GetObjectCommandOutput, ObjectCannedACL } from '@aws-sdk/client-s3';
import { Readable } from "stream";

// AWS S3 설정
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9_\u0600-\u06FF.]/g, '_');
}

interface UploadFileParams {
  fileName: string;
  fileType: string;
  fileContent: Buffer | string;
}

export const uploadFileToS3 = async ({ fileName, fileType, fileContent }: UploadFileParams): Promise<string> => {
  const sanitizedFileName = sanitizeFilename(fileName); // 파일명 안전하게 변환
  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Key: sanitizedFileName,
    Body: fileContent instanceof Buffer ? fileContent : Buffer.from(fileContent), // Buffer로 변환
    ContentType: fileType,
    // ACL: ObjectCannedACL.public_read,
  };

  try {
    const command = new PutObjectCommand(s3Params);
    await s3.send(command);

    // S3 URL 생성
    const s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${sanitizedFileName}`;
    return s3Url; // 생성된 S3 URL 반환
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('S3 Upload Error: ' + error.message);
    } else {
      throw new Error('S3 Upload Error: An unknown error occurred.');
    }
  }
};

// S3에서 파일 읽기 함수
export const getFileFromS3 = async (fileName: string): Promise<Buffer> => {
  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Key: sanitizeFilename(fileName),
  };

  try {
    const command = new GetObjectCommand(s3Params);
    const data = await s3.send(command);

    // data.Body를 Buffer로 변환
    if (data.Body instanceof Readable) {
      const chunks: Buffer[] = [];
      for await (const chunk of data.Body) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    } else {
      throw new Error('S3 Read Error: Invalid data stream.');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('S3 Read Error: ' + error.message);
    } else {
      throw new Error('S3 Read Error: An unknown error occurred.');
    }
  }
};

export default s3;
