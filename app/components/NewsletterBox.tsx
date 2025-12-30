"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterBox() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSuccess(true);
    setEmail("");

    // Reset success message after 3 seconds
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
          Newsletter
        </h3>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
        Get the latest stories and insights delivered directly to your inbox every week.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full h-12 px-4 border-slate-300 focus:border-primary focus:ring-primary"
        />
        <Button
          type="submit"
          disabled={isSubmitting || isSuccess}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wide transition-colors"
        >
          {isSuccess ? "Subscribed!" : isSubmitting ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>

      {/* Footer Note */}
      <p className="text-xs text-slate-500 mt-4 text-center">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}

