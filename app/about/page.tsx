"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Lightbulb, Users, Zap, Globe } from "lucide-react";
import { setSEO, setStructuredData, getBaseUrl } from "@/lib/seo";
import Link from "next/link";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We embrace cutting-edge ideas and technologies to transform education"
  },
  {
    icon: Users,
    title: "Community",
    description: "We believe in building a supportive community of learners and educators"
  },
  {
    icon: Zap,
    title: "Excellence",
    description: "We are committed to delivering high-quality, insightful content"
  },
  {
    icon: Globe,
    title: "Accessibility",
    description: "We make quality education accessible to everyone, everywhere"
  }
];

export default function About() {
  useEffect(() => {
    const baseUrl = getBaseUrl();
    setSEO(
      "About Us",
      "Learn about Brainfeed Magazine - an educational technology platform inspiring the next generation with innovative content about STEM, technology, and careers.",
      undefined,
      `${baseUrl}/about`
    );

    setStructuredData({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Brainfeed Magazine",
      "description": "Educational technology platform for STEM learners",
      "url": baseUrl,
      "logo": `${baseUrl}/logo.png`,
      "foundingDate": "2025",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Support",
        "email": "hello@brainfeed.app"
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      
      <main className="pt-[90px] pb-24">
        <header className="relative bg-gradient-to-br from-background via-primary/5 to-secondary/10 dark:from-[#0B1026] dark:via-primary/10 dark:to-secondary/10 border-b-2 border-slate-200 dark:border-slate-800 py-20 mb-16">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/15 to-secondary/10 rounded-full blur-3xl" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-display font-black text-foreground mb-6">
              About Brainfeed Magazine
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Empowering the next generation of thinkers, creators, and innovators
            </p>
          </div>
        </header>

        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Mission */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Brainfeed Magazine is dedicated to inspiring and empowering students, educators, and lifelong learners through high-quality content about science, technology, careers, and innovation.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                We believe that access to engaging, well-researched content can transform educational experiences and open doors to unlimited possibilities.
              </p>
            </div>
            <Card className="p-8 bg-primary/5 dark:bg-primary/10 border-2 border-primary/20 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold shadow-md">✓</div>
                  <p className="text-foreground font-semibold">100% Free & Accessible</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-white text-2xl font-bold shadow-md">✓</div>
                  <p className="text-foreground font-semibold">AI-Powered Recommendations</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold shadow-md">✓</div>
                  <p className="text-foreground font-semibold">Quality Curated Content</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Values */}
          <div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-12 text-center">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, idx) => {
                const Icon = value.icon;
                return (
                  <Card key={idx} className="p-6 border-2 border-slate-200 dark:border-slate-800 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:border-primary/20">
                    <Icon className="w-12 h-12 text-secondary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400">{value.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Story */}
          <Card className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h2 className="text-3xl font-display font-bold text-foreground mb-6">Our Story</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Founded in 2025, Brainfeed Magazine was created with a simple mission: to make quality educational content about STEM, technology, and careers accessible to everyone, everywhere.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              We started with a belief that the future belongs to curious minds. By combining expert journalism, cutting-edge design, and AI-powered personalization, we're creating a platform where learning is engaging, accessible, and inspiring.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Today, we're proud to serve students, educators, and lifelong learners around the world. Our team is committed to staying at the forefront of educational technology and content quality.
            </p>
          </Card>

          {/* CTA with new gradient */}
          <Card className="p-8 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 border-2 border-primary/30 text-center shadow-lg">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">Join Our Community</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
              Be part of a growing community of learners and innovators. Subscribe to our newsletter for weekly updates on the latest in education and technology.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/chat">
                <button className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                  Try AI Assistant
                </button>
              </Link>
              <Link href="/contact">
                <button className="px-6 py-3 bg-gradient-to-r from-secondary to-accent text-white rounded-xl font-semibold hover:from-secondary/90 hover:to-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                  Get in Touch
                </button>
              </Link>
            </div>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
