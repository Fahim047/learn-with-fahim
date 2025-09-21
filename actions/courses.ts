"use server";

import db from "@/lib/db";
import { chapters, courses, lessons } from "@/lib/db/schema";
import { courseCreateSchema } from "@/lib/zod-schemas";
import type { CourseCreateSchema } from "@/lib/zod-schemas";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
export async function createCourse(data: CourseCreateSchema) {
  try {
    const validation = courseCreateSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid course data",
      };
    }

    // Convert string numbers to actual numbers for numeric fields
    const courseData = {
      ...data,
      regularPrice: data.regularPrice.toString(),
      sellingPrice: data.sellingPrice.toString(),
    };

    await db.insert(courses).values(courseData).returning();

    return {
      success: true,
      message: "Course created successfully",
    };
  } catch (error) {
    console.error("Error creating course:", error);
    return {
      success: false,
      error: "Failed to create course",
    };
  }
}
export async function updateCourse(id: string, data: CourseCreateSchema) {
  try {
    const validation = courseCreateSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid course data",
      };
    }

    // Convert string numbers to actual numbers for numeric fields
    const courseData = {
      ...data,
      regularPrice: data.regularPrice.toString(),
      sellingPrice: data.sellingPrice.toString(),
    };

    // check chapter id too
    await db.update(courses).set(courseData).where(eq(courses.id, id));

    return {
      success: true,
      message: "Course updated successfully",
    };
  } catch (error) {
    console.error("Error updating course:", error);
    return {
      success: false,
      error: "Failed to update course",
    };
  }
}
export async function reorderChapters(
  courseId: string,
  chapterItems: { id: string; order: number }[]
) {
  if (!courseId || !chapterItems.length) {
    return { success: false, error: "Invalid data" };
  }

  try {
    await db.transaction(async (tx) => {
      for (const ch of chapterItems) {
        await tx
          .update(chapters)
          .set({ order: ch.order })
          .where(eq(chapters.id, ch.id));
      }
    });

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      success: true,
      message: "Chapters reordered successfully",
    };
  } catch (error) {
    console.error("Error reordering chapters:", error);
    return {
      success: false,
      error: "Failed to reorder chapters",
    };
  }
}

export async function reorderChapterLessons(
  courseId: string,
  chapterId: string,
  lessonItems: { id: string; order: number }[]
) {
  try {
    if (!courseId || !chapterId || !lessonItems || lessonItems.length === 0) {
      return {
        success: false,
        error: "Invalid course id, chapter id or lessons",
      };
    }

    await db.transaction(async (tx) => {
      for (const l of lessonItems) {
        await db
          .update(lessons)
          .set({ order: l.order })
          .where(and(eq(lessons.id, l.id), eq(lessons.chapterId, chapterId)));
      }
    });

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      success: true,
      message: "Chapter lessons reordered successfully",
    };
  } catch (error) {
    console.error("Error reordering chapter lessons:", error);
    return {
      success: false,
      error: "Failed to reorder chapter lessons",
    };
  }
}
