/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { Sparkles, ArrowLeft, RefreshCw, Upload, Sparkle, AlertCircle, FileText } from "lucide-react";
import { MeetingInput, SummaryLength } from "../types";

interface InputViewProps {
  onSubmit: (input: MeetingInput) => void;
  onBack: () => void;
  isGenerating: boolean;
}

// Rich mock data presets that show up on-click for sample trials
const PRESETS = [
  {
    id: "marketing",
    name: "📢 주간 마케팅 회의",
    title: "상반기 광고 예산 실무 조정 및 신규 디스플레이 캠페인 일정 수립",
    participants: "강팀장, 김대리(마케팅), 박주임(그로스), 신파트너(디자이너)",
    content: `강팀장: 신규 캠페인 개시 일정하고 남은 광고 예산안 실질 집행 비율 조정합시다. 박주임 먼저 말해줘요.
박주임: 네, 6월 중순에 예정된 네이버 모바일 배너와 인스타 후원형 디스플레이 광고 시정안 정리했습니다. 연령대를 기존 20대에서 30대 중반까지 넓혀야 할 것 같고요. 이번 광고 대행사에 송출비 예산 증액을 15% 정도(약 500만 원 상당) 요청하는 바입니다.
김대리: 그런데 예산을 기획안 대비 15% 올린다면, 다음 달 예정인 오프라인 팝업스토어 홍보 비용에서 일부 끌어와야만 충당돼요. 오프라인 마케팅 측에서도 동의할까요?
강팀장: 오프라인 팝업은 공간 렌탈 계약이 이미 확정되어서 그 자금을 건드릴 수는 없어요. 대신 성과가 떨어지는 유튜브 인플루언서 섭외 비용 파트를 400만 원 줄이고, 해당 액수를 박주임이 말한 페이스북/인스타 배너 타겟 광고 쪽으로 전용해서 보정합시다. 100만 원 모자란 건 마케팅팀의 예비 경상비에서 가용하는 걸로 하죠.
신파트너: 디자인 배너 에셋은 6월 12일까지 초안 3개 폼 구성해서 피드백 받을 수 있도록 하겠습니다. 대행사 전달 및 런칭은 그럼 6월 18일로 홀딩하면 될까요?
박주임: 네, 6월 18일 오전 10시 정각 송출 스타트로 잡고 세팅해 두겠습니다.
강팀장: 좋습니다. 김대리는 이 상호 예산 변동 전용안 수립해서 기업 회재 승인 결재 바로 올려주고, 신파트너는 제작 초안 나오면 마케팅 단톡방에 선공유 부탁합니다. 이번 회의 마칩시다.`
  },
  {
    id: "sprint",
    name: "💻 7월 스크럼 데브 얼라인",
    title: "웹 애플리케이션 프론트엔드 모듈화 개편 및 크래시 에러 수정",
    participants: "이해찬(PM), 최우식(테크리드), 한소희(FE개발), 유재석(QA)",
    content: `이해찬: 7월 2차 스프린트 회의 시작합니다. 이슈 보드 보시면 현재 안드로이드 하단 탭 내비게이션 크래시 현상하고, 메인 대시보드 불러올 때 응답 지연 (API 통신 3초 이상 홀딩) 이슈가 가장 크네요. 최우식 님, 이거 원인 파악 되었나요?
최우식: 네, 대시보드 API 응답 지연 건은 DB 조인 인덱스가 제대로 정렬 안 된 상태에서 무분별한 카운트 쿼리가 발생하고 있었던 게 핵심이었습니다. 어제 밤에 인덱스 튜닝 작업 진행했고 모니터링해 보니 평균 0.2초 대로 응답 속도 제어 완료되었습니다.
한소희: 프론트엔드 모듈 개편 건은요, 레거시 컴포넌트가 너무 얽혀 있어서 이번 주 금요일까지 공통 Button/Input/Dropdown 단위를 컴포넌트 라이브러리 형태로 분리 수리해야 합니다. 컴포넌트 구조화 파일 경로는 /src/components/ui 하단으로 결합할 예정입니다.
유재석: 저번 주 배포 버전에서 아이폰 15 단말기 크롬 브라우저 로그인 풀림 버그가 또 들어왔더군요. 세션 쿠키 토폴로지에 SameSite 세팅 옵션 누락이 원인으로 보입니다.
이해찬: 그건 지체할 수 없는 핵심 QA 에러니까 당장 조치해야겠네요. 최우식 님은 SameSite 쿠키 속성 값 수정을 오늘 퇴근 전까지 긴급 패치로 커밋 처리하고 배포 서버에 밀어 넣어주세요.
한소희: 알겠습니다. 컴포넌트 구조는 내일 수요일 업무 개시 전까지 1차 코드리뷰 올려놓고 어사인 걸게요.
유재석: 긴급 배포 나가면 바로 크로스 모바일 테스트 돌려서 최종 검증 리포트 슬랙 채널 올리겠습니다.
이해찬: 수고하셨습니다. 이번 스프린트 목표 잘 준수합시다.`
  }
];

export default function InputView({ onSubmit, onBack, isGenerating }: InputViewProps) {
  const [title, setTitle] = useState("");
  const [participants, setParticipants] = useState("");
  const [content, setContent] = useState("");
  const [lengthOption, setLengthOption] = useState<SummaryLength>("medium");
  const [dragActive, setDragActive] = useState(false);
  const [errorText, setErrorText] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setTitle(preset.title);
    setParticipants(preset.participants);
    setContent(preset.content);
    setErrorText("");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setErrorText("회의 내용을 반드시 입력해 주세요! (직업 대화 녹취록이나 문서를 복사해 붙여넣으세요)");
      return;
    }
    setErrorText("");
    onSubmit({
      title: title.trim(),
      participants: participants.trim(),
      content: content.trim(),
      lengthOption,
    });
  };

  // Drag and Drop text file import logic
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (file.type !== "text/plain" && !file.name.endsWith(".txt")) {
      setErrorText("TXT(.txt) 텍스트 파일만 업로드할 수 있습니다.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        setContent(text);
        setErrorText("");
      }
    };
    reader.onerror = () => {
      setErrorText("파일을 읽는 과정에서 오류가 발생했습니다.");
    };
    reader.readAsText(file, "UTF-8");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="mx-auto max-w-4xl py-2 space-y-6">
      {/* Return Button and Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="group flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
            title="뒤로 가기"
            id="back-home-btn"
          >
            <ArrowLeft className="h-4.5 w-4.5 transition-transform group-hover:-translate-x-0.5" />
          </button>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              회의 요약 작성
            </h2>
            <p className="text-xs text-slate-500">안건, 회의록 스크립트 정보를 업로드하고 AI 요약을 시작합니다.</p>
          </div>
        </div>

        {/* Dynamic Preset selection bar */}
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Sparkle className="h-3 w-3 text-blue-500 animate-pulse" />
            빠른 체험 예시 입력:
          </span>
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-all hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-700 font-sans"
              id={`preset-btn-${preset.id}`}
              type="button"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Form Panel */}
        <form onSubmit={handleFormSubmit} className="space-y-6 lg:col-span-8 bg-white p-6.5 rounded-2xl border border-slate-200 shadow-sm">
          {errorText && (
            <div className="flex gap-2.5 rounded-lg bg-rose-50 p-4 text-xs font-semibold text-rose-700 border border-rose-200">
              <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              <div>{errorText}</div>
            </div>
          )}

          {/* Title Area */}
          <div className="space-y-2">
            <label htmlFor="meeting-title" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              회의 제목 <span className="text-slate-400 font-normal">(선택)</span>
            </label>
            <input
              type="text"
              id="meeting-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 2024년 1분기 마케팅 전략 회의"
              className="w-full rounded-lg border border-slate-200 bg-[#F1F5F9] hover:bg-[#EFF3F6] px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-600 focus:bg-white"
              maxLength={120}
              disabled={isGenerating}
            />
          </div>

          {/* Participants Area */}
          <div className="space-y-2">
            <label htmlFor="meeting-participants" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              참석자 <span className="text-slate-400 font-normal">(선택)</span>
            </label>
            <input
              type="text"
              id="meeting-participants"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="예: 김대리, 이과장, 박팀장 (쉼표 구분)"
              className="w-full rounded-lg border border-slate-200 bg-[#F1F5F9] hover:bg-[#EFF3F6] px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-600 focus:bg-white"
              maxLength={150}
              disabled={isGenerating}
            />
          </div>

          {/* Content Script Area (With drag & drop) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="meeting-content" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                회의 내용 <span className="text-rose-500 font-bold">*</span>
              </label>
              <span className="text-[10px] text-slate-400 font-medium">
                글자수: {content.length} 자
              </span>
            </div>

            <div
              className={`relative flex flex-col rounded-lg border transition-all ${
                dragActive
                  ? "border-blue-600 bg-blue-50/20"
                  : "border-slate-200 bg-[#F1F5F9]"
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <textarea
                id="meeting-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="전체 회의 내용을 여기에 입력하거나 붙여넣으세요...
일시와 인물의 상세 발화가 기록되어 있을수록 정확한 액션 아이템이 성립됩니다."
                className="w-full min-h-[220px] rounded-t-lg bg-transparent px-4 py-3.5 text-sm outline-none resize-y transition-all focus:bg-white focus:border-transparent"
                style={{ border: "none" }}
                disabled={isGenerating}
              />

              {/* Minimal drag indicators inside box */}
              <div className="flex items-center justify-between px-3 py-2 border-t border-slate-200/60 bg-slate-100 rounded-b-lg gap-2">
                <p className="text-[11px] text-slate-500">
                  회의 내용을 직접 입력하거나 텍스트 파일을 드래그하여 투하해 보세요.
                </p>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 rounded bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
                    id="file-upload-trigger"
                    disabled={isGenerating}
                  >
                    <Upload className="h-3 w-3 text-slate-500" />
                    TXT 파일 불러오기
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    accept=".txt"
                    className="hidden"
                    disabled={isGenerating}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 요약 길이 선택 (Length Preference Selector) */}
          <div className="space-y-2">
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              요약 스타일
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {(["short", "medium", "detailed"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setLengthOption(opt)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                    lengthOption === opt
                      ? "border-blue-600 bg-[#EFF6FF] text-blue-700 font-semibold"
                      : "border-slate-200 bg-[#F1F5F9] text-slate-600 hover:bg-slate-200/70"
                  }`}
                  id={`length-btn-${opt}`}
                  disabled={isGenerating}
                >
                  <span className="text-sm">
                    {opt === "short" ? "짧게 (핵심만)" : opt === "detailed" ? "자세히 (상세 분석)" : "보통 (기본)"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sumbit Button */}
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] py-3.5 text-sm font-semibold text-white shadow-sm transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            id="run-summary-submit"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                회의 내용을 분석하는 중입니다...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-blue-200 fill-blue-200/40" />
                AI 요약 생성하기
              </>
            )}
          </button>
        </form>

        {/* Right Reference Cards Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-blue-50/20 p-5 space-y-4.5">
            <h3 className="text-sm font-bold text-blue-900 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-blue-600" />
              💡 유용한 작성 팁
            </h3>
            <ul className="space-y-3.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-semibold shrink-0">•</span>
                <span>회의 스크립트에 <strong>'이름: 내용'</strong> 또는 <strong>'김대리: 업무 보고'</strong>의 형태로 작성해 주시면 AI가 발화 주체를 구분해 역할과 해야 할 일을 쉽게 추출해 드립니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-semibold shrink-0">•</span>
                <span>파일 업로드 기능(TXT 플레인 파일만 지원)을 이용해 스마트폰 음성 메모 앱에서 텍스트로 변환된 회의를 바로 올려 분석할 수도 있습니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-semibold shrink-0">•</span>
                <span>결정된 약속이나 날짜(예: '6월 18일 정각')가 텍스트에 포함되어 있으면, 마감 기한 액션 아이템으로 정확히 명세됩니다.</span>
              </li>
            </ul>
          </div>

          {/* Quick FAQ summary */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3">
              보안 및 주의사항
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              입력하신 텍스트 정보는 브라우저를 벗어난 타 상업 목적 가공이나 인공지능 모델의 학습 자료로 사용되지 않으므로 안심하고 실무에 바로 사용할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
