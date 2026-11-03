"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Clock3,
  Keyboard,
  RotateCcw,
  ShieldCheck,
  Target,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { calculateTypingPerformance } from "@/lib/typing-metrics";
import { typingChapters } from "@/data/typing-chapters";

const keyboardRows = [
  [
    { code: "Escape", label: "Esc", width: 1.4 },
    { code: "F1", label: "F1" },
    { code: "F2", label: "F2" },
    { code: "F3", label: "F3" },
    { code: "F4", label: "F4" },
    { code: "F5", label: "F5" },
    { code: "F6", label: "F6" },
    { code: "F7", label: "F7" },
    { code: "F8", label: "F8" },
    { code: "F9", label: "F9" },
    { code: "F10", label: "F10" },
    { code: "F11", label: "F11" },
    { code: "F12", label: "F12" },
    { code: "PrintScreen", label: "PrtSc" },
    { code: "ScrollLock", label: "ScrLk" },
    { code: "Pause", label: "Pause" },
  ],
  [
    { code: "Backquote", label: "` ~" },
    ...["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map((digit) => ({
      code: `Digit${digit}`,
      label: `${digit} ${")!@#$%^&*("[Number(digit) % 10]}`,
    })),
    { code: "Minus", label: "- _" },
    { code: "Equal", label: "= +" },
    { code: "Backspace", label: "Backspace", width: 2.2 },
  ],
  [
    { code: "Tab", label: "Tab", width: 1.7 },
    ...[..."qwertyuiop"].map((letter) => ({
      code: `Key${letter.toUpperCase()}`,
      label: letter,
    })),
    { code: "BracketLeft", label: "[ {" },
    { code: "BracketRight", label: "] }" },
    { code: "Backslash", label: "\\ |", width: 1.5 },
  ],
  [
    { code: "CapsLock", label: "Caps", width: 2 },
    ...[..."asdfghjkl"].map((letter) => ({
      code: `Key${letter.toUpperCase()}`,
      label: letter,
    })),
    { code: "Semicolon", label: "; :" },
    { code: "Quote", label: "' \"" },
    { code: "Enter", label: "Enter", width: 2.1 },
  ],
  [
    { code: "ShiftLeft", label: "Shift", width: 2.8 },
    ...[..."zxcvbnm"].map((letter) => ({
      code: `Key${letter.toUpperCase()}`,
      label: letter,
    })),
    { code: "Comma", label: ", <" },
    { code: "Period", label: ". >" },
    { code: "Slash", label: "/ ?", width: 1.4 },
    { code: "ShiftRight", label: "Shift", width: 2.8 },
  ],
  [
    { code: "ControlLeft", label: "Ctrl", width: 1.5 },
    { code: "MetaLeft", label: "Win", width: 1.4 },
    { code: "AltLeft", label: "Alt", width: 1.4 },
    { code: "Space", label: "Space", width: 6 },
    { code: "AltRight", label: "Alt", width: 1.4 },
    { code: "ContextMenu", label: "Menu", width: 1.4 },
    { code: "ControlRight", label: "Ctrl", width: 1.5 },
  ],
];

const shiftedKeyCodes = {
  "!": "Digit1",
  "@": "Digit2",
  "#": "Digit3",
  "$": "Digit4",
  "%": "Digit5",
  "^": "Digit6",
  "&": "Digit7",
  "*": "Digit8",
  "(": "Digit9",
  ")": "Digit0",
  _: "Minus",
  "+": "Equal",
  "{": "BracketLeft",
  "}": "BracketRight",
  "|": "Backslash",
  ":": "Semicolon",
  '"': "Quote",
  "<": "Comma",
  ">": "Period",
  "?": "Slash",
  "~": "Backquote",
};

function expectedCodes(character) {
  if (!character) return [];
  if (character === " ") return ["Space"];
  if (character === "\n") return ["Enter"];
  if (/^[a-z]$/i.test(character)) {
    const codes = [`Key${character.toUpperCase()}`];
    if (character !== character.toLowerCase()) codes.unshift("ShiftLeft");
    return codes;
  }
  if (shiftedKeyCodes[character]) {
    return ["ShiftLeft", shiftedKeyCodes[character]];
  }
  const punctuationCodes = {
    "`": "Backquote",
    "-": "Minus",
    "=": "Equal",
    "[": "BracketLeft",
    "]": "BracketRight",
    "\\": "Backslash",
    ";": "Semicolon",
    "'": "Quote",
    ",": "Comma",
    ".": "Period",
    "/": "Slash",
  };
  return punctuationCodes[character] ? [punctuationCodes[character]] : [];
}

function formatTime(milliseconds) {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function KeyboardKey({
  keyInfo,
  expected,
  pressed,
  feedback,
  branded,
}) {
  const brandLabels = {
    KeyH: "HD",
    KeyD: "Web",
    KeyS: "Studios",
    KeyA: "Harshdeep",
  };
  const label = branded && brandLabels[keyInfo.code] ? brandLabels[keyInfo.code] : keyInfo.label;
  const isBrandKey = branded && Boolean(brandLabels[keyInfo.code]);
  const stateClass = pressed
    ? "translate-y-0.5 border-sky-600 bg-sky-600 text-white shadow-inner"
    : feedback === "incorrect"
      ? "border-red-300 bg-red-100 text-red-800"
      : feedback === "correct"
        ? "border-emerald-300 bg-emerald-100 text-emerald-800"
        : expected
          ? "border-sky-500 bg-sky-100 text-sky-900 ring-2 ring-sky-300/70"
          : "border-slate-200 bg-white text-slate-700 shadow-[0_2px_0_#e2e8f0]";

  return (
    <span
      className={`flex min-w-0 flex-1 items-center justify-center rounded-md border px-1 text-center transition-all duration-100 ${stateClass} ${
        isBrandKey
          ? "h-9 text-[9px] font-bold leading-tight sm:h-9 sm:text-[10px]"
          : "h-9 text-[9px] font-semibold sm:h-9 sm:text-[10px]"
      }`}
      style={{ flexGrow: keyInfo.width || 1 }}
      aria-hidden="true"
    >
      {label}
    </span>
  );
}

function VirtualKeyboard({ expected, pressedCodes, feedback, branded }) {
  const expectedSet = useMemo(() => new Set(expected), [expected]);
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-100/70 p-1.5 sm:p-2">
      <div
        className="min-w-[760px] w-full space-y-1"
        aria-label="Virtual keyboard"
        aria-hidden="true"
      >
        {keyboardRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-0.5 sm:gap-1">
            {row.map((keyInfo) => (
              <KeyboardKey
                key={keyInfo.code}
                keyInfo={keyInfo}
                expected={expectedSet.has(keyInfo.code)}
                pressed={pressedCodes.has(keyInfo.code)}
                feedback={
                  feedback?.code === keyInfo.code ? feedback.type : undefined
                }
                branded={branded}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricCard({ label, value, helper, icon: Icon }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-1.5 sm:p-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500 sm:text-[9px]">
          {label}
        </p>
        <Icon className="h-3 w-3 text-sky-600" aria-hidden />
      </div>
      <p className="mt-0.5 text-base font-bold tabular-nums text-slate-900 sm:text-lg">
        {value}
      </p>
      {helper && <p className="mt-0.5 text-[9px] text-slate-500">{helper}</p>}
    </div>
  );
}

export function TypingPractice({ chapterId }) {
  const chapter = typingChapters.find((item) => item.id === chapterId) || null;
  const [ready, setReady] = useState(false);
  const [typed, setTyped] = useState("");
  const [paragraphIndex, setParagraphIndex] = useState(0);
  const [activity, setActivity] = useState({
    correct: 0,
    incorrect: 0,
    total: 0,
    completedCharacters: 0,
  });
  const [startedAt, setStartedAt] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [remainingMs, setRemainingMs] = useState(0);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [pressedCodes, setPressedCodes] = useState(() => new Set());
  const [feedback, setFeedback] = useState(null);
  const [branded, setBranded] = useState(false);
  const [cursorIndex, setCursorIndex] = useState(0);
  const [storageWarning, setStorageWarning] = useState(false);
  const [sessionRestored, setSessionRestored] = useState(false);

  const inputRef = useRef(null);
  const typedRef = useRef("");
  const activityRef = useRef({
    correct: 0,
    incorrect: 0,
    total: 0,
    completedCharacters: 0,
  });
  const startedAtRef = useRef(0);
  const finishedRef = useRef(false);
  const cursorRef = useRef(null);
  const viewportRef = useRef(null);
  const timerKey = `tice-typing-session:${chapterId}`;

  const activeParagraph = chapter?.paragraphs?.[paragraphIndex] || "";
  const allParagraphsText = useMemo(
    () => chapter?.paragraphs?.join("") || "",
    [chapter],
  );
  const durationMs = 10 * 60_000;

  const finishTest = useCallback(
    (reason) => {
      if (finishedRef.current || !chapter) return;
      finishedRef.current = true;
      const completedAt = Date.now();
      const beganAt = startedAtRef.current;
      const actualTypingTime = beganAt
        ? Math.min(Math.max(0, completedAt - beganAt), durationMs)
        : 0;
      const finalTyped = typedRef.current;
      setElapsedMs(actualTypingTime);
      setRemainingMs(Math.max(0, durationMs - actualTypingTime));
      setResult({
        ...calculateTypingPerformance(
          finalTyped,
          allParagraphsText,
          actualTypingTime,
          activityRef.current,
        ),
        actualTypingTime,
        completedAt,
        reason,
        totalDuration: durationMs,
      });
      setFinished(true);
      try {
        window.sessionStorage.removeItem(timerKey);
      } catch {
        setStorageWarning(true);
      }
    },
    [allParagraphsText, chapter, durationMs, timerKey],
  );

  useEffect(() => {
    if (!chapter) return;
    let active = true;
    const timerId = window.setTimeout(() => {
      if (!active) return;
      try {
        const saved = window.sessionStorage.getItem(timerKey);
        if (saved) {
          const session = JSON.parse(saved);
          const valid =
            session.chapterId === chapterId &&
            Number.isFinite(session.startedAt) &&
            session.durationMs === durationMs;
          if (valid) {
            startedAtRef.current = session.startedAt;
            setStartedAt(session.startedAt);
            setReady(true);
            setSessionRestored(true);
            setElapsedMs(Math.min(Date.now() - session.startedAt, durationMs));
            setRemainingMs(
              Math.max(0, durationMs - (Date.now() - session.startedAt)),
            );
          } else {
            window.sessionStorage.removeItem(timerKey);
            setReady(true);
            setRemainingMs(durationMs);
          }
        } else {
          setReady(true);
          setRemainingMs(durationMs);
        }
      } catch {
        setStorageWarning(true);
        setReady(true);
        setRemainingMs(durationMs);
      }
    }, 0);
    return () => {
      active = false;
      window.clearTimeout(timerId);
    };
  }, [chapter, chapterId, durationMs, timerKey]);

  useEffect(() => {
    if (ready && !finished) inputRef.current?.focus();
  }, [finished, ready]);

  useEffect(() => {
    if (!startedAt || finished) return undefined;
    function updateTimer() {
      const elapsed = Math.max(0, Date.now() - startedAt);
      const remaining = Math.max(0, durationMs - elapsed);
      setElapsedMs(Math.min(elapsed, durationMs));
      setRemainingMs(remaining);
      if (remaining === 0) finishTest("time");
    }
    updateTimer();
    const timerId = window.setInterval(updateTimer, 250);
    return () => window.clearInterval(timerId);
  }, [durationMs, finishTest, finished, startedAt]);

  useEffect(() => {
    function handleKeyUp(event) {
      setPressedCodes((current) => {
        if (!current.has(event.code)) return current;
        const next = new Set(current);
        next.delete(event.code);
        return next;
      });
    }
    function handleVisibility() {
      if (document.visibilityState === "hidden") setPressedCodes(new Set());
    }
    window.addEventListener("keyup", handleKeyUp);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useEffect(() => {
    if (!startedAt || finished) return undefined;
    function warnBeforeLeaving(event) {
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [finished, startedAt]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const cursor = cursorRef.current;
    if (!viewport || !cursor) return;

    const viewportRect = viewport.getBoundingClientRect();
    const cursorRect = cursor.getBoundingClientRect();
    if (cursorRect.bottom > viewportRect.bottom) {
      viewport.scrollBy({
        top: cursorRect.bottom - viewportRect.bottom + 16,
        behavior: "smooth",
      });
    } else if (cursorRect.top < viewportRect.top) {
      viewport.scrollBy({
        top: cursorRect.top - viewportRect.top - 16,
        behavior: "smooth",
      });
    }
  }, [activeParagraph.length, cursorIndex, paragraphIndex, typed.length]);

  useEffect(() => {
    if (!feedback) return undefined;
    const timeoutId = window.setTimeout(() => setFeedback(null), 240);
    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  const startTimer = useCallback(() => {
    if (!startedAtRef.current) {
      const started = Date.now();
      startedAtRef.current = started;
      setStartedAt(started);
      setElapsedMs(0);
      setRemainingMs(durationMs);
      try {
        window.sessionStorage.setItem(
          timerKey,
          JSON.stringify({ chapterId, startedAt: started, durationMs }),
        );
      } catch {
        setStorageWarning(true);
      }
    }
  }, [chapterId, durationMs, timerKey]);

  useEffect(() => {
    if (!ready || finished || !chapter) return undefined;

    function handlePracticeKeyDown(event) {
      if (event.isComposing || event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      const target = event.target;
      const isOtherControl =
        target instanceof HTMLElement &&
        target !== inputRef.current &&
        target.closest("a, button, input, select, [contenteditable='true']");
      if (isOtherControl) return;

      if (event.code === "Minus" && event.key === "-") {
        setBranded((current) => !current);
      }

      if (event.code) {
        setPressedCodes((current) => new Set(current).add(event.code));
      }

      if (event.key === "Backspace") {
        event.preventDefault();
        const current = typedRef.current;
        if (!current.length) return;
        const nextValue = current.slice(0, -1);
        typedRef.current = nextValue;
        setTyped(nextValue);
        setCursorIndex(nextValue.length);
        const nextActivity = {
          ...activityRef.current,
          completedCharacters: Math.max(
            0,
            activityRef.current.completedCharacters - 1,
          ),
        };
        activityRef.current = nextActivity;
        setActivity(nextActivity);
        return;
      }

      if (event.key.length !== 1) return;
      event.preventDefault();
      startTimer();
      const nextActivity = {
        ...activityRef.current,
        total: activityRef.current.total + 1,
      };
      const expectedCharacter = activeParagraph[typedRef.current.length];
      const isCorrect = event.key === expectedCharacter;
      if (!isCorrect) {
        nextActivity.incorrect += 1;
      } else {
        nextActivity.correct += 1;
      }
      nextActivity.completedCharacters += 1;
      activityRef.current = nextActivity;
      setActivity(nextActivity);
      setFeedback({
        code: event.code,
        type: isCorrect ? "correct" : "incorrect",
      });
      const nextValue = `${typedRef.current}${event.key}`;
      typedRef.current = nextValue;
      setTyped(nextValue);
      setCursorIndex(nextValue.length);

      if (nextValue.length === activeParagraph.length) {
        const nextIndex = (paragraphIndex + 1) % chapter.paragraphs.length;
        typedRef.current = "";
        setTyped("");
        setCursorIndex(0);
        setParagraphIndex(nextIndex);
      }
    }

    window.addEventListener("keydown", handlePracticeKeyDown, true);
    return () =>
      window.removeEventListener("keydown", handlePracticeKeyDown, true);
  }, [activeParagraph, chapter, finished, paragraphIndex, ready, startTimer]);

  function resetPractice() {
    finishedRef.current = false;
    startedAtRef.current = 0;
    typedRef.current = "";
    activityRef.current = {
      correct: 0,
      incorrect: 0,
      total: 0,
      completedCharacters: 0,
    };
    setTyped("");
    setActivity({
      correct: 0,
      incorrect: 0,
      total: 0,
      completedCharacters: 0,
    });
    setParagraphIndex(0);
    setReady(true);
    setStartedAt(0);
    setElapsedMs(0);
    setRemainingMs(durationMs);
    setFinished(false);
    setResult(null);
    setCursorIndex(0);
    setPressedCodes(new Set());
    setFeedback(null);
    try {
      window.sessionStorage.removeItem(timerKey);
    } catch {
      setStorageWarning(true);
    }
  }

  if (!chapter) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm leading-6 text-amber-950">
        <p>This chapter is not available.</p>
        <Link
          href="/typing-tutor"
          className="mt-3 inline-flex items-center gap-2 font-semibold text-sky-800 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Return to chapters
        </Link>
      </div>
    );
  }

  if (result) {
    const dateTime = new Date(result.completedAt).toLocaleString();
    return (
      <section className="mx-auto flex h-full max-w-4xl flex-col justify-center gap-3 overflow-hidden">
        <div className="shrink-0 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 px-4 py-3 text-center shadow-sm sm:py-4">
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Trophy className="h-7 w-7" aria-hidden />
          </span>
          <Badge tone="success" className="mt-2">
            10-minute practice complete
          </Badge>
          <h1 className="mt-1 text-xl font-bold text-slate-950 sm:text-2xl">
            Time is up
          </h1>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm">
            Chapter {chapter.chapterNumber}: {chapter.title} · {dateTime}
          </p>
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-3">
          <MetricCard label="WPM" value={result.wpm.toFixed(2)} icon={Target} />
          <MetricCard label="CPM" value={result.cpm.toFixed(2)} icon={Keyboard} />
          <MetricCard
            label="Accuracy"
            value={`${result.accuracy.toFixed(2)}%`}
            icon={Check}
          />
          <MetricCard
            label="Total errors"
            value={result.incorrect}
            icon={Target}
          />
          <MetricCard
            label="Correct / incorrect"
            value={`${result.correct} / ${result.incorrect}`}
            icon={Check}
          />
          <MetricCard
            label="Completion"
            value={`${result.completion.toFixed(1)}%`}
            icon={Trophy}
          />
        </div>

        <div className="shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 shadow-xs">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1">
            <span>Duration: {formatTime(result.totalDuration)}</span>
            <span>Actual typing time: {formatTime(result.actualTypingTime)}</span>
            <span>Characters typed: {result.total}</span>
          </div>
          <p className="mt-2 flex items-center justify-center gap-2 border-t border-slate-100 pt-2 text-[10px] leading-4 text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-sky-600" aria-hidden />
            This anonymous result is not saved.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap justify-center gap-2">
          <Button href="/typing-tutor" variant="secondary">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to chapters
          </Button>
          <Button onClick={resetPractice}>
            <RotateCcw className="h-4 w-4" aria-hidden />
            Practice again
          </Button>
        </div>
      </section>
    );
  }

  const live = calculateTypingPerformance(
    typed,
    allParagraphsText,
    elapsedMs,
    activity,
  );
  const expected = expectedCodes(activeParagraph[cursorIndex]);
  const remainingLabel = startedAt ? formatTime(remainingMs) : formatTime(durationMs);

  return (
    <div className="mx-auto flex min-h-full w-full max-w-[1600px] flex-col gap-2 lg:h-full lg:min-h-0 lg:gap-2">
      <header className="flex shrink-0 items-center justify-between gap-2 rounded-xl border border-sky-100 bg-white px-3 py-2 shadow-xs sm:px-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sm font-bold text-sky-800">
            {String(chapter.chapterNumber).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-700">
              Chapter {chapter.chapterNumber} · {chapter.difficulty}
            </p>
            <h1 className="truncate text-base font-bold leading-5 text-slate-950 sm:text-lg">
              {chapter.title}
            </h1>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            href="/typing-tutor"
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-sky-700 sm:gap-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">All chapters</span>
          </Link>
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 sm:gap-2 sm:px-3">
            <Clock3
              className={`h-4 w-4 ${remainingMs <= 10_000 && startedAt ? "text-red-600" : "text-sky-600"}`}
              aria-hidden
            />
            <span className="hidden text-[10px] text-slate-500 sm:inline">Time left</span>
            <span className="font-mono text-base font-bold tabular-nums text-slate-900 sm:text-lg">
              {remainingLabel}
            </span>
          </div>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 lg:grid-cols-[minmax(0,1fr)_290px]">
        <section className="flex min-h-[360px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs lg:min-h-0">
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-2 sm:px-5">
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900">
                Paragraph {paragraphIndex + 1} of {chapter.paragraphs.length}
              </h2>
              <p className="text-[10px] text-slate-500">
                Type each highlighted character correctly to continue
              </p>
            </div>
            <span className="shrink-0 rounded-md bg-white px-2 py-1 text-xs font-semibold tabular-nums text-slate-600">
              {typed.length} / {activeParagraph.length}
            </span>
          </div>
          <div
            ref={viewportRef}
            aria-label="Paragraph to type"
            className="min-h-[150px] flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5"
          >
            <p className="whitespace-pre-wrap break-words text-base leading-8 tracking-[0.025em] text-slate-700 sm:text-lg sm:leading-9">
              {activeParagraph.split("").map((character, index) => {
                const isTyped = index < typed.length;
                const isCorrect = isTyped && typed[index] === character;
                const isCurrent = cursorIndex === index && !finished;
                return (
                  <span
                    key={index}
                    ref={isCurrent ? cursorRef : null}
                    className={`rounded-sm ${
                      isCurrent
                        ? "bg-sky-200 text-sky-950 ring-1 ring-sky-400"
                        : isTyped
                          ? isCorrect
                            ? "text-emerald-700"
                            : "bg-red-100 text-red-700 underline decoration-red-400 decoration-2 underline-offset-2"
                          : "text-slate-700"
                    }`}
                  >
                    {character}
                  </span>
                );
              })}
            </p>
          </div>
          <div className="shrink-0 border-t border-slate-100 bg-slate-50/50 p-3 sm:p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <label htmlFor="typing-input" className="text-sm font-bold text-slate-900">
                Your typing
              </label>
              <span className="text-[10px] text-slate-500">
                Typing starts the 10-minute timer
              </span>
            </div>
            <textarea
              ref={inputRef}
              id="typing-input"
              name="typing-practice"
              value={typed}
              readOnly
              placeholder="Begin typing the highlighted paragraph..."
              aria-describedby="typing-input-help"
              className="h-24 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-base leading-7 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 sm:h-28"
            />
            <p id="typing-input-help" className="mt-1 text-[10px] leading-4 text-slate-500">
              Incorrect keys are marked red and counted; typing continues.
              {storageWarning && " Timer storage is temporarily unavailable."}
              {sessionRestored && " The timer was restored; this paragraph restarted."}
            </p>
          </div>
        </section>

        <aside
          className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs sm:p-4"
          aria-label="Live typing results"
        >
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Live results</h2>
              <p className="text-[10px] text-slate-500">Updates as you type</p>
            </div>
            <Target className="h-4 w-4 text-sky-600" aria-hidden />
          </div>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-2">
            <MetricCard label="WPM" value={live.wpm.toFixed(2)} icon={Target} />
            <MetricCard label="CPM" value={live.cpm.toFixed(2)} icon={Keyboard} />
            <MetricCard
              label="Accuracy"
              value={`${live.accuracy.toFixed(2)}%`}
              icon={Check}
            />
            <MetricCard label="Errors" value={live.incorrect} icon={Target} />
            <MetricCard
              label="Correct / typed"
              value={`${live.correct} / ${live.total}`}
              icon={Check}
            />
            <MetricCard
              label="Completion"
              value={`${live.completion.toFixed(1)}%`}
              icon={Trophy}
            />
          </div>
          <p className="mt-3 border-t border-slate-100 pt-2 text-[10px] leading-4 text-slate-500">
            WPM uses correct characters per minute. Each paragraph advances automatically when completed.
          </p>
        </aside>
      </div>

      <section className="shrink-0 space-y-1 rounded-xl border border-slate-200 bg-white p-2 shadow-xs sm:p-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Keyboard className="h-4 w-4 text-sky-600" aria-hidden />
            <h2 className="text-sm font-bold text-slate-900">
              Virtual keyboard
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-[10px] text-slate-500 sm:inline">
              Incorrect keys are highlighted in red
            </span>
            {branded && <Badge tone="aqua" className="!px-1.5 !py-0 !text-[9px]">HD Web Studios</Badge>}
          </div>
        </div>
        <VirtualKeyboard
          expected={expected}
          pressedCodes={pressedCodes}
          feedback={feedback}
          branded={branded}
        />
      </section>
    </div>
  );
}
