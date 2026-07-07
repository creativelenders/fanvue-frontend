export const PLAN_LIMITS = {
  free: { 
    aiGenerations: 100, 
    socialPlatforms: 1, 
    seats: 1, 
    hasAdvancedAnalytics: false, 
    hasApiAccess: false 
  },
  starter: { 
    aiGenerations: 1000, 
    socialPlatforms: 1, 
    seats: 1, 
    hasAdvancedAnalytics: false, 
    hasApiAccess: false 
  },
  elite: { 
    aiGenerations: 5000, 
    socialPlatforms: 3, 
    seats: 3, 
    hasAdvancedAnalytics: true, 
    hasApiAccess: false 
  },
  agency: { 
    aiGenerations: 20000, 
    socialPlatforms: 10, 
    seats: 10, 
    hasAdvancedAnalytics: true, 
    hasApiAccess: true 
  },
} as const;

export type PlanSlug = keyof typeof PLAN_LIMITS;

export function getPlanLimits(planName: string) {
  const normalizedPlan = planName.toLowerCase() as PlanSlug;
  return PLAN_LIMITS[normalizedPlan] || PLAN_LIMITS.free;
}
