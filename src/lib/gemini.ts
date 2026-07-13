import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const MAX_INPUT_CHARS = 3000;

export type JobAnalysisResult = {
  coreKeywords: string[];
  resumeTip: string;
  taskKeywords: string[];
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction:
    "당신은 UXUI 디자이너 구직자를 돕는 커리어 코치입니다. 주어진 채용 공고 원문만 근거로 분석하세요. " +
    "공고에 명시되지 않은 내용은 추측하거나 지어내지 마세요. 간결하고 실용적인 톤을 유지하세요. " +
    "task_keywords는 개수를 채우기 위한 형식적인 단어를 넣지 말고, 이 공고에서 실제로 대표성이 있는 핵심 업무만 골라 " +
    "그 공고에 맞는 개수(2~4개)로 뽑으세요. 억지로 4개를 채우지 마세요. " +
    "resume_tip은 반드시 해요체(예: ~해요, ~예요, ~돼요, ~보여주세요)로 작성하고, 합쇼체(~습니다, ~하세요)는 쓰지 마세요.",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: {
        core_keywords: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          description: "공고에서 요구하는 핵심 역량 키워드 목록 (3~6개)",
        },
        resume_tip: {
          type: SchemaType.STRING,
          description:
            "포트폴리오/이력서에서 어필해야 할 포인트, 두 문장 이내. 반드시 해요체로 작성 (합쇼체 금지)",
        },
        task_keywords: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          minItems: 2,
          maxItems: 4,
          description:
            "이 직무가 실제로 대표하는 핵심 업무만 나타내는 짧은 단어 목록. 2~4개 범위에서 " +
            "공고 내용에 맞는 개수만큼만 (형식적으로 개수를 채우지 말 것).",
        },
      },
      required: ["core_keywords", "resume_tip", "task_keywords"],
    },
  },
});

// 공고 상세페이지 진입 시 호출되며, 결과는 호출부(JobAnalysis 테이블)에서 캐시되어 재실행되지 않는다.
export async function analyzeJobDescription(
  description: string
): Promise<JobAnalysisResult> {
  const truncated = description.slice(0, MAX_INPUT_CHARS);

  const result = await model.generateContent(
    `다음 채용 공고를 분석해줘.\n\n---\n${truncated}\n---`
  );

  const parsed = JSON.parse(result.response.text()) as {
    core_keywords?: string[];
    resume_tip?: string;
    task_keywords?: string[];
  };

  if (!parsed.core_keywords || !parsed.resume_tip || !parsed.task_keywords) {
    throw new Error("AI 분석 응답 형식이 올바르지 않습니다.");
  }

  return {
    coreKeywords: parsed.core_keywords,
    resumeTip: parsed.resume_tip,
    taskKeywords: parsed.task_keywords.slice(0, 4),
  };
}

export type ExternalJobAnalysisResult = {
  title: string;
  companyName: string;
  coreKeywords: string[];
  resumeTip: string;
};

// 마이페이지 "링크로 추가" 기능용. analyzeJobDescription과 달리 title/companyName을 이미
// 알지 못하는 상태(임의의 외부 페이지 원문)라 이 두 값도 AI가 원문에서 함께 추출해야 한다.
const externalModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction:
    "당신은 UXUI 디자이너 구직자를 돕는 커리어 코치입니다. 사용자가 붙여넣은 채용 공고 페이지의 원문(HTML에서 추출된 텍스트라 " +
    "메뉴/푸터 등 불필요한 텍스트가 섞여 있을 수 있음)만 근거로 분석하세요. 공고에 명시되지 않은 내용은 추측하거나 지어내지 마세요. " +
    "간결하고 실용적인 톤을 유지하세요. resume_tip은 반드시 해요체(예: ~해요, ~예요, ~돼요, ~보여주세요)로 작성하고, " +
    "합쇼체(~습니다, ~하세요)는 쓰지 마세요. title/company_name은 원문에서 실제로 확인되는 값만 쓰고, 알 수 없으면 " +
    "각각 \"채용공고\", \"알 수 없는 회사\"로 답하세요.",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING, description: "채용공고 제목" },
        company_name: { type: SchemaType.STRING, description: "채용 회사명" },
        core_keywords: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          description: "공고에서 요구하는 핵심 역량 키워드 목록 (3~6개)",
        },
        resume_tip: {
          type: SchemaType.STRING,
          description:
            "포트폴리오/이력서에서 어필해야 할 포인트, 두 문장 이내. 반드시 해요체로 작성 (합쇼체 금지)",
        },
      },
      required: ["title", "company_name", "core_keywords", "resume_tip"],
    },
  },
});

export async function analyzeExternalJobPosting(
  pageText: string
): Promise<ExternalJobAnalysisResult> {
  const truncated = pageText.slice(0, MAX_INPUT_CHARS);

  const result = await externalModel.generateContent(
    `다음은 사용자가 붙여넣은 채용 공고 페이지에서 추출한 텍스트야. 분석해줘.\n\n---\n${truncated}\n---`
  );

  const parsed = JSON.parse(result.response.text()) as {
    title?: string;
    company_name?: string;
    core_keywords?: string[];
    resume_tip?: string;
  };

  if (!parsed.title || !parsed.company_name || !parsed.core_keywords || !parsed.resume_tip) {
    throw new Error("AI 분석 응답 형식이 올바르지 않습니다.");
  }

  return {
    title: parsed.title,
    companyName: parsed.company_name,
    coreKeywords: parsed.core_keywords,
    resumeTip: parsed.resume_tip,
  };
}
