"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, PlayCircle, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="min-h-[50vh] relative flex flex-col items-center justify-center text-center py-20 px-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
          Learn Anything. <span className="text-primary">Anywhere.</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          A modern LMS platform designed to help you learn faster and teach
          better. Explore courses created by experts and start your journey
          today.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/courses" className={buttonVariants({ size: "lg" })}>
            Browse Courses
          </Link>
          <Link
            href="/signup"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold">Features</h2>
          <p className="mt-2 text-muted-foreground">
            What makes our platform unique.
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-3">
          <FeatureCard
            icon={<BookOpen className="h-8 w-8 text-primary" />}
            title="Expert Content"
            description="Learn from curated courses created by industry professionals."
          />
          <FeatureCard
            icon={<PlayCircle className="h-8 w-8 text-primary" />}
            title="Interactive Learning"
            description="Video lessons, quizzes, and projects designed to keep you engaged."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-primary" />}
            title="Community Support"
            description="Join discussions, share knowledge, and learn with peers."
          />
        </div>
      </section>

      {/* Courses Preview */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold">Popular Courses</h2>
          <p className="mt-2 text-muted-foreground">
            Get started with our most loved courses.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {/* Replace with real courses */}
          {[1, 2, 3].map((i) => (
            <Card key={i} className="hover:shadow-lg transition">
              <CardContent className="p-6 space-y-4">
                <div className="aspect-video bg-muted rounded-md" />
                <h3 className="font-semibold text-lg">Course Title {i}</h3>
                <p className="text-sm text-muted-foreground">
                  Short description of the course to attract users.
                </p>
                <Button asChild className="w-full">
                  <Link href={`/courses/${i}`}>View Course</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/courses">
            <Button variant="outline" size="lg">
              View All Courses
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to start learning?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Join thousands of learners and instructors building their skills.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <Link href="/signup" className={buttonVariants({ size: "lg" })}>
            Get Started
          </Link>
          <Link
            href="/courses"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Browse Courses
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t text-sm text-muted-foreground text-center">
        <p>
          &copy; {new Date().getFullYear()} Fahimul Islam. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="p-6 text-center space-y-4">
      <div className="flex justify-center">{icon}</div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );
}
