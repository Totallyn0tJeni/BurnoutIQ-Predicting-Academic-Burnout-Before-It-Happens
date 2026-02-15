import { useStats, useLogs, useInterventions } from "@/hooks/use-burnout";
import { useAuth } from "@/hooks/use-auth";
import { BurnoutMeter } from "@/components/BurnoutMeter";
import { TrendChart } from "@/components/TrendChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  AlertTriangle, 
  Moon, 
  BookOpen, 
  TrendingUp, 
  Zap,
  CheckCircle2,
  Calendar,
  Activity,
  Shield
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: logs, isLoading: logsLoading } = useLogs();
  const { data: interventions, isLoading: interventionsLoading } = useInterventions();

  // Get today's log to see if they checked in
  const today = format(new Date(), 'yyyy-MM-dd');
  const hasLoggedToday = logs?.some(log => format(new Date(log.date), 'yyyy-MM-dd') === today);

  if (statsLoading || logsLoading || interventionsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Skeleton className="h-[300px] w-full md:w-1/3 rounded-2xl" />
          <Skeleton className="h-[300px] w-full md:w-2/3 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            Hello, {user?.firstName || 'Student'}
          </h2>
          <p className="text-muted-foreground mt-1">Here is your daily resilience report.</p>
        </div>
        {!hasLoggedToday && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20"
          >
            <Calendar className="w-4 h-4" />
            Don't forget to log today!
          </motion.div>
        )}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Burnout Meter */}
        <Card className="col-span-1 rounded-2xl border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-yellow-500" />
              Current Status
            </CardTitle>
            <CardDescription>Real-time burnout risk analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <BurnoutMeter score={stats?.averageBurnoutScore || 0} />
          </CardContent>
        </Card>

        {/* Trend Chart */}
        <Card className="col-span-1 lg:col-span-2 rounded-2xl border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-primary" />
              7-Day Trend
            </CardTitle>
            <CardDescription>Your stress levels over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart data={logs || []} />
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold tracking-tight">{stats?.currentStreak || 0}</p>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Day Streak</p>
        </div>
        
        <div className="bg-white dark:bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Moon className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold tracking-tight">{stats?.averageSleep || 0}h</p>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Avg Sleep</p>
        </div>

        <div className="bg-white dark:bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold tracking-tight">
            {logs && logs.length > 0 ? (logs.reduce((acc, l) => acc + Number(l.hoursStudied), 0) / logs.length).toFixed(1) : "0"}h
          </p>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Study / Day</p>
        </div>

        <div className="bg-white dark:bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <p className={cn(
            "text-3xl font-bold tracking-tight",
            (stats?.averageBurnoutScore || 0) > 60 ? "text-destructive" : (stats?.averageBurnoutScore || 0) > 30 ? "text-yellow-600" : "text-green-600"
          )}>
            {(stats?.averageBurnoutScore || 0) > 60 ? "High" : (stats?.averageBurnoutScore || 0) > 30 ? "Moderate" : "Low"}
          </p>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Risk Level</p>
        </div>
      </div>

      {/* Interventions */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Recommended Interventions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interventions?.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-card to-secondary/30 border border-border/50 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <span className={cn(
                  "text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide",
                  item.type === 'sleep' && "bg-indigo-100 text-indigo-700",
                  item.type === 'workload' && "bg-orange-100 text-orange-700",
                  item.type === 'mood' && "bg-pink-100 text-pink-700",
                  item.type === 'general' && "bg-gray-100 text-gray-700",
                )}>
                  {item.type}
                </span>
                {item.impact && (
                  <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full border border-green-100">
                    {item.impact}
                  </span>
                )}
              </div>
              <h4 className="font-bold text-lg mb-2 text-foreground/90">{item.title}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">{item.description}</p>
            </motion.div>
          ))}
          
          {(!interventions || interventions.length === 0) && (
            <div className="col-span-full p-8 text-center bg-muted/20 rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground">Great job! No high-priority interventions needed right now. Keep maintaining your balance.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
