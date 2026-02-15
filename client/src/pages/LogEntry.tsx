import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateLog } from "@/hooks/use-burnout";
import { useLocation } from "wouter";
import { insertDailyLogSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { Loader2, Moon, BookOpen, Smile, Gamepad2, Monitor, AlertCircle } from "lucide-react";

// Schema for the form
const formSchema = insertDailyLogSchema.extend({
  hoursStudied: z.coerce.number().min(0).max(24),
  assignmentsDue: z.coerce.number().min(0),
  sleepHours: z.coerce.number().min(0).max(24),
  moodRating: z.number().min(1).max(10),
  extracurricularHours: z.coerce.number().min(0).max(24),
  screenTime: z.coerce.number().min(0).max(24).optional(),
});

export default function LogEntry() {
  const [, setLocation] = useLocation();
  const { mutate, isPending } = useCreateLog();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hoursStudied: 0,
      assignmentsDue: 0,
      sleepHours: 7,
      moodRating: 5,
      extracurricularHours: 0,
      screenTime: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values, {
      onSuccess: () => {
        setLocation("/");
      },
    });
  }

  return (
    <div className="max-w-2xl mx-auto py-4 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Daily Check-in</h1>
          <p className="text-muted-foreground">Log your metrics to keep your prediction model accurate.</p>
        </div>

        <Card className="rounded-2xl border-border/50 shadow-lg">
          <CardHeader className="bg-muted/30 border-b border-border/50 rounded-t-2xl">
            <CardTitle>Today's Metrics</CardTitle>
            <CardDescription>Be honest — this data is for your eyes only.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Workload Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
                    <BookOpen className="w-5 h-5" /> Workload
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="hoursStudied"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hours Studied</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.5" {...field} className="h-12 rounded-xl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="assignmentsDue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assignments Due (This Week)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="h-12 rounded-xl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="h-px bg-border/50" />

                {/* Wellness Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
                    <Moon className="w-5 h-5" /> Wellness
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="sleepHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sleep (Hours)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.5" {...field} className="h-12 rounded-xl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="extracurricularHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Extracurriculars (Hours)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.5" {...field} className="h-12 rounded-xl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="moodRating"
                    render={({ field }) => (
                      <FormItem className="pt-2">
                        <div className="flex justify-between items-center mb-2">
                          <FormLabel>Mood Rating (1-10)</FormLabel>
                          <span className="font-bold text-xl text-primary">{field.value}</span>
                        </div>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-muted-foreground">Stressed</span>
                            <Slider
                              min={1}
                              max={10}
                              step={1}
                              value={[field.value]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                              className="flex-1"
                            />
                            <span className="text-xs text-muted-foreground">Great</span>
                          </div>
                        </FormControl>
                        <FormDescription>How do you feel mentally today?</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="h-px bg-border/50" />

                {/* Optional */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
                    <Monitor className="w-5 h-5" /> Other
                  </h3>
                  <FormField
                    control={form.control}
                    name="screenTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Screen Time (Optional)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.5" placeholder="e.g. 4.5" {...field} className="h-12 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={isPending}
                    className="w-full h-14 text-lg font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Calculating Risk...
                      </>
                    ) : (
                      "Submit Daily Log"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
