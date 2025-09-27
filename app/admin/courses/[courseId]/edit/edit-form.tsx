"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, SparkleIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import TipTapEditor from "@/components/rich-text-editor/tip-tap-editor";
import FileUploader from "@/components/file-uploader/file-uploader";
import { courseCreateSchema } from "@/lib/zod-schemas";
import type { CourseCreateSchema } from "@/lib/zod-schemas";
import { useTransition } from "react";
import { tryCatch } from "@/lib/try-catch";
import { updateCourse } from "@/actions/courses";
import { toast } from "sonner";
import { capitalize } from "@/lib/capitalize";
import { useRouter } from "next/navigation";
import { AdminCourseEditType } from "@/data/admin/admin-get-course";
const categories = [
  "web development",
  "mobile development",
  "data science",
  "ai & machine learning",
  "business & management",
  "design",
  "health & fitness",
  "marketing",
  "personal development",
  "photography",
  "product design",
  "video production",
  "writing & content",
  "other",
] as const;
const levels = ["beginner", "intermediate", "advanced"] as const;
const statuses = ["draft", "published", "archived"] as const;
export default function EditCourseForm({
  data,
}: {
  data: AdminCourseEditType;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(courseCreateSchema),
    defaultValues: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      shortDescription: data.shortDescription,
      category: data.category,
      level: data.level,
      fileKey: data.fileKey,
      status: data.status,
      regularPrice: data.regularPrice,
      sellingPrice: data.sellingPrice,
    },
    mode: "onChange",
  });
  const onSubmit = (values: CourseCreateSchema) => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        updateCourse(data.id, values)
      );
      if (error) {
        toast.error("Failed to update");
      }
      if (result?.success) {
        toast.success(result.message);
        form.reset({
          title: "",
          slug: "",
          description: "",
          shortDescription: "",
          category: "",
          level: "",
          fileKey: "",
          status: "draft",
          regularPrice: 0,
          sellingPrice: 0,
        });
        router.push("/admin/courses");
      }
    });
  };
  function generateSlug() {
    const title = form.getValues("title");
    const slug = slugify(title);
    form.setValue("slug", slug, { shouldValidate: true });
  }
  return (
    <div className="h-full">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/courses"
          className={buttonVariants({
            variant: "outline",
          })}
        >
          <ArrowLeft />
          <span>Back</span>
        </Link>
        <h1 className="text-2xl font-bold">Create Course</h1>
      </div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Basic Information
          </CardTitle>
          <CardDescription>
            Fill in the basic information of the course.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter course title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-end gap-4">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter course slug" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="button" onClick={generateSlug}>
                  Generate Slug <SparkleIcon />
                </Button>
              </div>
              <FormField
                control={form.control}
                name="fileKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail Image</FormLabel>
                    <FormControl>
                      <FileUploader
                        onChange={field.onChange}
                        value={field.value}
                        acceptedFileType="image"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="resize-none"
                        placeholder="Enter course short description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category}
                              value={category}
                              className="capitalize"
                            >
                              {capitalize(category)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {levels.map((level) => (
                            <SelectItem
                              key={level}
                              value={level}
                              className="capitalize"
                            >
                              {capitalize(level)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="regularPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regular Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter regular price"
                          {...field}
                          value={(field.value as number) || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sellingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selling Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter selling price"
                          {...field}
                          value={(field.value as number) || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <TipTapEditor field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem
                            key={status}
                            value={status}
                            className="capitalize"
                          >
                            {capitalize(status)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" disabled={isPending}>
                {isPending ? (
                  <>
                    <span>Updating...</span>
                    <Loader2 className="animate-spin ml-1" />
                  </>
                ) : (
                  <span>Update Course</span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
