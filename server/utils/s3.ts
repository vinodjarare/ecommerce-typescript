import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import Readable from 'stream';
import fs from 'fs';

const s3Client = new S3Client(/* configure your client here */);

const generateSignedUrl = async (key: string, expires: number = 600) => {
  if (process.env.BUCKET_NAME) {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    };

    const command = new GetObjectCommand(params);
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: expires,
    });

    return presignedUrl;
  } else {
    const server = process.env.SERVER_URL || 'http://127.0.0.1:5000/';
    return `${server}${key}`;
  }
};

const uploadFile = async (filename: string, body: Buffer) => {
  if (process.env.BUCKET_NAME) {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: filename,
      Body: body instanceof Readable ? body : Buffer.from(body),
    };

    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);

    return response.ETag;
  } else {
    fs.mkdirSync(filename.substring(0, filename.lastIndexOf('/')), {
      recursive: true,
    });
    return new Promise((resolve, reject) => {
      fs.writeFile(filename, body, err => {
        if (err) {
          reject(err);
        } else {
          resolve(filename);
        }
      });
    });
  }
};

const deleteFile = async (key: string) => {
  if (process.env.BUCKET_NAME) {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    const response = await s3Client.send(command);

    return response;
  } else {
    return new Promise((resolve, reject) => {
      fs.unlink(key, err => {
        if (err) {
          reject(err);
        } else {
          resolve({});
        }
      });
    });
  }
};

export {
  uploadFile,
  generateSignedUrl,
  deleteFile,
};
