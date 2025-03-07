'use server';

import fs from 'fs/promises';


// 디렉토리 또는 파일이 존재하는지 확인
export const checkIfDirectoryOrFileExists : (dirPath: string) => Promise<void> = async (
  dirPath: string
) => {
  try {
    await fs.access(dirPath);
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

// 디렉토리 생성
export const createDirectory : (dirPath: string) => Promise<void> = async (
  dirPath: string
) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    await checkIfDirectoryOrFileExists(dirPath);
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

export const saveFile : (filePath: string, file: File) => Promise<void> = async (
  filePath: string, 
  file: File
) => {
  const arrayBuffer : ArrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  try {
    await fs.writeFile(filePath, buffer);
    await checkIfDirectoryOrFileExists(filePath);
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
};

export const extractFileNameFromS3Url : (url: string) => string | null = (url: string) => {
  const regex = /^https:\/\/.*?\.amazonaws\.com(.*)/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1]; // This is the captured group containing the path after `.s3`
  } else {
    return null; // No match found or no path exists after `.s3`
  }
}
