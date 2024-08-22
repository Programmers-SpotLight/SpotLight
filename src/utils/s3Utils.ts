import { extname, posix } from 'path';
import { NextRequest } from 'next/server';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9_\u0600-\u06FF.]/g, '_');
}

export async function uploadImage(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('profilePicture') as unknown as File | null;
    if (!file) {
      throw new Error('File blob is required.');
    }

    const fileExtension = extname(file.name).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error('Invalid file type.');
    }

    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const originalFilename = file.name.replace(/\.[^/.]+$/, '');
    const sanitizedFilename = sanitizeFilename(originalFilename);
    const filename = `${sanitizedFilename}_${uniqueSuffix}${fileExtension}`;
    const fileDirectory = posix.join('images/profile', filename);

    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!,
      },
    });

    const uploadParams = {
      Bucket: process.env.AWS_S3_NAME!,
      Key: fileDirectory!,
      Body: file,
      ContentType: file.type!,
    };

    const upload = new Upload({
      client: s3Client,
      params: uploadParams,
    });

    const uploadResponse = await upload.done();
    const url = `https://${process.env.AWS_S3_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileDirectory}`;

    return url;
  } catch (e) {
    console.error('파일 업로드 중 오류 발생:', e);
    throw new Error('Something went wrong.');
  }
}
