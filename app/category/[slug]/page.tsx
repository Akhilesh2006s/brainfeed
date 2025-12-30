"use client";

import { useArticles, useCategories } from "@/hooks/use-content";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { MostPopular } from "@/components/MostPopular";
import { NewsletterBox } from "@/components/NewsletterBox";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { setSEO, setCanonical, setStructuredData, getBaseUrl } from "@/lib/seo";

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string || "";
  
  // If slug is "all" or empty, don't filter by category (show all articles)
  const categoryFilter = (slug === "all" || !slug) ? undefined : slug;
  const { data: articles, isLoading } = useArticles({ category: categoryFilter });
  const { data: categories } = useCategories();
  const { data: popularArticles } = useArticles();
  
  const currentCategory = categories?.find(c => c.slug === slug);
  const isAllArticles = slug === "all" || !slug || !currentCategory;

  useEffect(() => {
    const baseUrl = getBaseUrl();
    if (isAllArticles) {
      setSEO(
        "All Articles - Brainfeed Magazine",
        "Explore our latest stories, insights, and educational resources across all categories.",
        undefined,
        `${baseUrl}/category/all`
      );
      setCanonical(`${baseUrl}/category/all`);

      setStructuredData({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "All Articles",
        "description": "Explore our latest stories, insights, and educational resources.",
        "url": `${baseUrl}/category/all`
      });
    } else if (currentCategory) {
      setSEO(
        currentCategory.name,
        currentCategory.description || `Explore articles about ${currentCategory.name} on Brainfeed Magazine`,
        undefined,
        `${baseUrl}/category/${currentCategory.slug}`
      );
      setCanonical(`${baseUrl}/category/${currentCategory.slug}`);

      setStructuredData({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": currentCategory.name,
        "description": currentCategory.description,
        "url": `${baseUrl}/category/${currentCategory.slug}`
      });
    }
  }, [currentCategory, isAllArticles, slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-[72px] pb-24">
        {/* Category Header */}
        <header className="bg-slate-50 border-b-2 border-slate-900 py-16 mb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="inline-block px-4 py-2 bg-primary text-white text-xs font-bold uppercase tracking-widest mb-4">
              Category
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
              {currentCategory?.name || "All Articles"}
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl">
              {currentCategory?.description || "Explore our latest stories, insights, and educational resources."}
            </p>
          </div>
        </header>

        {/* Main Content: Two-Column Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Articles */}
            <div className="lg:col-span-8">
              {articles && articles.length > 0 ? (
                <>
                  <div className="border-b-2 border-slate-900 pb-4 mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-wide">
                      {articles.length} {articles.length === 1 ? 'Article' : 'Articles'}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {articles.map((article) => (
                      <ArticleCard key={article.id} article={article} variant="standard" />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <p className="text-xl text-slate-600">No articles found in this category yet.</p>
                </div>
              )}
            </div>

            {/* Right Column: Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
              <MostPopular articles={popularArticles?.slice(0, 5) || []} />
              <NewsletterBox />

              {/* Categories List */}
              <div className="bg-white border border-slate-200 p-6">
                <div className="border-b-2 border-slate-900 pb-4 mb-6">
                  <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
                    {isAllArticles ? "Browse by Category" : "Other Categories"}
                  </h3>
                </div>
                <div className="space-y-3">
                  {!isAllArticles && (
                    <Link href="/category/all">
                      <div className="group flex items-center justify-between py-2 border-b border-slate-100 hover:border-primary transition-colors cursor-pointer">
                        <span className="text-sm font-semibold text-slate-700 group-hover:text-primary transition-colors uppercase tracking-wide">
                          All Articles
                        </span>
                        <span className="text-xs text-slate-400 group-hover:text-primary transition-colors">→</span>
                      </div>
                    </Link>
                  )}
                  {categories?.filter(c => c.slug !== slug).slice(0, 6).map((category) => (
                    <Link key={category.id} href={`/category/${category.slug}`}>
                      <div className="group flex items-center justify-between py-2 border-b border-slate-100 hover:border-primary transition-colors cursor-pointer">
                        <span className="text-sm font-semibold text-slate-700 group-hover:text-primary transition-colors uppercase tracking-wide">
                          {category.name}
                        </span>
                        <span className="text-xs text-slate-400 group-hover:text-primary transition-colors">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

