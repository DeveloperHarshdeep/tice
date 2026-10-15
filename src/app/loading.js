import { Spinner } from "@/components/ui/Spinner";
import { Container } from "@/components/layout/Container";
import { GraduationCap } from "lucide-react";

export default function Loading() {
  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-brand border border-sky-100 shadow-2xs animate-pulse">
        <GraduationCap className="h-6 w-6" aria-hidden />
      </div>
      <div className="mt-4">
        <Spinner label="Loading institute portal…" size="md" />
      </div>
    </Container>
  );
}
