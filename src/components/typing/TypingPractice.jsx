"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
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
import {
  getTypingSystemsForLanguage,
  normalizeTypingSystemId,
  typingSystems,
  typingLanguages,
  validateTypingSystem,
} from "@/data/typing-layouts";
import { getExpectedCodes, getMappedOutput } from "@/data/keyboard-layouts";
import { convertAnmolInput } from "@/data/typing/converters/anmol";

const TYPING_SYSTEM_STORAGE_KEY = "tice-typing-system-id";
const typingSystemListeners = new Set();

function subscribeToTypingSystem(listener) {
  typingSystemListeners.add(listener);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", listener);
  }
  return () => {
    typingSystemListeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", listener);
    }
  };
}

function getTypingSystemSnapshot() {
  if (typeof window === "undefined") return "stored:";
  try {
    return `stored:${window.sessionStorage.getItem(TYPING_SYSTEM_STORAGE_KEY) || ""}`;
  } catch {
    return "unavailable:";
  }
}

function getServerTypingSystemSnapshot() {
  return "stored:";
}

function persistTypingSystem(typingSystemId) {
  try {
    if (typingSystemId) {
      window.sessionStorage.setItem(
        TYPING_SYSTEM_STORAGE_KEY,
        typingSystemId,
      );
    } else {
      window.sessionStorage.removeItem(TYPING_SYSTEM_STORAGE_KEY);
    }
    return true;
  } catch {
    return false;
  } finally {
    typingSystemListeners.forEach((listener) => listener());
  }
}

function formatTime(milliseconds) {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function normalizeTypedText(text, typingSystem) {
  const normalization = typingSystem?.normalization;
  if (normalization && typeof text.normalize === "function") {
    return text.normalize(normalization);
  }
  return text;
}

function segmentText(text) {
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    return Array.from(
      new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text),
    ).map((part) => part.segment);
  }
  return Array.from(text);
}

function getCompletedGraphemes(units, codePointCount) {
  let completed = 0;
  let offset = 0;
  for (const unit of units) {
    offset += Array.from(unit).length;
    if (offset > codePointCount) break;
    completed += 1;
  }
  return completed;
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
  const baseLabel =
    branded && brandLabels[keyInfo.code]
      ? brandLabels[keyInfo.code]
      : keyInfo.label || keyInfo.unshifted || keyInfo.code;
  const hasOutputLayers =
    keyInfo.normal !== undefined ||
    keyInfo.shift !== undefined ||
    keyInfo.altGr !== undefined ||
    keyInfo.shiftAltGr !== undefined;
  const hasAltGrLayer =
    keyInfo.altGr !== undefined || keyInfo.shiftAltGr !== undefined;
  const label =
    hasOutputLayers
      ? (
          <span className="grid h-full w-full grid-cols-2 grid-rows-2 items-center justify-items-center leading-none">
            <span className={`text-[8px] text-slate-500 ${hasAltGrLayer ? "" : "col-span-2"}`}>
              {keyInfo.shift || keyInfo.shifted || ""}
            </span>
            {hasAltGrLayer && (
              <span className="text-[7px] text-slate-400">
                {keyInfo.shiftAltGr || ""}
              </span>
            )}
            <span className={hasAltGrLayer ? "" : "col-span-2"}>
              {keyInfo.normal || keyInfo.unshifted || ""}
            </span>
            {hasAltGrLayer && (
              <span className="text-[7px] text-slate-400">
                {keyInfo.altGr || ""}
              </span>
            )}
          </span>
        )
      : baseLabel;
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

function VirtualKeyboard({ expected, pressedCodes, feedback, branded, rows }) {
  const expectedSet = useMemo(() => new Set(expected), [expected]);
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-100/70 p-1.5 sm:p-2">
      <div
        className="min-w-[760px] w-full space-y-1"
        aria-label="Virtual keyboard"
        aria-hidden="true"
      >
        {rows.map((row, rowIndex) => (
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
  const savedSystemSnapshot = useSyncExternalStore(
    subscribeToTypingSystem,
    getTypingSystemSnapshot,
    getServerTypingSystemSnapshot,
  );
  const storedSystemId = savedSystemSnapshot.startsWith("stored:")
    ? savedSystemSnapshot.slice("stored:".length) || null
    : null;
  const savedSystemId = storedSystemId
    ? normalizeTypingSystemId(storedSystemId)
    : null;
  const savedSystemUnknown =
    Boolean(savedSystemId) && !typingSystems[savedSystemId];
  const [localSelection, setLocalSelection] = useState(null);
  const [testStarted, setTestStarted] = useState(false);
  const [pendingLanguageId, setPendingLanguageId] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(chapter?.durationMinutes || 10);
  const [typed, setTyped] = useState("");
  const [inputSequence, setInputSequence] = useState("");
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
  const [storageWriteFailed, setStorageWriteFailed] = useState(false);
  const [selectionError, setSelectionError] = useState("");

  const inputRef = useRef(null);
  const typedRef = useRef("");
  const inputSequenceRef = useRef("");
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
  const typingSystemId =
    localSelection === null
      ? savedSystemUnknown
        ? null
        : savedSystemId
      : localSelection.id;
  const activeTypingSystem = typingSystemId ? typingSystems[typingSystemId] : null;
  const setupLanguageId =
    activeTypingSystem?.language || pendingLanguageId || "";
  const selectedFont = activeTypingSystem?.font || null;
  const storageWarning =
    savedSystemSnapshot.startsWith("unavailable:") || storageWriteFailed;
  const setupSystems = getTypingSystemsForLanguage(setupLanguageId);
  const practiceParagraphs = useMemo(
    () => {
      if (!activeTypingSystem || !chapter) return [];
      if (activeTypingSystem.paragraphSource === "chapter") {
        return chapter.paragraphs || [];
      }
      if (activeTypingSystem.paragraphSource === "system-chapter") {
        return activeTypingSystem.paragraphs?.[chapter.id] || [];
      }
      return [];
    },
    [activeTypingSystem, chapter],
  );
  const activeParagraphData = practiceParagraphs[paragraphIndex] || "";
  const activeParagraph =
    activeTypingSystem?.inputMode === "custom-conversion"
      ? activeParagraphData.text || ""
      : activeParagraphData;
  const activeInputText =
    activeTypingSystem?.inputMode === "custom-conversion"
      ? activeParagraphData.input || ""
      : activeParagraph;
  const activeParagraphUnits = useMemo(
    () => segmentText(normalizeTypedText(activeParagraph, activeTypingSystem)),
    [activeParagraph, activeTypingSystem],
  );
  const activeParagraphCodePoints = useMemo(
    () => Array.from(normalizeTypedText(activeParagraph, activeTypingSystem)),
    [activeParagraph, activeTypingSystem],
  );
  const paragraphUnitsWithOffsets = useMemo(
    () =>
      activeParagraphUnits.map((character, index) => {
        const start = activeParagraphUnits
          .slice(0, index)
          .reduce((offset, unit) => offset + Array.from(unit).length, 0);
        return {
          character,
          start,
          end: start + Array.from(character).length,
        };
      }),
    [activeParagraphUnits],
  );
  const typedCodePoints = useMemo(
    () => Array.from(normalizeTypedText(typed, activeTypingSystem)),
    [activeTypingSystem, typed],
  );
  const allParagraphsText = useMemo(
    () =>
      practiceParagraphs
        .map((paragraph) =>
          typeof paragraph === "string" ? paragraph : paragraph.text,
        )
        .join(""),
    [practiceParagraphs],
  );
  const durationMs = durationMinutes * 60_000;

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
    },
    [allParagraphsText, chapter, durationMs],
  );

  useEffect(() => {
    if (testStarted && !finished) inputRef.current?.focus();
  }, [finished, testStarted]);

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
      if (event.code === "Minus") setBranded(false);
      setPressedCodes((current) => {
        if (!current.has(event.code)) return current;
        const next = new Set(current);
        next.delete(event.code);
        return next;
      });
    }
    function handleVisibility() {
      if (document.visibilityState === "hidden") {
        setPressedCodes(new Set());
        setBranded(false);
      }
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
  }, [activeParagraphUnits.length, cursorIndex, paragraphIndex, typed.length]);

  useEffect(() => {
    if (!feedback) return undefined;
    const timeoutId = window.setTimeout(() => setFeedback(null), 240);
    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  useEffect(() => {
    if (!testStarted || finished || !chapter || !activeTypingSystem) {
      return undefined;
    }

    function handlePracticeKeyDown(event) {
      if (event.isComposing || event.metaKey || event.ctrlKey && !event.altKey) {
        return;
      }

      const target = event.target;
      const isOtherControl =
        target instanceof HTMLElement &&
        target !== inputRef.current &&
        target.closest("a, button, input, select, [contenteditable='true']");
      if (isOtherControl) return;

      if (event.code === "Minus" && event.key === "-") {
        setBranded(true);
      }

      if (event.code) {
        setPressedCodes((current) => new Set(current).add(event.code));
      }

      if (event.key === "Backspace") {
        event.preventDefault();
        if (activeTypingSystem.inputMode === "custom-conversion") {
          const currentInput = inputSequenceRef.current;
          if (!currentInput.length) return;
          const nextInput = currentInput.slice(0, -1);
          const convertedInput = normalizeTypedText(
            convertAnmolInput(nextInput),
            activeTypingSystem,
          );
          const pendingCorrectInput =
            activeInputText.startsWith(nextInput) &&
            !activeParagraph.startsWith(convertedInput);
          const nextValue = pendingCorrectInput ? "" : convertedInput;
          const currentCursor = Array.from(
            normalizeTypedText(typedRef.current, activeTypingSystem),
          ).length;
          const nextCursor = Array.from(nextValue).length;
          inputSequenceRef.current = nextInput;
          setInputSequence(nextInput);
          typedRef.current = nextValue;
          setTyped(nextValue);
          setCursorIndex(nextCursor);
          const nextActivity = {
            ...activityRef.current,
            completedCharacters: Math.max(
              0,
              activityRef.current.completedCharacters +
                getCompletedGraphemes(activeParagraphUnits, nextCursor) -
                getCompletedGraphemes(activeParagraphUnits, currentCursor),
            ),
          };
          activityRef.current = nextActivity;
          setActivity(nextActivity);
          return;
        }

        const current = typedRef.current;
        if (!current.length) return;
        const units = segmentText(normalizeTypedText(current, activeTypingSystem));
        units.pop();
        const nextValue = units.join("");
        const currentCursor = Array.from(
          normalizeTypedText(current, activeTypingSystem),
        ).length;
        const nextCursor = Array.from(
          normalizeTypedText(nextValue, activeTypingSystem),
        ).length;
        typedRef.current = nextValue;
        setTyped(nextValue);
        setCursorIndex(nextCursor);
        const nextActivity = {
          ...activityRef.current,
          completedCharacters: Math.max(
            0,
            activityRef.current.completedCharacters -
              (getCompletedGraphemes(activeParagraphUnits, currentCursor) -
                getCompletedGraphemes(
                  activeParagraphUnits,
                  nextCursor,
                )),
          ),
        };
        activityRef.current = nextActivity;
        setActivity(nextActivity);
        return;
      }

      if (
        activeTypingSystem.keyboardLayout.keyInputMode === "browser-key" &&
        event.key.length !== 1
      ) {
        return;
      }
      const mappedCharacter = getMappedOutput(event, activeTypingSystem);
      if (!mappedCharacter || mappedCharacter.length === 0) return;
      event.preventDefault();

      if (activeTypingSystem.inputMode === "custom-conversion") {
        const inputCursor = inputSequenceRef.current.length;
        if (inputCursor >= activeInputText.length) return;
        const expectedInput = activeInputText[inputCursor];
        const isCorrect = mappedCharacter === expectedInput;
        const nextInput = `${inputSequenceRef.current}${mappedCharacter}`;
        const convertedInput = normalizeTypedText(
          convertAnmolInput(nextInput),
          activeTypingSystem,
        );
        const pendingCorrectInput =
          activeInputText.startsWith(nextInput) &&
          !activeParagraph.startsWith(convertedInput);
        const nextValue = pendingCorrectInput
          ? typedRef.current
          : convertedInput;
        const previousCursor = Array.from(
          normalizeTypedText(typedRef.current, activeTypingSystem),
        ).length;
        const nextCursor = Array.from(nextValue).length;
        const nextActivity = {
          ...activityRef.current,
          total: activityRef.current.total + 1,
          correct: activityRef.current.correct + (isCorrect ? 1 : 0),
          incorrect: activityRef.current.incorrect + (isCorrect ? 0 : 1),
          completedCharacters: Math.max(
            0,
            activityRef.current.completedCharacters +
              getCompletedGraphemes(activeParagraphUnits, nextCursor) -
              getCompletedGraphemes(activeParagraphUnits, previousCursor),
          ),
        };
        activityRef.current = nextActivity;
        setActivity(nextActivity);
        setFeedback({
          code: event.code,
          type: isCorrect ? "correct" : "incorrect",
        });
        inputSequenceRef.current = nextInput;
        setInputSequence(nextInput);
        typedRef.current = nextValue;
        setTyped(nextValue);
        setCursorIndex(nextCursor);

        if (nextInput.length === activeInputText.length) {
          const nextIndex = (paragraphIndex + 1) % practiceParagraphs.length;
          inputSequenceRef.current = "";
          typedRef.current = "";
          setInputSequence("");
          setTyped("");
          setCursorIndex(0);
          setParagraphIndex(nextIndex);
        }
        return;
      }

      const typedCursor = Array.from(
        normalizeTypedText(typedRef.current, activeTypingSystem),
      ).length;
      if (typedCursor >= activeParagraphCodePoints.length) return;

      const normalizedCharacter = normalizeTypedText(
        mappedCharacter,
        activeTypingSystem,
      );
      const mappedCodePoints = Array.from(normalizedCharacter);
      if (mappedCodePoints.length > activeParagraphCodePoints.length - typedCursor) {
        return;
      }
      const expectedOutput = activeParagraphCodePoints
        .slice(typedCursor, typedCursor + mappedCodePoints.length)
        .join("");
      const nextActivity = {
        ...activityRef.current,
        total: activityRef.current.total + segmentText(normalizedCharacter).length,
      };
      const isCorrect = normalizedCharacter === expectedOutput;
      const outputUnits = segmentText(normalizedCharacter).length;
      if (!isCorrect) {
        nextActivity.incorrect += outputUnits;
      } else {
        nextActivity.correct += outputUnits;
      }
      const nextValue = `${typedRef.current}${normalizedCharacter}`;
      const nextCursor = Array.from(
        normalizeTypedText(nextValue, activeTypingSystem),
      ).length;
      nextActivity.completedCharacters =
        activityRef.current.completedCharacters +
        getCompletedGraphemes(activeParagraphUnits, nextCursor) -
        getCompletedGraphemes(activeParagraphUnits, typedCursor);
      activityRef.current = nextActivity;
      setActivity(nextActivity);
      setFeedback({
        code: event.code,
        type: isCorrect ? "correct" : "incorrect",
      });
      typedRef.current = nextValue;
      setTyped(nextValue);
      setCursorIndex(nextCursor);
      if (nextCursor === activeParagraphCodePoints.length) {
        const nextIndex = (paragraphIndex + 1) % practiceParagraphs.length;
        typedRef.current = "";
        setTyped("");
        setCursorIndex(0);
        setParagraphIndex(nextIndex);
      }
    }

    window.addEventListener("keydown", handlePracticeKeyDown, true);
    return () =>
      window.removeEventListener("keydown", handlePracticeKeyDown, true);
  }, [
    activeParagraph,
    activeParagraphCodePoints,
    activeParagraphUnits,
    activeInputText,
    activeTypingSystem,
    chapter,
    finished,
    paragraphIndex,
    practiceParagraphs,
    testStarted,
  ]);

  function resetAttemptState() {
    finishedRef.current = false;
    startedAtRef.current = 0;
    typedRef.current = "";
    inputSequenceRef.current = "";
    activityRef.current = {
      correct: 0,
      incorrect: 0,
      total: 0,
      completedCharacters: 0,
    };
    setTyped("");
    setInputSequence("");
    setActivity({
      correct: 0,
      incorrect: 0,
      total: 0,
      completedCharacters: 0,
    });
    setParagraphIndex(0);
    setTestStarted(false);
    setStartedAt(0);
    setElapsedMs(0);
    setRemainingMs(durationMs);
    setFinished(false);
    setResult(null);
    setCursorIndex(0);
    setPressedCodes(new Set());
    setFeedback(null);
    setBranded(false);
  }

  function selectTypingSystem(nextSystemId) {
    if (nextSystemId && !typingSystems[nextSystemId]) {
      setSelectionError("The selected typing system is not available.");
      return;
    }

    resetAttemptState();
    setLocalSelection({ id: nextSystemId || null });
    const nextSystem = nextSystemId ? typingSystems[nextSystemId] : null;
    setPendingLanguageId(nextSystem?.language || "");
    setSelectionError("");
    setStorageWriteFailed(!persistTypingSystem(nextSystemId));
  }

  function startPractice() {
    if (!activeTypingSystem) {
      setSelectionError("Select a supported typing system.");
      return;
    }
    const validation = validateTypingSystem(activeTypingSystem.id, chapter);
    if (!validation.valid) {
      return;
    }

    resetAttemptState();
    const started = Date.now();
    startedAtRef.current = started;
    setStartedAt(started);
    setRemainingMs(durationMs);
    setTestStarted(true);
  }

  function resetPractice() {
    resetAttemptState();
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
            {durationMinutes}-minute practice complete
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
  const expectedText = activeParagraphCodePoints.slice(cursorIndex).join("");
  const expected = activeTypingSystem
    ? activeTypingSystem.inputMode === "custom-conversion"
      ? getExpectedCodes(
          activeInputText[inputSequence.length],
          activeTypingSystem,
        )
      : getExpectedCodes(
          activeTypingSystem.keyboardLayout?.keyInputMode === "browser-key"
            ? activeParagraphCodePoints[cursorIndex]
            : expectedText,
          activeTypingSystem,
        )
    : [];
  const activeValidation = activeTypingSystem
    ? validateTypingSystem(activeTypingSystem.id, chapter)
    : { valid: false, errors: ["Select a supported typing system."] };
  const remainingLabel = startedAt ? formatTime(remainingMs) : formatTime(durationMs);

  if (!testStarted) {
    return (
      <section className="mx-auto flex h-full max-w-3xl flex-col justify-center">
        <div className="rounded-2xl border border-sky-200 bg-white p-5 shadow-sm sm:p-7">
          <Badge tone="sky">Typing setup</Badge>
          <h1 className="mt-2 text-2xl font-bold text-slate-950">Configure your practice</h1>
          <p className="mt-1 text-sm text-slate-600">
            Chapter {chapter.chapterNumber}: {chapter.title}
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <label className="text-xs font-bold text-slate-700">
              Language
              <select
                value={setupLanguageId}
                onChange={(event) => {
                  const nextLanguage = event.target.value;
                  if (!nextLanguage) {
                    selectTypingSystem(null);
                    return;
                  }
                  setPendingLanguageId(nextLanguage);
                  const availableSystem = getTypingSystemsForLanguage(
                    nextLanguage,
                  ).find((system) => system.status === "ready");
                  if (availableSystem) {
                    selectTypingSystem(availableSystem.id);
                  } else {
                    selectTypingSystem(null);
                    setPendingLanguageId(nextLanguage);
                    setSelectionError(
                      "No verified typing system is available for this language.",
                    );
                  }
                }}
                className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-sky-500"
              >
                <option value="">Choose a language</option>
                {typingLanguages.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </label>

            <label className="text-xs font-bold text-slate-700">
              Typing system and font
              <select
                value={activeTypingSystem?.id || ""}
                onChange={(event) => selectTypingSystem(event.target.value)}
                disabled={!setupLanguageId}
                className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-sky-500"
              >
                <option value="">Choose a font and layout</option>
                {setupSystems.map((system) => (
                  <option
                    key={system.id}
                    value={system.id}
                    disabled={system.status !== "ready"}
                  >
                    {system.font.name}
                    {system.status !== "ready"
                      ? ` (Unavailable: ${system.unavailableReason})`
                      : ` · ${system.keyboardLayout.label}`}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-bold text-slate-700">
              Typing Duration
              <select
                value={durationMinutes}
                onChange={(event) => setDurationMinutes(Number(event.target.value))}
                className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-sky-500"
              >
                {[1, 2, 5, 10, 15, 30].map((minutes) => (
                  <option key={minutes} value={minutes}>{minutes} minute{minutes === 1 ? "" : "s"}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <span className="font-bold">Selection:</span>{" "}
            {activeTypingSystem
              ? `${activeTypingSystem.label} · ${selectedFont.name} · ${activeTypingSystem.keyboardLayout?.label || "Unverified keyboard"} · ${durationMinutes} minute${durationMinutes === 1 ? "" : "s"}`
              : `Choose a language and verified typing system · ${durationMinutes} minute${durationMinutes === 1 ? "" : "s"}`}
          </div>

          {(selectionError ||
            (savedSystemUnknown
              ? "The saved typing system is no longer available."
              : activeTypingSystem && !activeValidation.valid
                ? activeValidation.errors.join(" ")
                : "")) && (
            <div
              className="mt-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950"
              role="alert"
            >
              <p className="font-bold">Typing system cannot start</p>
              <p className="mt-1 text-xs">
                {selectionError ||
                  (savedSystemUnknown
                    ? "The saved typing system is no longer available."
                    : activeValidation.errors.join("; "))}
              </p>
            </div>
          )}

          {activeTypingSystem && (
            <dl className="mt-3 grid gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] text-slate-500 sm:grid-cols-2">
              <div><dt className="inline font-bold">System ID: </dt><dd className="inline">{activeTypingSystem.id}</dd></div>
              <div><dt className="inline font-bold">Keyboard: </dt><dd className="inline">{activeTypingSystem.keyboardLayout?.label || "Unverified"}</dd></div>
              <div><dt className="inline font-bold">Mapping ID: </dt><dd className="inline">{activeTypingSystem.keyboardLayoutId}</dd></div>
              <div><dt className="inline font-bold">Input mode: </dt><dd className="inline">{activeTypingSystem.inputMode || "Unavailable until verified"}</dd></div>
              <div><dt className="inline font-bold">Output encoding: </dt><dd className="inline">{activeTypingSystem.outputEncoding || "Unavailable until verified"}</dd></div>
              <div><dt className="inline font-bold">Paragraph source: </dt><dd className="inline">{activeTypingSystem.paragraphSource}</dd></div>
            </dl>
          )}

          {storageWarning && (
            <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900" role="status">
              Browser session storage is unavailable; your system selection may not persist.
            </p>
          )}

          <div className="mt-5 flex justify-end gap-2">
            <Button href="/typing-tutor" variant="secondary">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back
            </Button>
            <Button
              onClick={startPractice}
              disabled={!activeValidation.valid}
            >
              <Keyboard className="h-4 w-4" aria-hidden />
              Start Typing
            </Button>
          </div>
        </div>
      </section>
    );
  }

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
            <p className="text-[9px] text-slate-500">
              {activeTypingSystem.label} · {selectedFont.name} ·{" "}
              {activeTypingSystem.keyboardLayout.label}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={resetPractice}
            className="rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-sky-700"
          >
            Change system
          </button>
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
                Paragraph {paragraphIndex + 1} of {practiceParagraphs.length}
              </h2>
              <p className="text-[10px] text-slate-500">
                Type each highlighted character correctly to continue
              </p>
            </div>
            <span className="shrink-0 rounded-md bg-white px-2 py-1 text-xs font-semibold tabular-nums text-slate-600">
            {activeTypingSystem.inputMode === "custom-conversion"
              ? getCompletedGraphemes(activeParagraphUnits, cursorIndex)
              : segmentText(
                  normalizeTypedText(typed, activeTypingSystem),
                ).length}{" "}
            / {activeParagraphUnits.length}
            </span>
          </div>
          <div
            ref={viewportRef}
            aria-label="Paragraph to type"
            className="min-h-[150px] flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5"
          >
            <p
              className="whitespace-pre-wrap break-words text-base leading-8 tracking-[0.025em] text-slate-700 sm:text-lg sm:leading-9"
              style={{ fontFamily: selectedFont.family }}
            >
              {paragraphUnitsWithOffsets.map(({ character, start, end }, index) => {
                const typedSlice = typedCodePoints.slice(start, Math.min(end, typedCodePoints.length)).join("");
                const isTyped = typedCodePoints.length > start;
                const isComplete = typedCodePoints.length >= end;
                const isPrefixCorrect =
                  character.startsWith(typedSlice) && isTyped;
                const isCorrect = isComplete && typedSlice === character;
                const isCurrent =
                  cursorIndex >= start && cursorIndex < end && !finished;
                return (
                  <span
                    key={index}
                    ref={isCurrent ? cursorRef : null}
                    className={`rounded-sm ${
                      isCurrent && (!isTyped || isPrefixCorrect)
                        ? "bg-sky-200 text-sky-950 ring-1 ring-sky-400"
                        : isTyped && !isPrefixCorrect
                          ? "bg-red-100 text-red-700 underline decoration-red-400 decoration-2 underline-offset-2"
                          : isTyped
                          ? isCorrect
                            ? "text-emerald-700"
                            : "text-slate-700"
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
                Timer starts when you select Start Typing
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
              style={{ fontFamily: selectedFont.family }}
            />
            {activeTypingSystem.inputMode === "custom-conversion" &&
              inputSequence && (
                <p className="mt-1 text-[10px] text-slate-500">
                  AnmolLipi input sequence: <code>{inputSequence}</code>
                </p>
              )}
            <p id="typing-input-help" className="mt-1 text-[10px] leading-4 text-slate-500">
              Incorrect keys are marked red and counted; typing continues.
              {storageWarning &&
                " Browser session storage is unavailable; your system selection may not persist."}
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
              Shift is shown above keys; AltGr layers appear at the right
            </span>
            {branded && (
              <a
                href="https://hdwebstudios.in"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
                aria-label="Visit HD Web Studios website"
              >
                <Badge
                  tone="aqua"
                  className="!px-1.5 !py-0 !text-[9px] transition-colors hover:bg-cyan-100"
                >
                  Harshdeep · HD Web Studios
                </Badge>
              </a>
            )}
          </div>
        </div>
        <VirtualKeyboard
          expected={expected}
          pressedCodes={pressedCodes}
          feedback={feedback}
          branded={branded}
          rows={activeTypingSystem.keyboardLayout.rows}
        />
      </section>
    </div>
  );
}
