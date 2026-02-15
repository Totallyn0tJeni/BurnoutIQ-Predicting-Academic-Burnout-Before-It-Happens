import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  api, 
  type DailyLogResponse, 
  type CreateDailyLogInput,
  type StatsResponse,
  type InterventionsResponse
} from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// Fetch all logs
export function useLogs() {
  return useQuery({
    queryKey: [api.logs.list.path],
    queryFn: async () => {
      const res = await fetch(api.logs.list.path, { credentials: "include" });
      if (!res.ok) {
        if (res.status === 401) return null;
        throw new Error("Failed to fetch logs");
      }
      return await res.json() as DailyLogResponse[];
    },
  });
}

// Fetch single log
export function useLog(id: number) {
  return useQuery({
    queryKey: [api.logs.get.path, id],
    queryFn: async () => {
      const res = await fetch(api.logs.get.path.replace(":id", String(id)), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch log");
      return await res.json() as DailyLogResponse;
    },
    enabled: !!id,
  });
}

// Create new log
export function useCreateLog() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateDailyLogInput) => {
      const res = await fetch(api.logs.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create log");
      }
      return await res.json() as DailyLogResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.logs.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.get.path] });
      toast({
        title: "Log Saved",
        description: "Your daily burnout check-in has been recorded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

// Get Stats
export function useStats() {
  return useQuery({
    queryKey: [api.stats.get.path],
    queryFn: async () => {
      const res = await fetch(api.stats.get.path, { credentials: "include" });
      if (!res.ok) {
        if (res.status === 401) return null;
        throw new Error("Failed to fetch stats");
      }
      return await res.json() as StatsResponse;
    },
  });
}

// Get Interventions
export function useInterventions() {
  return useQuery({
    queryKey: [api.interventions.get.path],
    queryFn: async () => {
      const res = await fetch(api.interventions.get.path, { credentials: "include" });
      if (!res.ok) {
        if (res.status === 401) return null;
        throw new Error("Failed to fetch interventions");
      }
      return await res.json() as InterventionsResponse;
    },
  });
}
