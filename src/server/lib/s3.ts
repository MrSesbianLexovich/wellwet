export const s3 = new Bun.S3Client({
  bucket: process.env.S3_BUCKET,
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
});
