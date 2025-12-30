"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@shared/routes";

export default function Login() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(api.auth.login.path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.user.name}!`,
        });

        // Redirect based on role
        if (data.user.role === "admin") {
          router.push("/admin/dashboard");
        } else if (data.user.role === "writer") {
          router.push("/writer/dashboard");
        }
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/10 dark:from-[#0B1026] dark:via-primary/10 dark:to-secondary/10 p-4 relative overflow-hidden">
      {/* Animated gradient orbs with new palette */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-secondary/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-secondary/15 to-accent/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <Card className="w-full max-w-md relative z-10 border-2 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-4 pb-6">
          {/* Logo with new gradient */}
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center text-white font-display font-black text-3xl shadow-xl shadow-primary/30">
              B
            </div>
          </div>
          <CardTitle className="text-3xl font-display font-black text-center text-foreground">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground text-base">
            Sign in to access your Brainfeed dashboard
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground font-semibold text-sm">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-foreground placeholder:text-muted-foreground rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-semibold text-sm">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-foreground placeholder:text-muted-foreground rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                required
              />
            </div>
            
            {/* Demo credentials card with new palette */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 p-4 rounded-2xl border-2 border-primary/20 dark:border-primary/30 shadow-sm">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  <p className="font-bold text-foreground text-sm">Demo Credentials</p>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">Admin:</span>
                    <code className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-primary font-bold border border-primary/20">
                      admin
                    </code>
                    <span>/</span>
                    <code className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-primary font-bold border border-primary/20">
                      password123
                    </code>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">Writer:</span>
                    <code className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-primary font-bold border border-primary/20">
                      writer1-4
                    </code>
                    <span>/</span>
                    <code className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-primary font-bold border border-primary/20">
                      password123
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account? <a href="#" className="text-primary font-bold hover:underline">Contact admin</a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

