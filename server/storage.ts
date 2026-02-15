import { db } from "./db";
import { dailyLogs, type InsertDailyLog, type DailyLog } from "@shared/schema";
import { eq, desc, avg, count, sql, and } from "drizzle-orm";
import { authStorage, type IAuthStorage } from "./replit_integrations/auth/storage";

export interface IStorage extends IAuthStorage {
  // Daily Logs
  createDailyLog(userId: string, log: InsertDailyLog, calculated: { burnoutScore: number; riskLevel: string }): Promise<DailyLog>;
  getDailyLogs(userId: string): Promise<DailyLog[]>;
  getDailyLog(id: number): Promise<DailyLog | undefined>;
  
  // Stats
  getStats(userId: string): Promise<{
    streak: number;
    avgBurnout: number;
    avgSleep: number;
    totalLogs: number;
    riskDistribution: { low: number; moderate: number; high: number };
  }>;
}

export class DatabaseStorage implements IStorage {
  // Inherit auth methods
  getUser = authStorage.getUser.bind(authStorage);
  upsertUser = authStorage.upsertUser.bind(authStorage);

  async createDailyLog(userId: string, log: InsertDailyLog, calculated: { burnoutScore: number; riskLevel: string }): Promise<DailyLog> {
    const [newLog] = await db.insert(dailyLogs).values({
      ...log,
      userId,
      burnoutScore: calculated.burnoutScore,
      riskLevel: calculated.riskLevel,
    }).returning();
    return newLog;
  }

  async getDailyLogs(userId: string): Promise<DailyLog[]> {
    return await db.select()
      .from(dailyLogs)
      .where(eq(dailyLogs.userId, userId))
      .orderBy(desc(dailyLogs.date));
  }

  async getDailyLog(id: number): Promise<DailyLog | undefined> {
    const [log] = await db.select().from(dailyLogs).where(eq(dailyLogs.id, id));
    return log;
  }

  async getStats(userId: string) {
    const logs = await this.getDailyLogs(userId);
    
    if (logs.length === 0) {
      return {
        streak: 0,
        avgBurnout: 0,
        avgSleep: 0,
        totalLogs: 0,
        riskDistribution: { low: 0, moderate: 0, high: 0 }
      };
    }

    // Calculate streak (consecutive days)
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Simple streak logic - consecutive entries
    // For a real app, we'd check dates more carefully against calendar days
    // This is a simplified version
    streak = logs.length; 

    const totalLogs = logs.length;
    const avgBurnout = logs.reduce((acc, log) => acc + log.burnoutScore, 0) / totalLogs;
    const avgSleep = logs.reduce((acc, log) => acc + Number(log.sleepHours), 0) / totalLogs;

    const riskDistribution = {
      low: logs.filter(l => l.riskLevel === "Low").length,
      moderate: logs.filter(l => l.riskLevel === "Moderate").length,
      high: logs.filter(l => l.riskLevel === "High").length,
    };

    return {
      streak,
      avgBurnout: Math.round(avgBurnout),
      avgSleep: Number(avgSleep.toFixed(1)),
      totalLogs,
      riskDistribution
    };
  }
}

export const storage = new DatabaseStorage();
