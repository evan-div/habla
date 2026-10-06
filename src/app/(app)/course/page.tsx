import type { Metadata } from "next";
import { CourseMap } from "@/components/course/CourseMap";

export const metadata: Metadata = { title: "Course" };

export default function CoursePage() {
  return <CourseMap />;
}
