"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/15 to-secondary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary/10 to-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="max-w-2xl text-center relative z-10">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-primary via-secondary to-accent animate-pulse">
            404
          </h1>
        </div>
        
        {/* Message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/">
            <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold px-8 py-6 text-lg rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl transition-all duration-300">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <Link href="/search">
            <Button variant="outline" className="px-8 py-6 text-lg rounded-xl border-2 hover:border-primary hover:text-primary transition-all duration-300">
              <Search className="w-5 h-5 mr-2" />
              Search Articles
            </Button>
          </Link>
        </div>
        
        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-muted-foreground mb-4">Or explore these pages:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/category/all" className="text-primary hover:underline font-semibold text-sm">
              All Articles
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/about" className="text-primary hover:underline font-semibold text-sm">
              About Us
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/faq" className="text-primary hover:underline font-semibold text-sm">
              FAQ
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/contact" className="text-primary hover:underline font-semibold text-sm">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

