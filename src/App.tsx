/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileText, Sparkles, Loader2, RefreshCw, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { SavedMeeting, MeetingInput, SummaryOutput, SummaryLength } from "./types";
import Header from "./components/Header";
import HomeView from "./components/HomeView";
import InputView from "./components/InputView";
import ResultView from "./components/ResultView";
import HowToUseView from "./components/HowToUseView";

const HISTORY_STORAGE_KEY = "smart_meetings_history_mvp_v1";

export default function App() {
  const [screen, setScreen] = useState<"home" | "input" | "result" | "howto">("home");
  const [history, setHistory] = useState<SavedMeeting[]>([]);
  
  // Current active summary session
  const [activeInput, setActiveInput] = useState<MeetingInput | null>(null);
  const [activeOutput, setActiveOutput] = useState<SummaryOutput | null>(null);
  const [isSavedInActiveSession, setIsSavedInActiveSession] = useState(false);

  // Flow conditions
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [errorText, setErrorText] = useState("");

  // Load local store history on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (cached) {
        setHistory(JSON.parse(cached));
      }
    } catch (e) {
      console.error("보관함 히스토리를 불러오는 데 실패했습니다.", e);
    }
  }, []);

  // Save history helper
  const updateAndSaveHistory = (updated: SavedMeeting[]) => {
    setHistory(updated);
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("보관함 히스토리를 저장하는 데 실패했습니다.", e);
    }
  };

  const handleStartNewSummary = () => {
    setErrorText("");
    setScreen("input");
  };

  // Triggers API Call for summarization
  const handleSummarizeRequest = async (input: MeetingInput) => {
    setIsGenerating(true);
    setErrorText("");
    setStatusText("회의 대본 원본을 검토 및 해독하는 중입니다...");
    setActiveInput(input);
    setActiveOutput(null);
    setIsSavedInActiveSession(false);

    // Stagger status changes for professional user experience
    const statusIntervals = [
      setTimeout(() => setStatusText("회의 대화 전반의 한 줄 요약 맥락을 적립하고 있습니다..."), 2200),
      setTimeout(() => setStatusText("포인트 논점 및 결정된 합의안 구조를 정연하게 도축 중입니다..."), 4500),
      setTimeout(() => setStatusText("마감 일정에 기초한 미지정 후속 할당 업무를 분류하는 중입니다..."), 7000),
      setTimeout(() => setStatusText("팀원 전송용 최종 마크다운 공유 보고서를 서식하는 중입니다..."), 10000),
    ];

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      // Clear all scheduled text updates
      statusIntervals.forEach((timer) => clearTimeout(timer));

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || "회의 내용을 요약하는 중 에러가 발생했습니다.");
      }

      const data: SummaryOutput = await response.json();
      setActiveOutput(data);
      setScreen("result");
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "요약 생성에 실패했습니다. 형식 규격을 확인하신 후 다시 시도해 주세요.");
    } finally {
      setIsGenerating(false);
      setStatusText("");
    }
  };

  // Save current active summary to persistent offline storage
  const handleSaveToHistory = () => {
    if (!activeInput || !activeOutput) return;

    // Check if copy duplicate is already present in database
    const isDuplicate = history.some(
      (m) =>
        m.input.title === activeInput.title &&
        m.input.content === activeInput.content &&
        m.input.lengthOption === activeInput.lengthOption
    );

    if (isDuplicate) {
      setIsSavedInActiveSession(true);
      return;
    }

    const newItem: SavedMeeting = {
      id: `meeting-${Date.now()}`,
      createdAt: new Date().toISOString(),
      input: activeInput,
      output: activeOutput,
    };

    const updated = [newItem, ...history];
    updateAndSaveHistory(updated);
    setIsSavedInActiveSession(true);
  };

  const handleDeleteHistoryItem = (id: string) => {
    const filter = history.filter((m) => m.id !== id);
    updateAndSaveHistory(filter);
  };

  const handleSelectSavedItem = (saved: SavedMeeting) => {
    setActiveInput(saved.input);
    setActiveOutput(saved.output);
    setIsSavedInActiveSession(true); // Already persisted
    setErrorText("");
    setScreen("result");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 font-sans antialiased text-slate-800">
      {/* Navbar Component */}
      <Header currentScreen={screen} onNavigate={(scr) => setScreen(scr)} />

      {/* Main Content View with Slide/Fade animation wrappers */}
      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center min-h-[380px] py-12 text-center max-w-md mx-auto"
            >
              <div className="relative mb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#2563EB] text-white shadow-sm">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-800 tracking-tight">
                회의 내용을 요약하는 중입니다
              </h3>
              <p className="mt-1.5 text-xs text-slate-400 max-w-sm">
                Gemini 3.5 모델을 가동하여 전반적인 원문 맥락을 도식하는 전반 필터링 과정이 수행되고 있습니다.
              </p>
              
              <div className="mt-6 w-full rounded-lg border border-slate-200 bg-white px-5 py-4 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">AI 분석 진행 상태</span>
                <p className="mt-2 text-xs text-blue-700 font-semibold animate-pulse">
                  {statusText || "회의 분석 모듈 준비 중..."}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={screen}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {screen === "home" && (
                <HomeView
                  onStartSummarize={handleStartNewSummary}
                  onGoToHowto={() => setScreen("howto")}
                  history={history}
                  onSelectSaved={handleSelectSavedItem}
                  onDeleteSaved={handleDeleteHistoryItem}
                />
              )}

              {screen === "input" && (
                <InputView
                  onSubmit={handleSummarizeRequest}
                  onBack={() => setScreen("home")}
                  isGenerating={isGenerating}
                />
              )}

              {screen === "result" && activeInput && activeOutput && (
                <ResultView
                  input={activeInput}
                  output={activeOutput}
                  onBackToInput={() => setScreen("input")}
                  onSaveToHistory={handleSaveToHistory}
                  isSaved={isSavedInActiveSession}
                />
              )}

              {screen === "howto" && (
                <HowToUseView onStart={handleStartNewSummary} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Floating Error banner */}
        {errorText && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm rounded-xl border border-rose-200 bg-white p-4.5 shadow-xl flex gap-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <AlertTriangle className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">요약 생성에 실패했습니다</h4>
              <p className="mt-1 text-[11px] text-slate-500 leading-normal">{errorText}</p>
              <div className="mt-2.5 flex gap-2">
                <button
                  onClick={() => {
                    setErrorText("");
                    setScreen("input");
                  }}
                  className="rounded bg-rose-50 px-2 py-1 text-[10px] font-bold text-rose-700 hover:bg-rose-100"
                >
                  입력으로 가기
                </button>
                <button
                  onClick={() => setErrorText("")}
                  className="text-[10px] font-medium text-slate-400 hover:text-slate-600 px-1"
                >
                  닫기
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
