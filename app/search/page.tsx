"use client";

import { useArticles } from "@/hooks/use-content";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, Suspense } from "react";
import { setSEO, getBaseUrl } from "@/lib/seo";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);

  const { data: articles, isLoading } = useArticles({ search: activeQuery });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setActiveQuery(query);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  useEffect(() => {
    const baseUrl = getBaseUrl();
    setQuery(initialQuery);
    setActiveQuery(initialQuery);
    setSEO(
      `Search: ${initialQuery}`,
      `Search results for "${initialQuery}" on Brainfeed Magazine - find articles about STEM, tech careers, AI, and education.`,
      undefined,
      `${baseUrl}/search?q=${encodeURIComponent(initialQuery)}`
    );
  }, [initialQuery]);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      
      <main className="pt-[90px] pb-24">
        <div className="relative bg-gradient-to-br from-background via-primary/5 to-secondary/10 dark:from-[#0B1026] dark:via-primary/10 dark:to-secondary/10 border-b-2 border-slate-200 dark:border-slate-800 py-16 mb-16 overflow-hidden">
          {/* Decorative elements with new palette */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/15 to-secondary/10 rounded-full blur-3xl" />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-display font-black text-foreground mb-4">Search Articles</h1>
              <p className="text-muted-foreground text-lg">Discover insights across our content library</p>
            </div>
            
            <form onSubmit={handleSearch} className="relative">
              <div className="relative group">
                <Input 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for topics, authors, or keywords..."
                  className="h-16 pl-14 pr-32 text-lg rounded-2xl shadow-2xl border-2 border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6 group-focus-within:text-primary transition-colors" />
                <Button 
                  type="submit" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-12 rounded-xl px-8 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 font-bold shadow-lg shadow-primary/30"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            {isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground font-semibold">
                <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                Searching...
              </div>
            ) : (
              <p className="text-foreground font-bold text-lg">
                Found <span className="text-primary">{articles?.length || 0}</span> results for "{activeQuery}"
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[400px] bg-card rounded-2xl animate-pulse border-2 border-slate-200 dark:border-slate-800"></div>
              ))}
            </div>
          ) : articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="standard" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                <Search className="w-12 h-12 text-muted-foreground" />
              </div>
              <div className="text-center max-w-md">
                <h3 className="text-2xl font-bold font-display text-foreground mb-3">No Results Found</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  We couldn't find any articles matching "{activeQuery}". Try different keywords or browse our categories.
                </p>
                <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-xl px-6 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Browse Categories
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default function SearchResults() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
