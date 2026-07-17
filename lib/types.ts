export type RiskLevel="Low Risk"|"Suspicious"|"High Risk"|"Critical Risk";
export type WarningSign={indicatorName:string;explanation:string;evidence:string;scoreContribution:number};
export type AnalysisResult={id:string;riskScore:number;riskLevel:RiskLevel;scamCategory:string;confidence:number;summary:string;warningSigns:WarningSign[];suspiciousPhrases:string[];recommendedActions:string[];submissionType:string;platform:string;submittedText:string;submittedUrl?:string;createdAt:string};
