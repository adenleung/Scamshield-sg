"use client";

import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  FileSearch,
  Info,
  Phone,
  Quote,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import type { AnalysisResult, RiskLevel, WarningSign } from "@/lib/types";

const levelStyles: Record<RiskLevel, string> = {
  "Very Low": "bg-emerald-100 text-emerald-800",
  Low: "bg-lime-100 text-lime-800",
  Moderate: "bg-amber-100 text-amber-800",
  High: "bg-orange-100 text-orange-800",
  Critical: "bg-red-100 text-red-800",
};

const severityStyles: Record<WarningSign["severity"], string> = {
  Low: "bg-slate-100 text-slate-700",
  Moderate: "bg-amber-100 text-amber-800",
  High: "bg-orange-100 text-orange-800",
  Critical: "bg-red-100 text-red-800",
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${levelStyles[level]}`}>{level}</span>;
}

export function RiskScoreGauge({ score, level }: { score: number; level: RiskLevel | "Critical Risk" }) {
  const normalizedLevel: RiskLevel = level === "Critical Risk" ? "Critical" : level;
  const color = score <= 20 ? "#059669" : score <= 40 ? "#65a30d" : score <= 60 ? "#d97706" : score <= 80 ? "#ea580c" : "#dc2626";
  return (
    <div className="relative grid h-48 w-48 shrink-0 place-items-center rounded-full shadow-inner" style={{ background: `conic-gradient(${color} ${score * 3.6}deg,#e8edf3 0)` }}>
      <div className="grid h-40 w-40 place-items-center rounded-full bg-white text-center shadow-sm">
        <div>
          <strong className="block text-5xl font-black text-navy">{score}</strong>
          <span className="text-sm text-slate-500">/ 100</span>
          <div className="mt-2"><RiskBadge level={normalizedLevel} /></div>
        </div>
      </div>
    </div>
  );
}

export function WarningSignCard({ item }: { item: WarningSign }) {
  return (
    <article className="card p-6 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-red-50"><AlertTriangle className="text-red-600" size={21} /></div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${severityStyles[item.severity]}`}>{item.severity}</span>
      </div>
      <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{item.explanation}</p>
      <blockquote className="mt-4 rounded-xl border-l-4 border-red-300 bg-red-50/70 p-4 text-sm text-slate-700">
        <Quote className="mb-2 text-red-400" size={16} />“{item.evidence}”
      </blockquote>
    </article>
  );
}

export function SafetyDisclaimer() {
  return <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950"><Info className="shrink-0" /><p><b>Automated risk assessment:</b> ScamShield AI+ cannot guarantee that content is safe or fraudulent. Never share an OTP, password, full card number, Singpass password, seed phrase or private key. Verify using official channels.</p></div>;
}

export function RecommendedActions({ actions }: { actions: string[] }) {
  return <div className="grid gap-3 md:grid-cols-2">{actions.map((action) => <div className="card flex gap-3 p-4" key={action}><CheckCircle2 className="shrink-0 text-emerald-600" /><span className="font-semibold">{action}</span></div>)}</div>;
}

export function EmptyState({ title = "Nothing to show yet" }: { title?: string }) {
  return <div className="card py-14 text-center"><ShieldAlert className="mx-auto mb-4 h-10 w-10 text-slate-400" /><h3 className="text-xl font-bold">{title}</h3><p className="mt-2 text-slate-500">Add content and try again.</p></div>;
}

export function ErrorState({ message, retry }: { message: string; retry?: () => void }) {
  return <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"><b>We couldn’t complete the check.</b> {message} {retry && <button className="ml-2 underline" onClick={retry}>Retry</button>}</div>;
}

export function HelpStrip() {
  return <div className="bg-navy py-10 text-white"><div className="container flex flex-col items-start justify-between gap-5 md:flex-row md:items-center"><div><h2 className="text-2xl font-bold text-white">Think you may have been scammed?</h2><p className="mt-1 text-slate-300">Contact your bank immediately, then call ScamShield at 1799.</p></div><div className="flex gap-3"><a className="btn bg-white text-navy" href="tel:1799"><Phone size={18} />Call 1799</a><Link className="btn border border-white text-white" href="/help">Get help <ExternalLink size={16} /></Link></div></div></div>;
}

function HighlightedText({ text, phrases }: { text: string; phrases: string[] }) {
  const usable = phrases.filter((phrase) => phrase.length >= 3 && text.toLowerCase().includes(phrase.toLowerCase())).sort((a, b) => b.length - a.length);
  if (!usable.length) return <>{text}</>;
  const escaped = usable.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const lookup = new Set(usable.map((phrase) => phrase.toLowerCase()));
  return <>{text.split(regex).map((part, index) => lookup.has(part.toLowerCase()) ? <mark className="highlight" key={index}>{part}</mark> : part)}</>;
}

function DetailFlag({ label, active }: { label: string; active: boolean }) {
  return <div className={`rounded-xl border px-4 py-3 text-sm font-semibold ${active ? "border-red-200 bg-red-50 text-red-800" : "border-slate-200 bg-slate-50 text-slate-500"}`}>{active ? "Detected" : "Not detected"}<span className="mt-1 block text-navy">{label}</span></div>;
}

export function ResultView({ result }: { result: AnalysisResult }) {
  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <section className="card overflow-hidden">
        <div className="grid gap-10 p-7 md:grid-cols-[220px_1fr] md:p-10">
          <RiskScoreGauge score={result.riskScore} level={result.riskLevel} />
          <div>
            <p className="eyebrow flex items-center gap-2"><Sparkles size={16} />AI analysis complete</p>
            <h1 className="mt-3 text-4xl font-black">{result.scamCategory}</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{result.summary}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">Confidence</span><strong className="mt-1 block text-2xl">{result.confidence}%</strong></div>
              <div className="rounded-xl bg-slate-50 p-4"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">Risk level</span><div className="mt-2"><RiskBadge level={result.riskLevel} /></div></div>
              <div className="rounded-xl bg-slate-50 p-4"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">Platform</span><strong className="mt-1 block text-lg">{result.platform}</strong></div>
            </div>
          </div>
        </div>
      </section>

      <SafetyDisclaimer />

      <section className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
        <div className="card p-7 md:p-8"><h2 className="text-2xl font-bold">Detailed explanation</h2><div className="mt-5 space-y-4 leading-8 text-slate-600">{result.explanation.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></div>
        <div className="card p-7 md:p-8"><h2 className="text-2xl font-bold">Language analysis</h2><p className="mt-5 leading-7 text-slate-600">{result.languageAnalysis}</p></div>
      </section>

      {result.submittedText && <section className="card p-7 md:p-8"><div className="flex items-center gap-3"><FileSearch className="text-brand" /><h2 className="text-2xl font-bold">Suspicious text highlights</h2></div><p className="mt-2 text-sm text-slate-500">Highlighted phrases were identified by the AI as relevant evidence.</p><div className="mt-5 whitespace-pre-wrap rounded-2xl bg-slate-50 p-5 leading-8 text-slate-700"><HighlightedText text={result.submittedText} phrases={result.suspiciousPhrases} /></div></section>}

      <section><h2 className="mb-5 text-2xl font-bold">Warning signs</h2>{result.warningSigns.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{result.warningSigns.map((warning, index) => <WarningSignCard key={`${warning.title}-${index}`} item={warning} />)}</div> : <EmptyState title="No specific warning signs identified" />}</section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="card p-7"><h2 className="text-2xl font-bold">Red flags</h2><div className="mt-5 flex flex-wrap gap-2">{result.redFlags.length ? result.redFlags.map((flag) => <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-bold text-red-800" key={flag}>{flag}</span>) : <span className="text-slate-500">No distinct red-flag labels identified.</span>}</div></div>
        <div className="card p-7"><h2 className="text-2xl font-bold">Requests detected</h2><div className="mt-5 grid grid-cols-2 gap-3"><DetailFlag label="Money" active={result.moneyRequested} /><DetailFlag label="OTP" active={result.otpRequested} /><DetailFlag label="Bank details" active={result.bankDetailsRequested} /><DetailFlag label="Personal information" active={result.personalInformationRequested} /><DetailFlag label="Urgency" active={result.urgencyDetected} /><DetailFlag label="Impersonation" active={result.impersonationDetected} /></div>{result.suspiciousInformationRequested.length > 0 && <p className="mt-4 text-sm text-slate-600"><b>Information requested:</b> {result.suspiciousInformationRequested.join(", ")}</p>}</div>
      </section>

      <section><h2 className="mb-5 text-2xl font-bold">Recommended actions</h2><RecommendedActions actions={result.recommendedActions} /></section>

      <section className="card border-sky-200 bg-sky-50 p-7"><h2 className="text-xl font-bold">Overall recommendation</h2><p className="mt-3 leading-7 text-slate-700">{result.overallRecommendation}</p><p className="mt-5 border-t border-sky-200 pt-4 text-sm text-slate-600"><b>Limitations:</b> {result.limitations}</p></section>

      <Link href={`/incident?id=${result.id}`} className="btn-primary">Prepare Incident Summary</Link>
    </div>
  );
}
