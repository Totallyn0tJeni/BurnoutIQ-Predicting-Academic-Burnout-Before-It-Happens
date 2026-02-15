import { z } from 'zod';
import { insertDailyLogSchema, dailyLogs } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  logs: {
    list: {
      method: 'GET' as const,
      path: '/api/logs' as const,
      responses: {
        200: z.array(z.custom<typeof dailyLogs.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/logs' as const,
      input: insertDailyLogSchema,
      responses: {
        201: z.custom<typeof dailyLogs.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/logs/:id' as const,
      responses: {
        200: z.custom<typeof dailyLogs.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
  },
  stats: {
    get: {
      method: 'GET' as const,
      path: '/api/stats' as const,
      responses: {
        200: z.object({
          currentStreak: z.number(),
          averageBurnoutScore: z.number(),
          averageSleep: z.number(),
          riskDistribution: z.object({
            low: z.number(),
            moderate: z.number(),
            high: z.number(),
          }),
        }),
        401: errorSchemas.unauthorized,
      },
    },
  },
  interventions: {
    get: {
      method: 'GET' as const,
      path: '/api/interventions' as const,
      responses: {
        200: z.array(z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          type: z.enum(["sleep", "workload", "mood", "general"]),
          impact: z.string().optional(),
        })),
        401: errorSchemas.unauthorized,
      },
    },
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// ============================================
// TYPE HELPERS
// ============================================
export type CreateDailyLogInput = z.infer<typeof api.logs.create.input>;
export type DailyLogResponse = z.infer<typeof api.logs.create.responses[201]>;
export type DailyLogsListResponse = z.infer<typeof api.logs.list.responses[200]>;
export type StatsResponse = z.infer<typeof api.stats.get.responses[200]>;
export type InterventionsResponse = z.infer<typeof api.interventions.get.responses[200]>;
