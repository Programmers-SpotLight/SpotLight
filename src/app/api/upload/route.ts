import { NextApiRequest, NextApiResponse } from 'next';
import { uploadFileToS3, getFileFromS3 } from '@/libs/s3';

export const fileUploadHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    // 파일 업로드 처리
    const { fileName, fileType, fileContent } = req.body;

    try {
      const uploadResponse = await uploadFileToS3({ fileName, fileType, fileContent });
      res.status(200).json({ message: '파일 업로드 성공', data: uploadResponse });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }else{
        res.status(500).json({ error: error });
      }
    }
  } else if (req.method === 'GET') {
    // 파일 읽기 처리
    const { fileName } = req.query;

    if (typeof fileName !== 'string') {
      res.status(400).json({ error: 'Invalid file name' });
      return;
    }

    try {
      const fileContent = await getFileFromS3(fileName);
      res.status(200).send(fileContent); // 파일 내용을 응답으로 보냄
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }else{
        res.status(500).json({ error: error });
      }
    }
  } else {
    // 지원하지 않는 메서드 처리
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
