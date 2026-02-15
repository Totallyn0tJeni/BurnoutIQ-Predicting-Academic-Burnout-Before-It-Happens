import { useLogs } from "@/hooks/use-burnout";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function History() {
  const { data: logs, isLoading } = useLogs();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-48 mb-6" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">History Log</h2>
        <p className="text-muted-foreground mt-1">Review your past entries and trends.</p>
      </div>

      <Card className="border-border/50 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="text-right">Sleep</TableHead>
                <TableHead className="text-right">Study</TableHead>
                <TableHead className="text-right">Mood</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No logs found. Start tracking today!
                  </TableCell>
                </TableRow>
              ) : (
                logs?.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">
                      {format(new Date(log.date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={
                          log.riskLevel === "Low" ? "border-green-500 text-green-600 bg-green-50" :
                          log.riskLevel === "Moderate" ? "border-orange-500 text-orange-600 bg-orange-50" :
                          "border-red-500 text-red-600 bg-red-50"
                        }
                      >
                        {log.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold">{log.burnoutScore}</TableCell>
                    <TableCell className="text-right">{log.sleepHours}h</TableCell>
                    <TableCell className="text-right">{log.hoursStudied}h</TableCell>
                    <TableCell className="text-right">{log.moodRating}/10</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
