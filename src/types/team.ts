export interface ChatterShift {
  id: string;
  chatterId: string;
  chatterName: string;
  startedAt: string;
  endedAt: string | null;
  totalMessages: number;
  totalPpvSent: number;
  conversionRate: string;
  revenue: string;
  avgResponseTime: number | null;
}

export interface ShiftSchedule {
  id: string;
  userId: string;
  userName: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone: string;
  isRecurring: boolean;
}

export interface CoverageData {
  hoursCovered: number;
  gapHours: number;
  coverageRate: number;
  weeklyCoverage: Array<{
    day: string;
    hours: number;
    gaps: Array<{ start: string; end: string }>;
  }>;
}

export interface LeaderboardEntry {
  chatterId: string;
  chatterName: string;
  avatarUrl: string | null;
  revenue: string;
  messages: number;
  ppvSent: number;
  conversionRate: string;
  avgResponseTime: number;
  shifts: number;
}
