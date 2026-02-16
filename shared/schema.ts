import { pgTable, text, serial, integer, boolean, timestamp, numeric, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Export auth models
export * from "./models/auth";
import { users } from "./models/auth";

// === TABLE DEFINITIONS ===
export const dailyLogs = pgTable("daily_logs", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  date: date("date").notNull().defaultNow(),
  
  // Inputs
  hoursStudied: numeric("hours_studied").notNull(),
  assignmentsDue: integer("assignments_due").notNull(),
  sleepHours: numeric("sleep_hours").notNull(),
  moodRating: integer("mood_rating").notNull(), // 1-10
  extracurricularHours: numeric("extracurricular_hours").notNull(),
  screenTime: numeric("screen_time"), // Optional
  journalEntry: text("journal_entry"), // New field
  
  // Calculated fields
  burnoutScore: integer("burnout_score").notNull(),
  riskLevel: text("risk_level").notNull(), // "Low", "Moderate", "High"
  
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===
export const dailyLogsRelations = relations(dailyLogs, ({ one }) => ({
  user: one(users, {
    fields: [dailyLogs.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  dailyLogs: many(dailyLogs),
}));

// === BASE SCHEMAS ===
export const insertDailyLogSchema = createInsertSchema(dailyLogs).omit({ 
  id: true, 
  userId: true, 
  createdAt: true,
  burnoutScore: true,
  riskLevel: true 
}).extend({
  hoursStudied: z.number().min(0).max(24),
  assignmentsDue: z.number().min(0),
  sleepHours: z.number().min(0).max(24),
  moodRating: z.number().min(1).max(10),
  extracurricularHours: z.number().min(0).max(24),
  screenTime: z.number().min(0).max(24).optional(),
  journalEntry: z.string().optional(),
});

// === EXPLICIT API CONTRACT TYPES ===
export type DailyLog = typeof dailyLogs.$inferSelect;
export type InsertDailyLog = z.infer<typeof insertDailyLogSchema>;

// Request types
export type CreateDailyLogRequest = InsertDailyLog;

// Response types
export type DailyLogResponse = DailyLog;
export type DailyLogsListResponse = DailyLog[];

export interface StatsResponse {
  currentStreak: number;
  averageBurnoutScore: number;
  averageSleep: number;
  riskDistribution: {
    low: number;
    moderate: number;
    high: number;
  };
}

export interface Intervention {
  id: string;
  title: string;
  description: string;
  type: "sleep" | "workload" | "mood" | "general";
  impact?: string; // e.g. "Reduces risk by 15%"
}

export type InterventionsResponse = Intervention[];
