"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import type { Article, Category, Author } from "@shared/schema";

interface ArticleWithRelations extends Article {
  category: Category;
  author: Author;
}

interface ArticleCardProps {
  article: ArticleWithRelations;
  variant?: "featured" | "standard" | "compact" | "horizontal";
  className?: string;
}

export function ArticleCard({ article, variant = "standard", className = "" }: ArticleCardProps) {
  // Magazine-style article cards with clean, flat design
  
  // Horizontal layout for featured articles in main content
  if (variant === "horizontal") {
    return (
      <Link href={`/article/${article.slug}`}>
        <article className={`group flex flex-col md:flex-row gap-6 bg-white border-b border-slate-200 pb-8 mb-8 cursor-pointer ${className}`}>
          {/* Image */}
          <div className="w-full md:w-2/5 aspect-[16/9] overflow-hidden bg-slate-100">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center space-y-3">
            {/* Category */}
            <span className="text-xs font-bold text-primary uppercase tracking-widest">
              {article.category.name}
            </span>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors">
              {article.title}
            </h2>

            {/* Excerpt */}
            <p className="text-slate-600 leading-relaxed line-clamp-2">
              {article.excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-semibold text-slate-900">
                  {article.author.name}
                </span>
              </div>
              <span className="text-sm text-slate-500">
                {format(new Date(article.publishedAt || new Date()), "MMM d, yyyy")}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-sm text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime} min
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={`/article/${article.slug}`}>
        <article className={`group relative overflow-hidden bg-white cursor-pointer h-full min-h-[500px] border border-slate-200 transition-all duration-300 ${className}`}>
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src={article.coverImage} 
              alt={article.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 p-8 md:p-10 z-10 flex flex-col justify-end">
            <div className="space-y-4">
              <span className="inline-block px-4 py-2 bg-primary text-white text-xs font-bold uppercase tracking-widest">
                {article.category.name}
              </span>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight group-hover:text-primary transition-colors">
                {article.title}
              </h2>
              
              <p className="text-white/90 line-clamp-2 text-lg leading-relaxed">
                {article.excerpt}
              </p>
            </div>
            
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/20">
              <img 
                src={article.author.avatar} 
                alt={article.author.name} 
                className="w-10 h-10 rounded-full"
              />
              <div className="flex flex-col">
                <span className="text-white text-sm font-semibold">{article.author.name}</span>
                <div className="flex items-center gap-2 text-white/80 text-xs">
                  <span>{format(new Date(article.publishedAt || new Date()), "MMM d, yyyy")}</span>
                  <span className="w-1 h-1 rounded-full bg-white/60" />
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {article.readTime} min
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/article/${article.slug}`}>
        <article className={`group flex gap-4 cursor-pointer items-start transition-all duration-300 ${className}`}>
          <div className="w-24 h-24 flex-shrink-0 overflow-hidden bg-slate-100">
            <img 
              src={article.coverImage} 
              alt={article.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <span className="inline-block text-xs font-bold text-primary uppercase tracking-wider">
              {article.category.name}
            </span>
            <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <span>{format(new Date(article.publishedAt || new Date()), "MMM d")}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readTime} min
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // Standard vertical card - Clean magazine style
  return (
    <Link href={`/article/${article.slug}`}>
      <article className={`group bg-white border border-slate-200 overflow-hidden cursor-pointer h-full flex flex-col hover:border-primary transition-all duration-300 ${className}`}>
        <div className="aspect-[16/9] overflow-hidden relative bg-slate-100">
          <img 
            src={article.coverImage} 
            alt={article.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        <div className="p-6 flex-1 flex flex-col space-y-3">
          {/* Category */}
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            {article.category.name}
          </span>

          {/* Title */}
          <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 flex-1">
            {article.excerpt}
          </p>
          
          {/* Meta */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
            <img 
              src={article.author.avatar} 
              alt={article.author.name} 
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex flex-col flex-1">
              <span className="text-xs font-semibold text-slate-900">{article.author.name}</span>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{format(new Date(article.publishedAt || new Date()), "MMM d")}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readTime} min
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
