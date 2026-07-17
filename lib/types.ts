import type { ScamAnalysis, WarningSign } from "./ai/schema";

export type { WarningSign };
export type RiskLevel = ScamAnalysis["riskLevel"];

export type AnalysisResult = ScamAnalysis & {
  id: string;
  submissionType: string;
  platform: string;
  submittedText: string;
  submittedUrl?: string;
  createdAt: string;
};
