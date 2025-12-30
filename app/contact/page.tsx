"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { setSEO, setStructuredData, getBaseUrl } from "@/lib/seo";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const baseUrl = getBaseUrl();
    setSEO(
      "Contact Us",
      "Get in touch with Brainfeed Magazine. Send us your questions, article ideas, partnership inquiries, or feedback.",
      undefined,
      `${baseUrl}/contact`
    );

    setStructuredData({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "mainEntity": {
        "@type": "Organization",
        "name": "Brainfeed Magazine",
        "url": baseUrl,
        "email": "hello@brainfeed.app",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "Customer Support",
          "email": "hello@brainfeed.app",
          "availableLanguage": ["en"]
        }
      }
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      
      <main className="pt-[90px] pb-24">
        <header className="relative bg-gradient-to-br from-background via-primary/5 to-secondary/10 dark:from-[#0B1026] dark:via-primary/10 dark:to-secondary/10 border-b-2 border-slate-200 dark:border-slate-800 py-20 mb-16">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/15 to-secondary/10 rounded-full blur-3xl" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-display font-black text-foreground mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </header>

        <section className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form with enhanced styling */}
            <Card className="p-8 border-2 border-slate-200 dark:border-slate-800 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                  <Input
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    data-testid="input-contact-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    data-testid="input-contact-email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                  <Input
                    placeholder="What is this about?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    data-testid="input-contact-subject"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                  <Textarea
                    placeholder="Your message..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    data-testid="textarea-contact-message"
                  />
                </div>
                <Button type="submit" className="w-full h-12 bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 font-semibold" data-testid="button-submit-contact">
                  Send Message
                </Button>
                {submitted && (
                  <p className="text-secondary text-center font-medium" data-testid="text-contact-success">
                    Thank you! We'll get back to you soon.
                  </p>
                )}
              </form>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <Card className="p-6 border-2 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Email</h3>
                    <p className="text-slate-600 dark:text-slate-400">hello@brainfeed.app</p>
                    <p className="text-sm text-muted-foreground mt-1">We respond within 24 hours</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-2 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Location</h3>
                    <p className="text-slate-600 dark:text-slate-400">Global</p>
                    <p className="text-sm text-muted-foreground mt-1">We operate worldwide</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-2 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Social Media</h3>
                    <p className="text-slate-600 dark:text-slate-400">@brainfeedmag</p>
                    <p className="text-sm text-muted-foreground mt-1">Follow us for updates</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-primary/5 dark:bg-primary/10 border-2 border-primary/20 shadow-md">
                <h3 className="font-semibold text-foreground mb-2">Quick Help</h3>
                <ul className="text-sm space-y-2 text-slate-600 dark:text-slate-400">
                  <li>• Article ideas? Email us!</li>
                  <li>• Partnership inquiries? Let's talk!</li>
                  <li>• Bug reports? Help us improve!</li>
                  <li>• Feedback? We'd love to hear it!</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
