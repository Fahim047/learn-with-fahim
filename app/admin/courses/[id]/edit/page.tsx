import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminGetCourse } from "@/data/admin/admin-get-course";
import { tryCatch } from "@/lib/try-catch";
import EditCourseForm from "./edit-form";
import EditCourseContent from "./edit-course-content";

export default async function AdminCourseEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: course, error } = await tryCatch(adminGetCourse(id));
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>{error.message}</p>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-2xl font-bold">Edit Course: {course.title}</h1>
      <Tabs defaultValue="basic" className="mt-4">
        <TabsList className="w-full">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="course-content">Course Content</TabsTrigger>
        </TabsList>
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Fill in the basic information of the course.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditCourseForm data={course} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="course-content">
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>
                Fill in the course content of the course.
              </CardDescription>
            </CardHeader>
            <EditCourseContent data={course} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
