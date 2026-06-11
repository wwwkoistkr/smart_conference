/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { FileText, HelpCircle, History, PlusCircle, Home } from "lucide-react";

interface HeaderProps {
  currentScreen: "home" | "input" | "result" | "howto";
  onNavigate: (screen: "home" | "input" | "result" | "howto") => void;
}

export default function Header({ currentScreen, onNavigate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo and App Title */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          id="nav-logo-btn"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m4-10l5 5 5-5m-5 5V3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          </div>
          <div className="text-left">
            <h1 className="text-base font-bold tracking-tight text-slate-800">
              스마트 회의 요약
            </h1>
          </div>
        </button>

        {/* Navigation Items */}
        <nav className="flex items-center gap-1.5">
          <button
            onClick={() => onNavigate("home")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
              currentScreen === "home"
                ? "bg-[#EFF6FF] text-[#2563EB]"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
            id="nav-home-btn"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">홈</span>
          </button>

          <button
            onClick={() => onNavigate("input")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
              currentScreen === "input" || currentScreen === "result"
                ? "bg-[#EFF6FF] text-[#2563EB]"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
            id="nav-input-btn"
          >
            <PlusCircle className="h-4 w-4" />
            <span>회의 요약</span>
          </button>

          <button
            onClick={() => onNavigate("howto")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
              currentScreen === "howto"
                ? "bg-[#EFF6FF] text-[#2563EB]"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
            id="nav-howto-btn"
          >
            <HelpCircle className="h-4 w-4" />
            <span>사용 방법</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
