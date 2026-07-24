// utils/s3Utils.ts
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

export const uploadImageToS3 = async (file: Express.Multer.File): Promise<string> => {
    if (!process.env.S3_BUCKET_NAME) {
        throw new Error('S3_BUCKET_NAME is not defined');
    }

    console.log('Starting S3 upload...');
    console.log(`Bucket: ${process.env.S3_BUCKET_NAME}`);
    console.log(`Key: ${uuidv4()}-${file.originalname}`);
    console.log(`ContentType: ${file.mimetype}`);

    const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${uuidv4()}-${file.originalname}`, // Unique filename
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    try {
        const result = await s3.upload(uploadParams).promise();
        console.log('Upload successful:', result);
        return result.Location; // URL of the uploaded image
    } catch (error) {
        console.error('S3 upload error:', error);
        throw error;
    }
};

export const deleteImageFromS3 = async (key: string): Promise<void> => {
    if (!process.env.S3_BUCKET_NAME) {
        throw new Error('S3_BUCKET_NAME is not defined');
    }

    console.log('Starting S3 delete...');
    console.log(`Bucket: ${process.env.S3_BUCKET_NAME}`);
    console.log(`Key: ${key}`);

    const deleteParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
    };

    try {
        await s3.deleteObject(deleteParams).promise();
        console.log('Delete successful');
    } catch (error) {
        console.error('S3 delete error:', error);
        throw error;
    }
};