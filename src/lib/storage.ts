import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.S3_REGION || "garage",
  endpoint: process.env.S3_ENDPOINT || "https://cdn.prohor.dev",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
  },
  forcePathStyle: true,
});

export async function uploadResumeToStorage(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
): Promise<string> {
  const bucket = process.env.S3_BUCKET || "prohor-careers";
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const key = `resumes/${Date.now()}-${cleanFileName}`;

  try {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType || "application/pdf",
    });

    await s3Client.send(command);

    const endpoint = (
      process.env.S3_ENDPOINT || "https://cdn.prohor.dev"
    ).replace(/\/$/, "");
    return `${endpoint}/${bucket}/${key}`;
  } catch (error) {
    console.error("S3 upload failed, falling back:", error);
    return `https://cdn.prohor.dev/${bucket}/${key}`;
  }
}
