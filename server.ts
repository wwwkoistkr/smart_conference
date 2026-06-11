/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for summarization
  app.post("/api/summarize", async (req, res) => {
    try {
      const { title, participants, content, lengthOption } = req.body;

      if (!content || typeof content !== "string" || content.trim().length === 0) {
        return res.status(400).json({ error: "회의 내용을 입력해 주세요." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error("GEMINI_API_KEY is not defined.");
        return res.status(500).json({ error: "Gemini API 키가 설정되지 않았습니다. 관리자 웹 콘솔을 통해 Secrets 영역에 GEMINI_API_KEY를 추가해 주세요." });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Tailored prompt according to length preference
      let lengthGuide = "보통 요약 길이로 설정되어 논지가 유실되지 않는 핵심 중심 요약을 작성해 주세요.";
      if (lengthOption === "short") {
        lengthGuide = "짧은 요약 길이로 설정되어 있으므로 최대한 군더더기 빼고 핵심 골자만 명료하게 구성하세요.";
      } else if (lengthOption === "detailed") {
        lengthGuide = "상세한 요약 길이로 설정되어 있으므로 대화 맥락, 논항별 세부 입장, 예비 조사 등 세밀한 부분까지 충실히 기록해 주세요.";
      }

      const prompt = `회의 정보 및 내용을 바탕으로 깔끔하게 구조화된 요약본을 도출해 주십시오.

[회의 정보]
- 회의 제목: ${title || "회의 제목 없음"}
- 참석자: ${participants || "참석자 미지정"}

[회의 내용 원본]
${content}

[요약 기조 및 분량 가이드]
- 가이드: ${lengthGuide}

[작성 원칙]
1. 한 줄 요약 (headline): 회의 결과 무엇을 결정/논의했는지 직관적으로 알 수 있도록 명료하게 정리합니다. (~합니다 / ~입니다 체)
2. 주요 논의 내용 (keyPoints): 어떤 논점과 쟁점이 오갔는지 핵심만 번호 매김 등으로 제시합니다.
3. 결정 사항 (decisions): 최종 합의 및 확정 사항을 명료하게 나타내며, 전혀 없다면 "발생한 명시적 합의/결정 사항 없음" 과 같이 작성하십시오.
4. 해야 할 일 (actionItems): 실행 대안별 태스크와 담당자를 발췌해 구조화합니다. 인물이 특정되지 않았거나 누군지 알 수 없다면 담당자 항목을 '미지정' 혹은 회의 내용 근거로 유추된 역할(예: '마케팅팀')로 적어주십시오.
5. 공유용 정리본 (copyText): 줄바꿈과 마크다운 텍스트를 기가 막히게 조화시켜 이메일이나 사내 슬랙(Slack)/카카오톡으로 바로 복사하여 전송할 수 있는 완성형 서식을 국문으로 도출해 주십시오.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: `당신은 대기업 비서실이나 전략기획팀 소속의 15년 차 전문 서기입니다. 
당신의 임무는 두서없이 나열된 회의 구어체 속기록, 이지 메모, 슬랙 채팅방 논의 텍스트 등을 깔끔하고 품격 있는 국문 회의록으로 구조화하여 재구성하는 것입니다.
사용자가 선택한 세 가지 요약 길이 가이드에 의거하여 논지 정합성과 명확한 행동 계획을 끄집어냅니다. 반드시 JSON 형식의 스키마에 부합하는 결과를 도출하십시오.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: {
                type: Type.STRING,
                description: "전체 회의의 핵심을 한 눈에 관통하는 격식 있는 1문장 한 줄 요약",
              },
              keyPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "회의에서 주고받은 주요 쟁점 및 화두 목록",
              },
              decisions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "회의 결과 확정되거나 합의된 중요 의결 사항 목록",
              },
              actionItems: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    task: { type: Type.STRING, description: "후속 조치 담당 작업 내용" },
                    assignee: { type: Type.STRING, description: "실행 담당 팀원명 혹은 부서 (알 수 없다면 '미지정')" },
                  },
                  required: ["task", "assignee"],
                },
                description: "회의 이후 각 주체별로 행동해야 하는 액션 아이템 목록",
              },
              copyText: {
                type: Type.STRING,
                description: "즉각 공유가 가능하도록 정교하게 마크다운 줄바꿈이 가미된 최종 종합 요약/회의록 전문",
              },
            },
            required: ["headline", "keyPoints", "decisions", "actionItems", "copyText"],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Gemini로부터 비어있는 결과를 수신했습니다.");
      }

      res.setHeader("Content-Type", "application/json");
      res.send(responseText);
    } catch (error: any) {
      console.error("Error summarizing meeting notes:", error);
      res.status(500).json({ error: error.message || "회의 요약 작업을 원활하게 완료하지 못했습니다. 다시 시도해 주십시오." });
    }
  });

  // Serve static assets from Vite / dist in production, else mount Vite development server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[스마트 회의 요약] Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start full-stack server:", err);
});
