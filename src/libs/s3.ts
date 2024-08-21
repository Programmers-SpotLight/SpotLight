import AWS from 'aws-sdk';

// AWS S3 설정
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

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
    const uploadResponse = await s3.upload(s3Params).promise();
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
export const getFileFromS3 = async (fileName: string) => {
  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Key: fileName,
  };

  try {
    const data = await s3.getObject(s3Params).promise();
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