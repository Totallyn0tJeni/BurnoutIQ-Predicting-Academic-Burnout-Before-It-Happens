import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/models/auth";

async function fetchUser(): Promise<User | null> {
  const response = await fetch("/api/auth/user", {
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
}

async function logout(): Promise<void> {
  window.location.href = "/api/logout";
}

export function useAuth() {
  const queryClient = useQueryClient();
  const user = {
    id: "default-user",
    username: "student",
    firstName: "Student",
    email: "student@burnoutiq.app"
  };
  
  return {
    user,
    isLoading: false,
    isAuthenticated: true,
    logout: () => {},
    isLoggingOut: false,
  };
}
