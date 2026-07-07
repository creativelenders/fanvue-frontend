export interface Option<T = string> {
  label: string;
  value: T;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export type Period = "24h" | "7d" | "30d" | "90d";

export const PERIOD_OPTIONS: Option<Period>[] = [
  { label: "Last 24 Hours", value: "24h" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
];

export const PLATFORM_OPTIONS: Option[] = [
  { label: "All Platforms", value: "" },
  { label: "TikTok", value: "tiktok" },
  { label: "Instagram", value: "instagram" },
  { label: "Twitter / X", value: "twitter" },
  { label: "YouTube", value: "youtube" },
  { label: "Generic", value: "generic" },
];
