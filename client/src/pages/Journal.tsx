import { useLogs } from "@/hooks/use-burnout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { BookText, Calendar, Quote } from "lucide-react";
import { motion } from "framer-motion";

export default function Journal() {
  const { data: logs, isLoading } = useLogs();
  
  const journalLogs = logs?.filter(log => log.journalEntry && log.journalEntry.trim().length > 0) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Daily Journal</h1>
        <div className="grid gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Daily Journal</h1>
        <p className="text-muted-foreground">Your reflections and thoughts tracked over time.</p>
      </div>

      <div className="grid gap-6">
        {journalLogs.length > 0 ? (
          journalLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border/50 flex flex-row items-center justify-between py-4">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(log.date), "MMMM do, yyyy")}
                  </div>
                  <div className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                    log.riskLevel === 'High' ? 'bg-destructive/10 text-destructive' : 
                    log.riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-green-100 text-green-700'
                  }`}>
                    {log.riskLevel} Risk
                  </div>
                </CardHeader>
                <CardContent className="p-6 relative">
                  <Quote className="absolute top-4 left-4 w-12 h-12 text-primary/5 -z-0" />
                  <p className="text-foreground leading-relaxed relative z-10 whitespace-pre-wrap">
                    {log.journalEntry}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border">
            <BookText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold">No journal entries yet</h3>
            <p className="text-muted-foreground max-w-xs mx-auto mt-2">
              Start writing in your journal when you complete your daily check-in.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
