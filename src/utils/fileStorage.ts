'use server';

import { AllowedFileTypes } from '@/models/file.model';
import fs from 'fs/promises';


export const checkIfDirectoryOrFileExists = async (dirPath: string) => {
  try {
    await fs.access(dirPath);
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

export const createDirectory = async (dirPath: string) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    await checkIfDirectoryOrFileExists(dirPath);
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

export const saveFile = async (filePath: string, file: AllowedFileTypes) => {
  try {
    await fs.writeFile(filePath, file);
    await checkIfDirectoryOrFileExists(filePath);
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
};