import { TypingPractice } from "@/components/typing/TypingPractice";

export const metadata = {
  title: "Typing Practice",
  robots: { index: false, follow: false },
};

export default async function TypingPracticePage({ params }) {
  const { chapterId } = await params;
  return (
    <main className="h-dvh overflow-x-hidden overflow-y-auto bg-slate-50 p-2 sm:p-3 lg:overflow-hidden lg:p-4">
      <TypingPractice key={chapterId} chapterId={chapterId} />
    </main>
  );
}
