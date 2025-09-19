"use server";

import db from "@/lib/db";
import { courses } from "@/lib/db/schema";
import { courseCreateSchema } from "@/lib/zod-schemas";
import type { CourseCreateSchema } from "@/lib/zod-schemas";
import { eq } from "drizzle-orm";
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
