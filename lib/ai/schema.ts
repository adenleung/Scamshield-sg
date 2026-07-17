import { z } from "zod";

export const riskLevelSchema = z.enum([
  "Very Low",
  "Low",
  "Moderate",
  "High",
  "Critical",
]);

export const warningSignSchema = z.object({
  title: z.string().min(1).max(100),
  severity: z.enum(["Low", "Moderate", "High", "Critical"]),
  explanation: z.string().min(1).max(800),
  evidence: z.string().min(1).max(500),
});

export const scamAnalysisSchema = z.object({
  riskScore: z.number().int().min(0).max(100),
  confidence: z.number().int().min(0).max(100),
  riskLevel: riskLevelSchema,
  scamCategory: z.string().min(1).max(120),
  summary: z.string().min(1).max(1200),
  explanation: z.string().min(1).max(5000),
  warningSigns: z.array(warningSignSchema).max(12),
  recommendedActions: z.array(z.string().min(1).max(300)).min(1).max(12),
  redFlags: z.array(z.string().min(1).max(80)).max(15),
  suspiciousInformationRequested: z.array(z.string().min(1).max(120)).max(15),
  linksDetected: z.array(z.string().min(1).max(2048)).max(20),
  moneyRequested: z.boolean(),
  otpRequested: z.boolean(),
  bankDetailsRequested: z.boolean(),
  personalInformationRequested: z.boolean(),
  urgencyDetected: z.boolean(),
  impersonationDetected: z.boolean(),
  languageAnalysis: z.string().min(1).max(2000),
  overallRecommendation: z.string().min(1).max(1200),
  limitations: z.string().min(1).max(1000),
  suspiciousPhrases: z.array(z.string().min(1).max(300)).max(12),
});

export const analysisRequestSchema = z
  .object({
    text: z.string().trim().max(12_000, "Content must be 12,000 characters or fewer.").default(""),
    url: z.string().trim().max(2048, "The URL is too long.").optional(),
    submissionType: z.enum(["text", "screenshot", "link", "qr", "investment"]),
    platform: z.string().trim().max(80).default("Other"),
  })
  .refine((value) => value.text.length > 0 || Boolean(value.url), {
    message: "Add content to analyse.",
  });

export type ScamAnalysis = z.infer<typeof scamAnalysisSchema>;
export type WarningSign = z.infer<typeof warningSignSchema>;
export type AnalysisRequest = z.infer<typeof analysisRequestSchema>;
