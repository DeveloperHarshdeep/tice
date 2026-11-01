"use client";

import { useEffect, useMemo, useState } from "react";
import { courses } from "@/data/courses";

export function CourseTypingAnimation() {
  const courseNames = useMemo(
    () => courses.map((course) => course.title).filter(Boolean),
    []
  );
  const [typingText, setTypingText] = useState("");
  const [courseIndex, setCourseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!courseNames.length) return;

    const currentWord = courseNames[courseIndex % courseNames.length];

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (typingText === currentWord) return;
      const timer = setTimeout(() => setTypingText(currentWord), 0);
      return () => clearTimeout(timer);
    }

    let delay = isDeleting ? 40 : 85;

    if (!isDeleting && typingText === currentWord) {
      delay = 1400;
    }

    if (isDeleting && typingText === "") {
      delay = 300;
    }

    const timer = setTimeout(() => {
      if (!isDeleting && typingText === currentWord) {
        setIsDeleting(true);
      } else if (isDeleting && typingText === "") {
        setIsDeleting(false);
        setCourseIndex((prev) => (prev + 1) % courseNames.length);
      } else if (isDeleting) {
        setTypingText(currentWord.substring(0, typingText.length - 1));
      } else {
        setTypingText(currentWord.substring(0, typingText.length + 1));
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [courseIndex, courseNames, isDeleting, typingText]);

  if (!courseNames.length) return null;

  return (
    <>
      <span aria-live="polite" aria-atomic="true">
        {typingText}
      </span>
      <span
        className="ml-1 inline-block h-[0.85em] w-0.5 motion-safe:animate-pulse bg-sky-600 align-middle"
        aria-hidden="true"
      />
    </>
  );
}
