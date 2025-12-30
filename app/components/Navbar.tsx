"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, isAdmin, isWriter } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "All Articles", href: "/category/all" },
    { name: "Science & STEM", href: "/category/science-stem" },
    { name: "Tech & AI", href: "/category/tech-ai" },
    { name: "Careers", href: "/category/careers" },
    { name: "Stories", href: "/category/stories" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-white shadow-md border-b border-slate-200" 
        : "bg-white border-b border-slate-200"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-10 h-10 bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="font-bold text-2xl text-slate-900 tracking-tight group-hover:text-primary transition-colors">
                BRAINFEED
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <button className={`text-sm font-semibold uppercase tracking-wide transition-colors ${
                  pathname === link.href 
                    ? "text-primary border-b-2 border-primary pb-1" 
                    : "text-slate-600 hover:text-primary"
                }`}>
                  {link.name}
                </button>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center">
                <Input
                  autoFocus
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 h-10 border-slate-300 focus:border-primary"
                  data-testid="input-navbar-search"
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="ml-2 text-slate-600 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex items-center justify-center w-10 h-10 text-slate-600 hover:text-primary transition-colors"
                title="Search"
                data-testid="button-navbar-search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Auth Links */}
            {isAuthenticated ? (
              <div className="hidden lg:flex items-center gap-3">
                {isAdmin && (
                  <Link href="/admin/dashboard">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-slate-300 hover:border-primary hover:text-primary uppercase text-xs font-semibold tracking-wide"
                    >
                      Admin
                    </Button>
                  </Link>
                )}
                {isWriter && (
                  <Link href="/writer/dashboard">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-slate-300 hover:border-primary hover:text-primary uppercase text-xs font-semibold tracking-wide"
                    >
                      Writer
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <Link href="/login" className="hidden lg:block">
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white uppercase text-xs font-bold tracking-wide px-6"
                  data-testid="button-nav-login"
                >
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 text-slate-600 hover:text-slate-900"
              data-testid="button-navbar-menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-slate-300 focus:border-primary"
              />
            </form>

            {/* Mobile Nav Links */}
            <nav className="space-y-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`w-full text-left px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${
                      pathname === link.href 
                        ? "bg-primary text-white" 
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {link.name}
                  </button>
                </Link>
              ))}
            </nav>

            {/* Mobile Auth */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              {isAuthenticated ? (
                <div className="space-y-2">
                  {isAdmin && (
                    <Link href="/admin/dashboard">
                      <Button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        variant="outline" 
                        className="w-full border-slate-300 uppercase text-xs font-semibold"
                      >
                        Admin Dashboard
                      </Button>
                    </Link>
                  )}
                  {isWriter && (
                    <Link href="/writer/dashboard">
                      <Button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        variant="outline" 
                        className="w-full border-slate-300 uppercase text-xs font-semibold"
                      >
                        Writer Dashboard
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <Link href="/login">
                  <Button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full bg-primary hover:bg-primary/90 text-white uppercase text-xs font-bold"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
