/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Play, HelpCircle, History, Trash2, Calendar, Users, Eye, ArrowRight } from "lucide-react";
import { SavedMeeting } from "../types";

interface HomeViewProps {
  onStartSummarize: () => void;
  onGoToHowto: () => void;
  history: SavedMeeting[];
  onSelectSaved: (meeting: SavedMeeting) => void;
  onDeleteSaved: (id: string) => void;
}

export default function HomeView({
  onStartSummarize,
  onGoToHowto,
  history,
  onSelectSaved,
  onDeleteSaved,
}: HomeViewProps) {
  return (
    <div className="space-y-12 py-2">
      {/* Clean Utility Minimalist Header Card */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
        <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-blue-50 to-transparent opacity-60 rounded-bl-3xl"></div>
        <div className="relative max-w-2xl space-y-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-[11px] font-semibold text-blue-700 uppercase tracking-wider">
            ⚡ AI 스마트 서기 MVP
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl leading-snug">
            긴 회의 내용을 몇 초 만에<br /> 핵심만 깔끔하게 정리해 드립니다
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
            불필요한 미사여구는 흘려보내고, 정성화된 논지와 합의 사안 및 담당 주체별 액션 플랜을 일목요연한 대시보드 리포트로 반환합니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onStartSummarize}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-3 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              id="hero-start-btn"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              회의 요약 시작하기
            </button>
            <button
              onClick={onGoToHowto}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-slate-700 px-5 py-3 text-xs font-semibold transition-colors hover:bg-slate-50 cursor-pointer"
              id="hero-howto-btn"
            >
              <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
              사용 방법 보기
            </button>
          </div>
        </div>
      </section>

      {/* Feature Bento Cards Grid */}
      <section className="space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          ■ 주요 추출 내용 대시보드
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300">
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold text-xs">
              01
            </div>
            <h4 className="font-bold text-slate-800 text-sm">한 줄 요약</h4>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              사건 전반의 방향성을 단번에 꿰뚫는 품격 있는 요지 요약문을 수성합니다.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300">
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 font-bold text-xs">
              02
            </div>
            <h4 className="font-bold text-slate-800 text-sm">핵심 논의 대강</h4>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              회의 전반에서 오갔던 이해관계자들의 다양한 화두를 순차적으로 캐치합니다.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300">
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs">
              03
            </div>
            <h4 className="font-bold text-slate-800 text-sm">의결 및 결정 사항</h4>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              회의 내용 중 합의점을 이끌어낸 의제 목록을 따로 발간하여 검증을 돕습니다.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300">
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 font-bold text-xs">
              04
            </div>
            <h4 className="font-bold text-slate-800 text-sm">할 과제 (액션 리스트)</h4>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              회의가 끝난 후 누락 발생을 방지하기 위한 사후 관리 액션 플랜을 정비합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Local Storage History List */}
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <History className="h-4.5 w-4.5 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-800">
              📁 최근 요약 보관함
            </h3>
            <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              {history.length}
            </span>
          </div>
          {history.length > 0 && (
            <p className="text-xs text-slate-400">데이터는 개인 브라우저 내부(Local Storage)에 보관됩니다.</p>
          )}
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
              <History className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold text-slate-600">아직 등록된 요약본이 없습니다.</p>
            <p className="mt-0.5 text-[11px] text-slate-400">학업 또는 기획 회의록 내용을 등록하여 영구 무기한 소장하세요.</p>
            <button
              onClick={onStartSummarize}
              className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
              id="empty-start-btn"
            >
              새 요약 만들러 가기 <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {history.map((meeting) => (
              <div
                key={meeting.id}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-[#F8FAFC]/40 p-4 transition-all hover:border-blue-300 hover:bg-white"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {new Date(meeting.createdAt).toLocaleString("ko-KR", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSaved(meeting.id);
                      }}
                      className="rounded p-1 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                      title="삭제"
                      id={`delete-btn-${meeting.id}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <h4 className="mt-2 text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600">
                    {meeting.input.title || "제목 없는 회의 요약 보고"}
                  </h4>

                  {meeting.input.participants && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 line-clamp-1">
                      <Users className="h-3 w-3 shrink-0 text-slate-400" />
                      <span>{meeting.input.participants}</span>
                    </p>
                  )}

                  <p className="mt-2.5 text-xs text-slate-600 line-clamp-2 bg-white/80 border border-slate-100 p-2.5 rounded-lg">
                    🧠 {meeting.output.headline}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50/70 border border-blue-100/40 px-2 py-0.5 rounded">
                    {meeting.input.lengthOption === "short" ? "짧게" : meeting.input.lengthOption === "detailed" ? "자세하게" : "보통 요약"}
                  </span>

                  <button
                    onClick={() => onSelectSaved(meeting)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
                    id={`view-btn-${meeting.id}`}
                  >
                    결과 보기 <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
