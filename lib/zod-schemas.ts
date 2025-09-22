import { z } from "zod";

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "File name is required" }),
  contentType: z.string().min(1, { message: "File type is required" }),
  isImage: z.boolean(),
  size: z.number().min(1, { message: "Size is required" }),
});

export type FileUploadSchema = z.infer<typeof fileUploadSchema>;

const levels = ["beginner", "intermediate", "advanced"] as const;
const statuses = ["draft", "published", "archived"] as const;

export const courseCreateSchema = z.object({
  title: z.string().min(3, {
    error: "Title must be at least 3 characters long",
  }),
  slug: z.string().min(3, {
    error: "Slug must be at least 3 characters long",
  }),
  fileKey: z.string().min(1, {
    error: "File key must be at least 1 characters long",
  }),
  shortDescription: z.string().min(10, {
    error: "Short description must be at least 10 characters long",
  }),
  description: z.string().min(20, {
    error: "Description must be at least 20 characters long",
  }),
  regularPrice: z.coerce.number().min(1, {
    error: "Regular price must be at least 1",
  }),
  sellingPrice: z.coerce.number().min(1, {
    error: "Selling price must be at least 1",
  }),
  category: z.string().min(1, {
    error: "Category is required",
  }),
  level: z.string().min(1, {
    error: "Level is required",
  }),
  status: z.string().min(1, {
    error: "Status is required",
  }),
});

export const chapterCreateSchema = z.object({
  title: z.string().min(3, {
    error: "Chapter title must be at least 3 characters long",
  }),
  courseId: z.uuid({
    error: "Invalid course ID",
  }),
});
export type CourseCreateSchema = z.infer<typeof courseCreateSchema>;
export type ChapterCreateSchema = z.infer<typeof chapterCreateSchema>;
