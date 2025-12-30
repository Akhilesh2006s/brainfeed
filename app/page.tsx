"use client";

import { useArticles, useCategories } from "@/hooks/use-content";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { HeroSlider } from "@/components/HeroSlider";
import { MostPopular } from "@/components/MostPopular";
import { NewsletterBox } from "@/components/NewsletterBox";
import Link from "next/link";
import { useEffect } from "react";
import { setSEO, setStructuredData, getBaseUrl } from "@/lib/seo";

export default function Home() {
  const { data: featuredArticles, isLoading: featuredLoading } = useArticles({ featured: true });
  const { data: recentArticles, isLoading: recentLoading } = useArticles();
  const { data: categories } = useCategories();

  useEffect(() => {
    setSEO(
      "Home",
      "Discover AI breakthroughs, inspiring educators, and the future of learning. Join our community of curious minds exploring STEM, tech careers, and student success stories.",
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200"
    );

    const baseUrl = getBaseUrl();
    setStructuredData({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Brainfeed Magazine",
      "description": "Educational technology platform for STEM learners",
      "url": baseUrl,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${baseUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    });
  }, []);

  if (featuredLoading || recentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  const heroArticles = featuredArticles?.slice(0, 3) || [];
  const featuredMain = featuredArticles?.[0];
  const latestArticles = recentArticles?.slice(0, 10) || [];
  const popularArticles = recentArticles?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-[72px]">
        {/* Hero Slider Section */}
        {heroArticles.length > 0 && <HeroSlider articles={heroArticles} />}

        {/* Main Content: Two-Column Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Featured & Recent Articles */}
            <div className="lg:col-span-8 space-y-12">
              {/* Section Header */}
              <div className="border-b-2 border-slate-900 pb-4">
                <h2 className="text-3xl font-bold text-slate-900 uppercase tracking-wide">
                  Featured Stories
                </h2>
              </div>

              {/* Featured Article - Large Horizontal Card */}
              {featuredMain && (
                <div className="mb-12">
                  <ArticleCard article={featuredMain} variant="horizontal" />
                </div>
              )}

              {/* Latest Articles Grid */}
              <div>
                <div className="border-b-2 border-slate-900 pb-4 mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 uppercase tracking-wide">
                    Latest Articles
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {latestArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} variant="standard" />
                  ))}
                </div>
              </div>

              {/* Load More Button */}
              <div className="text-center pt-8">
                <Link href="/category/all">
                  <button className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wide transition-colors border-2 border-primary hover:border-primary/90">
                    View All Articles
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Most Popular */}
              <MostPopular articles={popularArticles} />

              {/* Newsletter Subscription */}
              <NewsletterBox />

              {/* Categories List */}
              <div className="bg-white border border-slate-200 p-6">
                <div className="border-b-2 border-slate-900 pb-4 mb-6">
                  <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
                    Categories
                  </h3>
                </div>
                <div className="space-y-3">
                  {categories?.slice(0, 8).map((category) => (
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

              {/* Social Follow */}
              <div className="bg-slate-50 border border-slate-200 p-6 text-center">
                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wide mb-4">
                  Follow Us
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                  Stay connected on social media for daily updates
                </p>
                <div className="flex justify-center gap-3">
                  <a href="#" className="w-10 h-10 flex items-center justify-center bg-slate-900 hover:bg-primary text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                  </a>
                  <a href="#" className="w-10 h-10 flex items-center justify-center bg-slate-900 hover:bg-primary text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                  </a>
                  <a href="#" className="w-10 h-10 flex items-center justify-center bg-slate-900 hover:bg-primary text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                  <a href="#" className="w-10 h-10 flex items-center justify-center bg-slate-900 hover:bg-primary text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
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

