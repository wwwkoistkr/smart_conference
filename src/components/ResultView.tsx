/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Copy,
  FolderLock,
  ArrowRight,
  ClipboardCheck,
  CheckSquare,
  Square,
  Sparkle,
  Calendar,
  Layers,
  ArrowLeft,
  ChevronRight,
  Bookmark,
  CheckCircle,
  FileCheck
} from "lucide-react";
import { MeetingInput, SummaryOutput } from "../types";

interface ResultViewProps {
  input: MeetingInput;
  output: SummaryOutput;
  onBackToInput: () => void;
  onSaveToHistory: () => void;
  isSaved: boolean;
}

export default function ResultView({
  input,
  output,
  onBackToInput,
  onSaveToHistory,
  isSaved,
}: ResultViewProps) {
  const [copiedText, setCopiedText] = useState(false);
  const [actionItemDone, setActionItemDone] = useState<Record<number, boolean>>({});

  const toggleActionItem = (index: number) => {
    setActionItemDone((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleCopyClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output.copyText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch (err) {
      console.error("복사에 실패했습니다.", err);
    }
  };

  return (
    <div className="space-y-6 py-2">
      {/* Return Navigation and Status Accent */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
        <div>
          <button
            onClick={onBackToInput}
            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
            id="back-to-input-btn"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            다시 입력하기 (새 회의 요약)
          </button>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 line-clamp-1">
            🔍 요약 결과: {input.title || "회의 요약 분석본"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            AI 분석 완료. 중요한 내용만 보기 쉽게 카드로 정렬 및 요약 정리하였습니다.
          </p>
        </div>

        {/* Floating action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToInput}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            id="action-reshuffle-btn"
          >
            새 요약 시작
          </button>
          <button
            onClick={onSaveToHistory}
            disabled={isSaved}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              isSaved
                ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 shadow-sm"
            }`}
            id="action-save-btn"
          >
            {isSaved ? (
              <>
                <CheckCircle className="h-4 w-4" />
                보관함 저장 완료
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4 fill-emerald-700/10" />
                요약 보관함 저장
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Responsive 2 columns on PC, 1 full column on Mobile */}
      <div className="grid gap-6 md:grid-cols-12 text-slate-800">
        {/* Left Column (요약 결과 Cards - 7 of 12 columns) */}
        <div className="space-y-6 md:col-span-7">
          {/* Headline (한 줄 요약) - Highlighted card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              한 줄 요약
            </label>
            <p className="text-lg font-semibold leading-relaxed text-[#2563EB] font-sans">
              " {output.headline} "
            </p>
          </div>

          {/* Key Discussions Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
              주요 결정 및 합의 사항
            </label>
            {output.keyPoints && output.keyPoints.length > 0 ? (
              <ul className="space-y-3.5">
                {output.keyPoints.map((point, index) => (
                  <li key={index} className="flex gap-3 text-xs text-slate-700 leading-relaxed items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">감지된 핵심 발언 및 구어체 안건이 없습니다.</p>
            )}
          </div>

          {/* Key Decisions Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
              주요 결정 사항 목록
            </label>
            {output.decisions && output.decisions.length > 0 ? (
              <ul className="space-y-3">
                {output.decisions.map((decision, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                    <ChevronRight className="h-4 w-4 text-[#2563EB] shrink-0 mt-0.5" />
                    <span>{decision}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">명시적으로 결정된 안건이 존재하지 않습니다.</p>
            )}
          </div>

          {/* Interactive Checkbox Action Items Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                해야 할 일 (To-Do)
              </label>
              <span className="text-[10px] text-slate-400 font-medium">체크하여 상태를 추적하세요.</span>
            </div>
            {output.actionItems && output.actionItems.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {output.actionItems.map((item, index) => {
                  const done = actionItemDone[index] || false;
                  return (
                    <div
                      key={index}
                      onClick={() => toggleActionItem(index)}
                      className={`flex items-start gap-3 py-3 transition-colors cursor-pointer select-none ${
                        done ? "opacity-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="pt-0.5 text-slate-400">
                        {done ? (
                          <div className="w-4.5 h-4.5 rounded border border-blue-600 bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-[10px]">✓</div>
                        ) : (
                          <div className="w-4.5 h-4.5 rounded border border-slate-300" />
                        )}
                      </div>
                      <div className="text-xs leading-relaxed">
                        <span className={`font-medium mr-2 transition-all ${
                          done ? "line-through text-slate-400" : "text-slate-800"
                        }`}>
                          {item.task}
                        </span>
                        {item.assignee && (
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${
                            done
                              ? "bg-slate-100 text-slate-400"
                              : "bg-[#EFF6FF] text-[#2563EB]"
                          }`}>
                            👤 {item.assignee}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">배정되거나 명기된 개별 할당 과제가 생략되어 있습니다.</p>
            )}
          </div>
        </div>

        {/* Right Column (복사 및 종합 공유 영역 - 5 of 12 columns) */}
        <div className="space-y-5 md:col-span-5">
          {/* Quick Info Box */}
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 flex justify-between text-xs text-slate-500">
            <div>
              <span className="font-semibold text-slate-600">작성 길이:</span>{" "}
              {input.lengthOption === "short" ? "짧게" : input.lengthOption === "detailed" ? "상세히" : "기본 보통"}
            </div>
            <div>
              <span className="font-semibold text-slate-600">참석자:</span>{" "}
              {input.participants || "미지정"}
            </div>
          </div>

          {/* Copy-Ready Markdown Container Card with dashed style & light gray background per instructions */}
          <div className="rounded-xl border border-dashed border-slate-200 bg-[#F1F5F9] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                전체 정리본 (공유용)
              </label>
              <button
                onClick={handleCopyClipboard}
                className={`flex items-center gap-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all focus:outline-none ${
                  copiedText ? "bg-emerald-600 hover:bg-emerald-700" : ""
                }`}
                id="copy-text-btn"
              >
                {copiedText ? (
                  <>
                    <ClipboardCheck className="h-3.5 w-3.5" />
                    <span>복사 완료</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>복사하기</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              사내 인트라넷, 슬랙, 혹은 업무 전송 메일에 바로 메꾸어 공유할 수 있도록 마크다운 포맷화된 정리본 텍스트입니다.
            </p>

            {/* Custom styled light background monospace element for the clean utility look */}
            <div className="relative rounded-lg bg-white border border-slate-200 p-4">
              <pre className="max-h-[350px] overflow-y-auto font-mono text-[11px] leading-relaxed text-[#475569] whitespace-pre-wrap selection:bg-blue-100">
                {output.copyText}
              </pre>
            </div>
          </div>

          {/* Instructions reference */}
          <div className="rounded-xl border border-slate-200 bg-white p-4.5 text-xs text-slate-500 leading-relaxed">
            <span className="font-bold text-slate-700">💡 활용 조언:</span> <strong>복사하기</strong> 버튼을 누르면 회의 정리본 전체가 클립보드에 담겨 전사 보고 메일 등에 즉각 활용할 수 있습니다.
          </div>
        </div>
      </div>
    </div>
  );
}
