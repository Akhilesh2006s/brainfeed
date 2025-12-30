"use client";

import { useArticle, useArticles } from "@/hooks/use-content";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { NewsletterBox } from "@/components/NewsletterBox";
import { useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Clock, Share2, Bookmark, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { setSEO, setCanonical, setStructuredData, getBaseUrl } from "@/lib/seo";

export default function ArticleDetail() {
  const params = useParams();
  const slug = params?.slug as string || "";
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      setScrollProgress(windowHeight > 0 ? (scrolled / windowHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const { data: article, isLoading } = useArticle(slug);

  useEffect(() => {
    if (article) {
      // Track article click
      fetch(`/api/articles/${article.id}/click`, {
        method: "POST",
      }).catch(err => console.error("Failed to track click:", err));

      const baseUrl = getBaseUrl();
      setSEO(
        article.title,
        article.excerpt,
        article.coverImage,
        `${baseUrl}/article/${article.slug}`
      );
      setCanonical(`${baseUrl}/article/${article.slug}`);

      setStructuredData({
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": article.title,
        "description": article.excerpt,
        "image": article.coverImage,
        "author": {
          "@type": "Person",
          "name": article.author.name,
          "image": article.author.avatar
        },
        "datePublished": article.publishedAt,
        "keywords": `${article.category.name}, education, learning`,
        "articleSection": article.category.name
      });
    }
  }, [article]);
  
  const { data: relatedArticles } = useArticles({ 
    category: article?.category.slug 
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
        <h1 className="text-2xl font-bold mb-4 text-slate-900">Article not found</h1>
        <Link href="/">
          <Button className="bg-primary hover:bg-primary/90">Return Home</Button>
        </Link>
      </div>
    );
  }

  // Filter out current article from related
  const filteredRelated = relatedArticles?.filter(a => a.id !== article.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />
      
      <Navbar />
      
      <main className="pt-[72px] pb-24">
        <article>
          {/* Breadcrumb / Back Link */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
            <Link href="/">
              <button className="inline-flex items-center gap-2 text-slate-600 hover:text-primary transition-colors font-semibold text-sm">
                <ArrowLeft className="w-4 h-4" /> 
                Back to Home
              </button>
            </Link>
          </div>

          {/* Article Header */}
          <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b-2 border-slate-900 mb-12">
            {/* Category Tag */}
            <span className="inline-block px-4 py-2 bg-primary text-white text-xs font-bold uppercase tracking-widest mb-6">
              {article.category.name}
            </span>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              {article.title}
            </h1>
            
            {/* Excerpt */}
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              {article.excerpt}
            </p>
            
            {/* Meta Info */}
            <div className="flex items-center justify-between flex-wrap gap-6">
              {/* Author */}
              <div className="flex items-center gap-4">
                <img 
                  src={article.author.avatar} 
                  alt={article.author.name} 
                  className="w-14 h-14 rounded-full"
                />
                <div>
                  <div className="font-bold text-slate-900">{article.author.name}</div>
                  <div className="text-sm text-slate-500">
                    {format(new Date(article.publishedAt || new Date()), "MMMM d, yyyy")}
                  </div>
                </div>
              </div>

              {/* Share & Read Time */}
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  {article.readTime} min read
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="border-slate-300 hover:border-primary hover:text-primary">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="border-slate-300 hover:border-primary hover:text-primary">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </header>
          
          {/* Featured Image */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <img 
              src={article.coverImage} 
              alt={article.title} 
              className="w-full max-h-[600px] object-cover"
            />
          </div>
          
          {/* Content & Sidebar Layout */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-8">
                <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900">
                  {/* Article content */}
                  <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br /><br />') }} />
                </div>
              </div>
              
              {/* Sidebar */}
              <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-24 h-fit">
                {/* Author Bio */}
                <div className="bg-slate-50 border border-slate-200 p-6">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 border-b-2 border-slate-900 pb-2 inline-block">
                    About Author
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={article.author.avatar} 
                      alt={article.author.name} 
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="font-bold text-slate-900">{article.author.name}</div>
                      <div className="text-xs text-slate-500">{article.author.role}</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {article.author.bio || `${article.author.name} is a leading voice in ${article.category.name}.`}
                  </p>
                </div>
                
                {/* Related Articles */}
                {filteredRelated && filteredRelated.length > 0 && (
                  <div className="bg-white border border-slate-200 p-6">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-6 border-b-2 border-slate-900 pb-2 inline-block">
                      Related Stories
                    </h3>
                    <div className="space-y-6">
                      {filteredRelated.map(item => (
                        <ArticleCard key={item.id} article={item} variant="compact" />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Newsletter */}
                <NewsletterBox />
                
              </aside>
            </div>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}

