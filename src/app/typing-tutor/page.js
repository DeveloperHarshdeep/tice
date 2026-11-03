import { TypingTutorDashboard } from "@/components/typing/TypingTutorDashboard";

export const metadata = {
  title: "Typing Tutor",
  description:
    "Practice touch typing with guided lessons, a live virtual keyboard, and instant accuracy feedback.",
};

export default function TypingTutorPage() {
  return (
    <main className="h-dvh overflow-hidden bg-slate-50 p-2 sm:p-3 lg:p-4">
      <TypingTutorDashboard />
    </main>
  );
}
