import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

interface User {
  id: number;
  username: string;
  name: string;
  role: string;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      try {
        const res = await fetch(api.auth.me.path);
        if (!res.ok) {
          return null;
        }
        return res.json();
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user: user || null,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isWriter: user?.role === "writer",
    isLoading,
  };
}

