export function generateImageURL(fileKey: string) {
  return `${process.env.NEXT_PUBLIC_S3_BUCKET_IMAGES}/${fileKey}`;
}
