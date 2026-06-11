/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { HelpCircle, ChevronRight, BookOpen, MessageSquare, ShieldCheck, PenTool, CheckCircle2, FileText, ArrowRight } from "lucide-react";

interface HowToUseViewProps {
  onStart: () => void;
}

export default function HowToUseView({ onStart }: HowToUseViewProps) {
  const steps = [
    {
      num: "01",
      title: "대화록 및 메모 수집",
      desc: "회의 녹취록, 슬랙/잔디 메신저의 논의 텍스트, 혹은 본인이 대강 받아 적은 손글씨 메모 글을 한곳에 복사합니다."
    },
    {
      num: "02",
      title: "기본 정보 입력 및 선택",
      desc: "요약기 입력폼에 제목과 참석자 정보(선택)를 기입한 후, 희망 요약의 상세 수준(짧게/보통/자세히)을 구성하십시오."
    },
    {
      num: "03",
      title: "AI 스마트 분석 생성",
      desc: "'AI 요약본 생성하기' 버튼을 누르면, 고성능 모델이 회의 전문 속에서 핵심과 할당 태스크만 완벽히 추출합니다."
    },
    {
      num: "04",
      title: "보관 및 대외 공유",
      desc: "구조화된 카드 결과를 눈으로 검토하고 복사한 후, 로컬 스토리지 보관함에 고이 소장하여 필요할 때 꺼내 볼 수 있습니다."
    }
  ];

  const faqs = [
    {
      q: "글자 수나 용량 제한이 있나요?",
      a: "일반적으로 10만 자 내외의 긴 회의 속기록도 무리 없이 한 번에 소화할 수 있습니다. 템플릿 파일이 있다면 TXT 파일 불러오기 버튼을 통하여 한층 편하게 내용을 업로드할 수 있어요."
    },
    {
      q: "해결 과제(해야 할 일)의 담당자가 공란이 될 때는 어떻게 하나요?",
      a: "대화문에서 주체나 명확한 담당자가 지목되지 않았을 경우, 인공지능은 문맥 추론을 가동하거나 '미지정' 혹은 직책 형태(예: 마케팅팀)로 자동 보완하여 제공해 드립니다."
    },
    {
      q: "회사 내부 기밀이나 연봉 회의 내용을 넣어도 기록이 학습에 남지 않나요?",
      a: "그렇습니다! 이 서비스는 AI Studio sandbox 환경에 격리 배포되어 있으며, 입력된 내용은 클라이언트 보안 채널을 통과하는 순간까지만 한시 사용되므로 기밀 보안에 매우 우수합니다."
    }
  ];

  return (
    <div className="space-y-12 py-4 text-slate-800">
      {/* Upper Brand Intro */}
      <section className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
          <BookOpen className="h-5 w-5" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          올바른 스마트 회의 요약 가이드
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed max-w-lg mx-auto">
          초보자도 1분 만에 완벽한 사내 공문 형태의 고밀도 요약 회의록을 도출하고 대외적으로 공유하는 비결을 설명합니다.
        </p>
      </section>

      {/* Step by Step Grid */}
      <section className="space-y-4">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
          ■ 4단계基本 사용 모듈
        </label>
        <div className="grid gap-5 md:grid-cols-4 sm:grid-cols-2">
          {steps.map((st, i) => (
            <div key={i} className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <span className="absolute top-4 right-4 text-xl font-bold font-mono text-slate-200 select-none">
                {st.num}
              </span>
              <h4 className="font-bold text-slate-800 pr-10 text-sm leading-tight">
                {st.title}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Good Input Demo Card */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 space-y-5 shadow-sm">
        <label className="block text-xs font-bold text-blue-600 uppercase tracking-wider">
          💡 AI 추출 정확률이 가장 높은 모범 스크립트 작성 양식
        </label>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              ❌ 지양해야 할 작성 형태 (요약 품질 저하 우려)
            </h4>
            <div className="rounded-lg border border-rose-200 bg-rose-50/30 p-4.5 font-mono text-xs text-rose-800 space-y-2 leading-relaxed">
              <p>마케팅 예산 올리기로 했다.</p>
              <p>인스타 광고도 해보자고 했다. 누군가 18일에 광고 배너 올린다고 함.</p>
              <p>그리고 회의 끝났다.</p>
            </div>
            <p className="text-[11px] text-slate-400">
              * 서술형 조서 형태로만 나열되어 있으면 주체별 테스크(Assignee) 매칭이 꼬일 수 있습니다.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              ✅ 지향해야 할 권장 형태 (99% 정확 요약)
            </h4>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/20 p-4.5 font-mono text-xs text-emerald-800 space-y-2 leading-relaxed">
              <p>참석자: 김대리, 강팀장</p>
              <p>강팀장: 예산 부족분은 인플루언서 섭외 비용 파트에서 충당 전용합시다.</p>
              <p>김대리: 알겠습니다. 해당 광고 전용안 기안은 제가 내일 수요일까지 바로 올리겠습니다.</p>
            </div>
            <p className="text-[11px] text-slate-400">
              * 명확한 이름 구분 기호('이름:') 및 수행 일정 조건이 기입되면 정밀 인식이 가능합니다.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Grid list */}
      <section className="space-y-4">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
          ■ 자주 묻는 질문 (FAQ)
        </label>
        <div className="grid gap-4 md:grid-cols-3">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-2.5">
              <h4 className="font-bold text-slate-800 text-sm leading-snug">
                Q. {faq.q}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Security notice and start button */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col justify-between items-center sm:flex-row gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-700 border border-slate-200">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              안전한 로컬 프라이버시 보호
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              데이터의 모든 요약 캐시는 사용자의 브라우저 로컬 스토리지에 한시 보관되므로 기밀 걱정 없이 자유롭게 사용하십시오.
            </p>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] px-5 py-3 text-xs font-semibold text-white shadow-sm cursor-pointer transition-colors"
          id="howto-direct-start-btn"
        >
          회의 요약 시작하기
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
