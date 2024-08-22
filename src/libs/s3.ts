import { S3Client, PutObjectCommand, GetObjectCommand, GetObjectCommandOutput, ObjectCannedACL, GetBucketAclCommand } from '@aws-sdk/client-s3';

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
  fileContent: Buffer | string;
}

const getBucketAcl = async () => {
  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME as string,
  };

  try {
    const command = new GetBucketAclCommand(s3Params);
    const aclResponse = await s3.send(command);
    return aclResponse.Grants; // ACL 정보 반환
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Get Bucket ACL Error: ' + error.message);
    } else {
      throw new Error('Get Bucket ACL Error: An unknown error occurred.');
    }
  }
};

export const uploadFileToS3 = async ({ fileName, fileType, fileContent }: UploadFileParams) => {
  const s3Params: any = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Key: fileName,
    Body: fileContent instanceof Buffer ? fileContent : Buffer.from(fileContent), // Buffer로 변환
    ContentType: fileType,
  };

  try {
    const acl = await getBucketAcl();
    
    // S3Params에 ACL 설정이 존재하고 READ할 수 있는 경우에만 추가
    if (acl?.some(grant => grant.Permission === 'READ')) {
      s3Params.ACL = ObjectCannedACL.public_read;
    }

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