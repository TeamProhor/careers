import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";

const s3 = new S3Client({
  region: process.env.S3_REGION || "garage",
  endpoint: process.env.S3_ENDPOINT || "https://cdn.prohor.dev",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
  },
  forcePathStyle: true,
});

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user?.isAdmin) {
    return NextResponse.json({ error: "অ্যাক্সেস অস্বীকৃত" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (!key?.startsWith("resumes/")) {
    return NextResponse.json({ error: "অবৈধ ফাইল পাথ" }, { status: 400 });
  }

  const bucket = process.env.S3_BUCKET || "prohor-careers";

  const obj = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));

  const stream = obj.Body as ReadableStream;
  const filename = key.split("/").pop() ?? "resume.pdf";

  return new Response(stream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
