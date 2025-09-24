"use server";

import db from "@/lib/db";
import { chapters, courses, lessons } from "@/lib/db/schema";
import {
  chapterCreateSchema,
  courseCreateSchema,
  lessonCreateSchema,
} from "@/lib/zod-schemas";
import type {
  ChapterCreateSchema,
  CourseCreateSchema,
  LessonCreateSchema,
} from "@/lib/zod-schemas";
import { and, desc, eq } from "drizzle-orm";
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
export async function createChapter(data: ChapterCreateSchema) {
  try {
    const validation = chapterCreateSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid chapter data",
      };
    }
    await db.transaction(async (tx) => {
      const chapterOfMaxOrder = await tx.query.chapters.findFirst({
        where: eq(chapters.courseId, data.courseId),
        orderBy: desc(chapters.order),
      });

      await tx.insert(chapters).values({
        ...data,
        order: (chapterOfMaxOrder?.order ?? 0) + 1,
      });
    });
    revalidatePath(`/admin/courses/${data.courseId}/edit`);
    return {
      success: true,
      message: "Chapter created successfully",
    };
  } catch {
    return {
      success: false,
      error: "Failed to create chapter",
    };
  }
}
export async function createLesson(data: LessonCreateSchema) {
  try {
    const validation = lessonCreateSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid lesson data",
      };
    }
    await db.transaction(async (tx) => {
      const lessonOfMaxOrder = await tx.query.lessons.findFirst({
        where: eq(lessons.chapterId, data.chapterId),
        orderBy: desc(lessons.order),
      });

      await tx.insert(lessons).values({
        ...data,
        order: (lessonOfMaxOrder?.order ?? 0) + 1,
      });
    });
    revalidatePath(`/admin/courses/${data.courseId}/edit`);
    return {
      success: true,
      message: "Lesson created successfully",
    };
  } catch {
    return {
      success: false,
      error: "Failed to create lesson",
    };
  }
}
export async function deleteLesson(
  courseId: string,
  chapterId: string,
  lessonId: string
) {
  if (!courseId || !chapterId || !lessonId) {
    return {
      success: false,
      error: "Invalid course id, chapter id or lesson id",
    };
  }
  try {
    const chapterWithLessons = await db.query.chapters.findFirst({
      where: and(eq(chapters.id, chapterId), eq(chapters.courseId, courseId)),
      with: {
        lessons: {
          columns: {
            id: true,
            order: true,
          },
        },
      },
    });
    if (!chapterWithLessons) {
      return {
        success: false,
        error: "Chapter not found",
      };
    }
    if (!chapterWithLessons.lessons.length) {
      return {
        success: false,
        error: "Chapter has no lessons",
      };
    }
    const lessonToDelete = chapterWithLessons.lessons.find(
      (l) => l.id === lessonId
    );
    if (!lessonToDelete) {
      return {
        success: false,
        error: "Lesson not found in this chapter",
      };
    }
    await db.transaction(async (tx) => {
      await tx
        .delete(lessons)
        .where(and(eq(lessons.id, lessonId), eq(lessons.chapterId, chapterId)));
      const remainingLessons = chapterWithLessons.lessons.filter(
        (l) => l.id !== lessonId
      );
      remainingLessons.forEach(async (l, idx) => {
        await tx
          .update(lessons)
          .set({ order: idx + 1 })
          .where(and(eq(lessons.id, l.id), eq(lessons.chapterId, chapterId)));
      });
    });
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      success: true,
      message: "Lesson deleted successfully",
    };
  } catch {
    return {
      success: false,
      error: "Failed to delete lesson",
    };
  }
}
