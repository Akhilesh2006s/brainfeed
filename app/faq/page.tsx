"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { setSEO, setStructuredData, getBaseUrl } from "@/lib/seo";

const faqs = [
  {
    question: "What is Brainfeed Magazine?",
    answer: "Brainfeed Magazine is an educational technology platform dedicated to inspiring students, educators, and lifelong learners through high-quality content about STEM, technology, careers, and innovation. We combine expert journalism with AI-powered personalization to create engaging learning experiences."
  },
  {
    question: "Is Brainfeed Magazine free?",
    answer: "Yes! Brainfeed Magazine is 100% free and accessible to everyone. All our articles, resources, and AI assistant features are completely free. We believe quality education should be accessible to all."
  },
  {
    question: "How often are new articles published?",
    answer: "We publish new articles regularly throughout the week. Our editorial team is committed to bringing you fresh, relevant content about the latest in education, technology, and careers."
  },
  {
    question: "Can I use the AI Assistant?",
    answer: "Absolutely! Our AI Assistant is available to all users for free. You can chat with it to get personalized article recommendations, ask questions about STEM topics, and get insights about education and technology."
  },
  {
    question: "How does the AI Assistant work?",
    answer: "Our AI Assistant uses advanced language models to understand your questions and provide personalized article recommendations from our database. It learns from your conversations to give better recommendations over time."
  },
  {
    question: "Can I contribute articles?",
    answer: "We're always looking for talented writers and educators! If you'd like to contribute, please contact us at hello@brainfeed.app with your article idea or portfolio."
  },
  {
    question: "How do I contact support?",
    answer: "You can reach us in several ways: email us at hello@brainfeed.app, use the contact form on our Contact page, or chat with our AI Assistant. We typically respond within 24 hours."
  },
  {
    question: "What topics do you cover?",
    answer: "We cover a wide range of educational topics including: Science & STEM, Technology & AI, Careers & Skills, Student Stories, AI Insights, and Community. New categories and topics are added regularly."
  },
  {
    question: "Can I save articles or create a reading list?",
    answer: "You can chat with our AI Assistant to get personalized recommendations, and we're working on adding more personalization features. Subscribe to our newsletter to stay updated on new features."
  },
  {
    question: "Is my data private and secure?",
    answer: "Yes! We take your privacy seriously. All your data is protected according to industry standards. We never sell your personal information. Check our Privacy Policy for more details."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const baseUrl = getBaseUrl();
    setSEO(
      "Frequently Asked Questions",
      "Find answers to common questions about Brainfeed Magazine, our content, AI Assistant, and how to get the most out of our educational platform.",
      undefined,
      `${baseUrl}/faq`
    );

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    setStructuredData(faqSchema);
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      
      <main className="pt-[90px] pb-24">
        <header className="relative bg-gradient-to-br from-background via-primary/5 to-secondary/10 dark:from-[#0B1026] dark:via-primary/10 dark:to-secondary/10 border-b-2 border-slate-200 dark:border-slate-800 py-20 mb-16">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/15 to-secondary/10 rounded-full blur-3xl" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-display font-black text-foreground mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about Brainfeed Magazine
            </p>
          </div>
        </header>

        <section className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card 
                key={index} 
                className="overflow-hidden border-2 border-slate-200 dark:border-slate-800 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer hover:border-primary/20"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                data-testid={`card-faq-${index}`}
              >
                <button
                  className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  data-testid={`button-faq-${index}`}
                >
                  <h3 className="text-lg font-semibold text-foreground text-left">{faq.question}</h3>
                  <ChevronDown 
                    className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {openIndex === index && (
                  <div className="px-6 pb-6 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed" data-testid={`text-faq-answer-${index}`}>
                      {faq.answer}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Additional Help CTA with new palette */}
          <Card className="mt-12 p-8 bg-primary/5 dark:bg-primary/10 border-2 border-primary/20 text-center shadow-lg">
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">Didn't find what you're looking for?</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-xl mx-auto">
              Our team is here to help! Reach out through our contact form or chat with our AI Assistant for personalized assistance.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
                <a href="/contact">Contact Us</a>
              </Button>
              <Button className="px-6 py-2 bg-gradient-to-r from-secondary to-accent text-white hover:from-secondary/90 hover:to-accent/90 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
                <a href="/chat">Chat with AI</a>
              </Button>
            </div>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
