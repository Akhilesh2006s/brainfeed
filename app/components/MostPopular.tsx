"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";
import type { Article, Category, Author } from "@shared/schema";

interface ArticleWithRelations extends Article {
  category: Category;
  author: Author;
}

interface MostPopularProps {
  articles: ArticleWithRelations[];
}

export function MostPopular({ articles }: MostPopularProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-slate-900">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
          Most Popular
        </h3>
      </div>

      {/* Article List */}
      <div className="space-y-6">
        {articles.slice(0, 5).map((article, index) => (
          <div key={article.id} className="group">
            <Link href={`/article/${article.slug}`}>
              <div className="flex gap-4 cursor-pointer">
                {/* Number Badge */}
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-100 group-hover:bg-primary group-hover:text-white text-slate-900 font-bold text-lg transition-colors">
                  {index + 1}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-2">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="uppercase tracking-wider font-semibold">
                      {article.category.name}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span>{article.readTime} min</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Divider (except for last item) */}
            {index < articles.length - 1 && index < 4 && (
              <div className="mt-6 border-b border-slate-200" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

