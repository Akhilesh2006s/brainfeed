import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

// Articles Hooks
export function useArticles(filters?: { category?: string; featured?: boolean; search?: string }) {
  const queryParams = new URLSearchParams();
  if (filters?.category) queryParams.set("category", filters.category);
  if (filters?.featured !== undefined) queryParams.set("featured", String(filters.featured));
  if (filters?.search) queryParams.set("search", filters.search);

  const key = [api.articles.list.path, filters];
  
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      // Build URL with params manually since we have a dynamic query string
      const url = `${api.articles.list.path}?${queryParams.toString()}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch articles");
      return api.articles.list.responses[200].parse(await res.json());
    },
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: [api.articles.get.path, slug],
    queryFn: async () => {
      const url = buildUrl(api.articles.get.path, { slug });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch article");
      return api.articles.get.responses[200].parse(await res.json());
    },
    enabled: !!slug,
  });
}

// Categories Hooks
export function useCategories() {
  return useQuery({
    queryKey: [api.categories.list.path],
    queryFn: async () => {
      const res = await fetch(api.categories.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch categories");
      return api.categories.list.responses[200].parse(await res.json());
    },
  });
}
