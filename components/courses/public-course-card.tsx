import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { generateImageURL } from "@/utils";
import { buttonVariants } from "../ui/button";

interface PublicCourseCardProps {
  id: string;
  title: string;
  shortDescription?: string;
  thumbnailKey?: string;
}

export function PublicCourseCard({
  id,
  title,
  shortDescription,
  thumbnailKey,
}: PublicCourseCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col pt-0">
      {thumbnailKey ? (
        <div className="relative w-full h-40">
          <Image
            src={generateImageURL(thumbnailKey)}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-40 bg-muted flex items-center justify-center text-muted-foreground text-sm">
          No Thumbnail
        </div>
      )}
      <CardHeader className="space-y-1">
        <CardTitle className="line-clamp-1">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {shortDescription || "No description available."}
        </p>
      </CardContent>
      <CardFooter>
        <Link
          href={`/courses/${id}`}
          className={buttonVariants({
            className: "w-full",
          })}
        >
          See Details
        </Link>
      </CardFooter>
    </Card>
  );
}
