import path from 'path';
import { uploadFile } from './s3';

export interface IFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
}

export const upload = async (file: IFile, destination: string ) => {
  const name = Date.now() + path.extname(file.originalname);
  const url = `uploads/${destination}/${name}`;
  const pathName = await uploadFile(url, file.buffer);
  return pathName;
};
