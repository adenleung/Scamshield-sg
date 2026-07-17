import { NextResponse } from "next/server";
import { analyseScam, ScamAnalysisError } from "@/lib/ai/analyse-scam";
import { analysisRequestSchema } from "@/lib/ai/schema";

export const runtime = "nodejs";
export const maxDuration = 45;

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const hits = new Map<string, { count: number; resetAt: number }>();

function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt <= now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

export async function POST(request: Request) {
  try {
    if (isRateLimited(clientIp(request))) {
      return NextResponse.json(
        { error: "Too many checks. Please wait one minute and try again.", code: "RATE_LIMITED" },
        { status: 429 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "The request body must be valid JSON." }, { status: 400 });
    }

    const parsed = analysisRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid analysis request." },
        { status: 400 },
      );
    }

    return NextResponse.json(await analyseScam(parsed.data));
  } catch (error) {
    if (error instanceof ScamAnalysisError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    console.error("Analysis route failed", error);
    return NextResponse.json({ error: "Analysis failed unexpectedly. Please retry." }, { status: 500 });
  }
}
