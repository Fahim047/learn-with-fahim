"use server";

import { requireUser } from "@/data/user/require-user";
import db from "@/lib/db";
import {
  chapters,
  courses,
  enrollments,
  lessonCompletions,
  lessons,
  user,
} from "@/lib/db/schema";
import env from "@/lib/env";
import { requireAdmin } from "@/lib/require-admin";
import { stripeClient } from "@/lib/stripe";
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
import { ServerActionResponse } from "@/types";
import { and, asc, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";
export async function createCourse(data: CourseCreateSchema) {
  await requireAdmin();
  try {
    const validation = courseCreateSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid course data",
      };
    }

    const stripeProduct = await stripeClient.products.create({
      name: data.title,
      description: data.shortDescription,
      default_price_data: {
        currency: "bdt",
        unit_amount: data.sellingPrice * 100,
      },
    });

    // Convert string numbers to actual numbers for numeric fields
    const courseData = {
      ...data,
      regularPrice: data.regularPrice.toString(),
      sellingPrice: data.sellingPrice.toString(),
      stripePriceId: stripeProduct.default_price as string,
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
  await requireAdmin();
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
  await requireAdmin();
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
  await requireAdmin();
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
  await requireAdmin();
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
  await requireAdmin();
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
  await requireAdmin();
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
export async function deleteChapter(courseId: string, chapterId: string) {
  await requireAdmin();
  if (!courseId || !chapterId) {
    return {
      success: false,
      error: "Invalid course id or chapter id",
    };
  }

  try {
    const courseWithChapters = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
      with: {
        chapters: {
          columns: {
            id: true,
            order: true,
          },
          orderBy: asc(chapters.order),
        },
      },
    });
    if (!courseWithChapters) {
      return {
        success: false,
        error: "Course not found",
      };
    }
    if (!courseWithChapters.chapters.length) {
      return {
        success: false,
        error: "Course has no chapters",
      };
    }
    const chapterToDelete = courseWithChapters.chapters.find(
      (c) => c.id === chapterId
    );
    if (!chapterToDelete) {
      return {
        success: false,
        error: "Chapter not found",
      };
    }
    const remainingChapters = courseWithChapters.chapters.filter(
      (c) => c.id !== chapterId
    );
    await db.transaction(async (tx) => {
      await tx
        .delete(chapters)
        .where(
          and(eq(chapters.id, chapterId), eq(chapters.courseId, courseId))
        );
      remainingChapters.forEach(async (c, idx) => {
        await tx
          .update(chapters)
          .set({ order: idx + 1 })
          .where(eq(chapters.id, c.id));
      });
    });
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      success: true,
      message: "Chapter deleted successfully",
    };
  } catch {
    return {
      success: false,
      error: "Failed to delete chapter",
    };
  }
}

export async function updateLessonContent(
  data: LessonCreateSchema,
  lessonId: string
) {
  await requireAdmin();
  try {
    const result = lessonCreateSchema.safeParse(data);
    if (!result.success) {
      return {
        success: false,
        error: "Invalid lesson data",
      };
    }
    await db
      .update(lessons)
      .set({
        title: result.data.title,
        description: result.data.description,
        thumbnailKey: result.data.thumbnailKey,
        videoKey: result.data.videoKey,
      })
      .where(eq(lessons.id, lessonId));
    return {
      success: true,
      message: "Lesson updated",
    };
  } catch {
    return {
      success: false,
      error: "Failed to update lesson content",
    };
  }
}

export async function deleteCourse(courseId: string) {
  const parsed = z.uuid().safeParse(courseId);
  if (!parsed.success) throw new Error("Invalid course id");

  await requireAdmin();

  const deleted = await db
    .delete(courses)
    .where(eq(courses.id, parsed.data))
    .returning();

  if (deleted.length === 0) {
    return { success: false, error: "Course not found" };
  }

  revalidatePath("/admin/courses");
  return { success: true, message: "Course deleted successfully" };
}

export async function enrollInCourse(
  courseId: string
): Promise<ServerActionResponse | never> {
  const userData = await requireUser();

  let checkoutSessionUrl: string = `./`;
  try {
    const parsed = z.uuid().safeParse(courseId);
    if (!parsed.success) throw new Error("Invalid course id");

    const course = await db.query.courses.findFirst({
      where: eq(courses.id, parsed.data),
    });
    if (!course) {
      return {
        success: false,
        message: "Course not found",
      };
    }

    let stripeCustomerId = userData.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripeClient.customers.create({
        email: userData.email,
        name: userData.name,
        metadata: {
          userId: userData.id,
        },
      });
      stripeCustomerId = customer.id;
      await db
        .update(user)
        .set({
          stripeCustomerId,
        })
        .where(eq(user.id, userData.id));
    }

    const result = await db.transaction(async (tx) => {
      const existingEnrollment = await tx.query.enrollments.findFirst({
        where: and(
          eq(enrollments.userId, userData.id),
          eq(enrollments.courseId, parsed.data)
        ),
        columns: {
          id: true,
          status: true,
        },
      });

      if (existingEnrollment?.status === "active") {
        return {
          success: false,
          message: "You are already enrolled in this course",
        };
      }

      let enrollment;

      if (existingEnrollment) {
        const updated = await tx
          .update(enrollments)
          .set({ status: "pending" })
          .where(
            and(
              eq(enrollments.userId, userData.id),
              eq(enrollments.courseId, parsed.data)
            )
          )
          .returning();

        enrollment = updated[0];
      } else {
        const inserted = await tx
          .insert(enrollments)
          .values({
            userId: userData.id,
            courseId: parsed.data,
          })
          .returning();

        enrollment = inserted[0];
      }

      // ✅ Create Stripe checkout session
      const checkoutSession = await stripeClient.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [
          {
            price: course.stripePriceId,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
        metadata: {
          courseId: parsed.data,
          enrollmentId: enrollment.id.toString(),
        },
      });
      return {
        enrollmentId: enrollment.id,
        checkoutSessionUrl: checkoutSession.url,
      };
    });
    checkoutSessionUrl = result.checkoutSessionUrl as string;
  } catch (error) {
    console.error("Error enrolling in course:", error);
    if (error instanceof stripeClient.errors.StripeAPIError) {
      return {
        success: false,
        message: "Payment System Error. Please try again later.",
      };
    }
    return {
      success: false,
      message: "Failed to enroll in course",
    };
  }

  redirect(checkoutSessionUrl);
}

export async function markLessonAsComplete(lessonId: string) {
  const user = await requireUser();
  const userId = user.id;
  try {
    const existing = await db.query.lessonCompletions.findFirst({
      where: (c, { and, eq }) =>
        and(eq(c.userId, userId), eq(c.lessonId, lessonId)),
    });

    if (existing) {
      return { success: false, message: "Lesson already marked as complete." };
    }

    await db.insert(lessonCompletions).values({
      userId,
      lessonId,
    });

    revalidatePath("/dashboard/courses");

    return { success: true, message: "Lesson marked as complete." };
  } catch (error) {
    console.error("❌ Error marking lesson as complete:", error);
    return {
      success: false,
      message: "Something went wrong while marking the lesson as complete.",
    };
  }
}
