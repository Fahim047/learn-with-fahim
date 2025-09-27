import { s3 } from "@/lib/s3-client";
import { fileUploadSchema } from "@/lib/zod-schemas";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = fileUploadSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid file upload schema",
        },
        { status: 400 }
      );
    }
    const { fileName, contentType, size } = validation.data;
    const uniqueKey = `${uuidv4()}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: uniqueKey,
      ContentType: contentType,
      ContentLength: size,
    });
    const presignedUrl = await getSignedUrl(s3, command, {
      expiresIn: 360, // 6 minutes
    });
    return NextResponse.json({
      presignedUrl,
      key: uniqueKey,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: (error as Error)?.message || "Failed to generate presigned URL",
      },
      { status: 500 }
    );
  }
}
