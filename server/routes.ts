import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { dailyLogs } from "@shared/schema"; // For seed data type

// Helper to calculate burnout score
function calculateBurnout(data: {
  hoursStudied: number;
  assignmentsDue: number;
  sleepHours: number;
  moodRating: number;
}): { score: number; risk: string } {
  // Burnout Score Formula (0-100)
  // 1. Workload Intensity (35%): Based on hours studied and assignments
  // Max expected: 12 hours study, 10 assignments
  const workloadScore = Math.min(100, ((data.hoursStudied / 12) * 50) + ((data.assignmentsDue / 10) * 50));
  
  // 2. Sleep Deprivation (25%): 8 hours is ideal. < 4 is max risk.
  const sleepScore = Math.max(0, Math.min(100, (8 - data.sleepHours) * 25));
  
  // 3. Mood Decline (20%): 1 is bad (high risk), 10 is good (low risk)
  const moodScore = Math.max(0, Math.min(100, (10 - data.moodRating) * 11));
  
  // 4. Deadline Density (20%): Uses assignments due as proxy
  const deadlineScore = Math.min(100, (data.assignmentsDue / 5) * 100);

  const totalScore = Math.round(
    (workloadScore * 0.35) +
    (sleepScore * 0.25) +
    (deadlineScore * 0.20) +
    (moodScore * 0.20)
  );

  let risk = "Low";
  if (totalScore > 60) risk = "High";
  else if (totalScore > 30) risk = "Moderate";

  return { score: totalScore, risk };
}

// Generate interventions based on data
function generateInterventions(score: number, data: any) {
  const interventions = [];
  
  if (data.sleepHours < 6) {
    interventions.push({
      id: "sleep-1",
      title: "Sleep Optimization",
      description: "You're getting less than 6 hours of sleep. Try to go to bed 45 minutes earlier tonight.",
      type: "sleep",
      impact: "Reduces burnout risk by ~15%"
    });
  }

  if (data.hoursStudied > 8) {
    interventions.push({
      id: "work-1",
      title: "Break Strategy",
      description: "High study volume detected. Use the Pomodoro technique (25m work / 5m break) to maintain focus.",
      type: "workload",
      impact: "Improves retention by 20%"
    });
  }

  if (score > 60) {
    interventions.push({
      id: "urgent-1",
      title: "High Burnout Risk Alert",
      description: "Your risk level is High. Consider dropping one non-essential activity this week.",
      type: "general",
      impact: "Immediate risk reduction"
    });
  }

  return interventions;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // === API Routes ===

  // Create Log
  app.post(api.logs.create.path, async (req, res) => {
    try {
      const input = api.logs.create.input.parse(req.body);
      
      const { score, risk } = calculateBurnout(input);
      const userId = "default-user";

      const log = await storage.createDailyLog(userId, input, { 
        burnoutScore: score, 
        riskLevel: risk 
      });
      
      res.status(201).json(log);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // List Logs
  app.get(api.logs.list.path, async (req, res) => {
    const userId = "default-user";
    const logs = await storage.getDailyLogs(userId);
    res.json(logs);
  });

  // Get Stats
  app.get(api.stats.get.path, async (req, res) => {
    const userId = "default-user";
    const stats = await storage.getStats(userId);
    res.json(stats);
  });

  // Get Interventions (based on latest log)
  app.get(api.interventions.get.path, async (req, res) => {
    const userId = "default-user";
    const logs = await storage.getDailyLogs(userId);
    const latestLog = logs[0];

    if (!latestLog) {
      return res.json([]);
    }

    const interventions = generateInterventions(latestLog.burnoutScore, latestLog);
    res.json(interventions);
  });

  // Seed Data (Development Only)
  if (process.env.NODE_ENV === "development") {
    app.post("/api/seed", async (req, res) => {
      const userId = "default-user";
      const logs = await storage.getDailyLogs(userId);
      if (logs.length > 0) {
        return res.json({ message: "Data already exists" });
      }

      const seedData = [
        { hoursStudied: 4, assignmentsDue: 2, sleepHours: 7.5, moodRating: 8, extracurricularHours: 1, screenTime: 3 },
        { hoursStudied: 5, assignmentsDue: 3, sleepHours: 7, moodRating: 7, extracurricularHours: 2, screenTime: 4 },
        { hoursStudied: 6, assignmentsDue: 4, sleepHours: 6.5, moodRating: 6, extracurricularHours: 1, screenTime: 5 },
        { hoursStudied: 8, assignmentsDue: 6, sleepHours: 6, moodRating: 5, extracurricularHours: 0, screenTime: 6 },
        { hoursStudied: 10, assignmentsDue: 8, sleepHours: 5, moodRating: 4, extracurricularHours: 0, screenTime: 7 }, // High burnout
      ];

      for (const data of seedData) {
        const { score, risk } = calculateBurnout(data);
        await storage.createDailyLog(userId, data, { burnoutScore: score, riskLevel: risk });
      }

      res.json({ message: "Seeded 5 logs" });
    });
  }

  return httpServer;
}
