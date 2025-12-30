"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { setSEO, getBaseUrl } from "@/lib/seo";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string | null;
}

export default function Chat() {
  useEffect(() => {
    const baseUrl = getBaseUrl();
    setSEO(
      "AI Article Assistant",
      "Chat with Brainfeed's AI assistant to get personalized article recommendations, insights, and answers about STEM, tech careers, and education.",
      undefined,
      `${baseUrl}/chat`
    );
  }, []);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random()}`);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch chat history
  const { data: history } = useQuery({
    queryKey: ["/api/chat", sessionId],
    queryFn: async () => {
      const res = await fetch(`/api/chat/${sessionId}`);
      if (!res.ok) return null;
      return res.json();
    },
    retry: false,
  });

  useEffect(() => {
    if (history?.messages) {
      setMessages(history.messages.reverse());
    }
  }, [history]);

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest("/api/chat", "POST", {
        sessionId,
        message,
      });
      return await res.json();
    },
    onSuccess: (data: any) => {
      setMessages((prev) => [
        ...prev,
        { id: data.messageId, role: "user", content: inputValue, createdAt: new Date().toISOString() },
        { id: 0, role: "assistant", content: data.response, createdAt: new Date().toISOString() },
      ]);
      setInputValue("");
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-background via-primary/5 to-secondary/10 dark:from-[#0B1026] dark:via-primary/10 dark:to-secondary/10">
      {/* Premium header with gradient and new palette */}
      <header className="border-b-2 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-lg shadow-secondary/25">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-black text-foreground">AI Article Assistant</h1>
              <p className="text-sm text-muted-foreground font-medium">Get personalized article recommendations and insights</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages area with custom scrollbar */}
      <ScrollArea className="flex-1 p-4 md:p-6 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <span className="text-5xl">💬</span>
              </div>
              <Card className="max-w-md p-8 text-center bg-card border-2 border-slate-200 dark:border-slate-800 shadow-xl">
                <h3 className="font-display font-bold text-xl text-foreground mb-3">Start a Conversation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Ask me anything about articles, get recommendations, or explore topics that interest you!
                </p>
              </Card>
              
              {/* Suggested questions */}
              <div className="flex flex-wrap gap-3 justify-center max-w-2xl">
                {["Latest AI articles", "STEM education trends", "Career advice"].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInputValue(suggestion)}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-primary/10 border-2 border-slate-200 dark:border-slate-700 hover:border-primary transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center flex-shrink-0 shadow-md shadow-secondary/20">
                  <span className="text-lg">🤖</span>
                </div>
              )}
              <Card 
                className={`max-w-md md:max-w-xl p-4 shadow-lg ${
                  msg.role === "user" 
                    ? "bg-gradient-to-br from-primary to-secondary text-white border-none shadow-primary/20" 
                    : "bg-card border-2 border-slate-200 dark:border-slate-800"
                }`}
              >
                <p className={`text-sm leading-relaxed ${msg.role === "user" ? "text-white" : "text-foreground"}`}>
                  {msg.content}
                </p>
              </Card>
              {msg.role === "user" && (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 shadow-md shadow-primary/20">
                  <span className="text-lg">👤</span>
                </div>
              )}
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Modern input area */}
      <div className="border-t-2 border-slate-200 dark:border-slate-800 p-4 md:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (inputValue.trim()) {
                sendMutation.mutate(inputValue);
              }
            }}
            className="flex gap-3"
          >
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about articles, topics, or recommendations..."
                disabled={sendMutation.isPending}
                className="h-14 pl-5 pr-5 text-base border-2 border-slate-300 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                data-testid="input-chat-message"
              />
            </div>
            <Button
              type="submit"
              disabled={sendMutation.isPending || !inputValue.trim()}
              size="icon"
              className="h-14 w-14 rounded-2xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
              data-testid="button-send-message"
            >
              {sendMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </form>
          
          <p className="text-xs text-muted-foreground text-center mt-3">
            AI responses are generated based on available articles and may not always be accurate.
          </p>
        </div>
      </div>
    </div>
  );
}
