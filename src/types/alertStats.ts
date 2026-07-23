export interface DailyAlertStat {
  date: string; // yyyy-MM-dd
  info: number;
  warning: number;
  critical: number;
  total: number;
}

export interface AlertStats {
  daily: DailyAlertStat[];
  totalCurrentPeriod: number;
  totalPreviousPeriod: number;
  trendPercent: number | null;
}
