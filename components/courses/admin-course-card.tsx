"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AdminCourseType } from "@/data/admin/admin-get-courses";
import { generateImageURL } from "@/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Button, buttonVariants } from "../ui/button";
import { EditIcon, EllipsisVertical, Eye, Pencil, Trash } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface AdminCourseCardProps {
  data: AdminCourseType;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function AdminCourseCard({
  data,
  onView,
  onEdit,
  onDelete,
}: AdminCourseCardProps) {
  return (
    <Card className="group pt-0 relative overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition">
      <div className="absolute right-2 top-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-background/80 backdrop-blur-sm"
            >
              <EllipsisVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild onClick={() => onView?.(data.id)}>
              <Link href={`/admin/courses/${data.id}/view`}>
                <Eye />
                Preview
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild onClick={() => onEdit?.(data.id)}>
              <Link href={`/admin/courses/${data.id}/edit`}>
                <Pencil />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete?.(data.id)}
            >
              <Trash />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative w-full aspect-video">
        <Image
          src={generateImageURL(data?.fileKey)}
          alt={data?.title}
          fill
          className="object-cover"
        />
        <Badge
          className={cn(
            "absolute bottom-2 right-2 capitalize",
            data.status === "draft" && "bg-muted text-foreground",
            data.status === "published" && "bg-green-600 text-white",
            data.status === "archived" && "bg-yellow-600 text-white"
          )}
        >
          {data.status}
        </Badge>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold line-clamp-1">
          {data.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {data.shortDescription}
        </p>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <span className="text-2xl font-medium text-primary">
            ${data.sellingPrice}
          </span>
          <Badge variant="outline" className="capitalize">
            {data.level}
          </Badge>
        </div>
        <div className="mt-4">
          <Link
            href={`/admin/courses/${data.id}/edit`}
            className={buttonVariants({
              className: "w-full",
            })}
          >
            <EditIcon />
            Edit Course
          </Link>
        </div>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground">
        Updated {new Date(data.updatedAt).toLocaleDateString()}
      </CardFooter>
    </Card>
  );
}
