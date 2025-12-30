"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Loader2, Check, X, LogOut, Eye, Users, FileText, TrendingUp } from "lucide-react";
import { api } from "@shared/routes";

interface User {
  id: number;
  username: string;
  name: string;
  role: string;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  status: string;
  clicks: number;
  publishedAt: string;
  category: { name: string };
  author: { name: string };
  writerId?: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingArticles, setPendingArticles] = useState<Article[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/admin/analytics"],
    queryFn: async () => {
      const res = await fetch("/api/admin/analytics?days=30");
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch(api.auth.me.path);
      if (!response.ok) {
        router.push("/login");
        return;
      }

      const userData = await response.json();
      
      // Only allow admin to access this dashboard
      if (userData.role !== "admin") {
        if (userData.role === "writer") {
          // Redirect writers to their own dashboard
          router.push("/writer/dashboard");
        } else {
          router.push("/login");
        }
        return;
      }

      setUser(userData);
      await fetchArticles();
    } catch (error) {
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchArticles = async () => {
    try {
      // Fetch pending articles
      const pendingResponse = await fetch(`${api.articles.list.path}?status=pending`);
      const pendingData = await pendingResponse.json();
      setPendingArticles(pendingData);

      // Fetch all articles
      const allResponse = await fetch(api.articles.list.path);
      const allData = await allResponse.json();
      setAllArticles(allData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch articles",
        variant: "destructive",
      });
    }
  };

  const handleArticleStatus = async (articleId: number, status: "approved" | "rejected") => {
    try {
      const response = await fetch(`/api/articles/${articleId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message,
        });
        await fetchArticles();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update article status",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(api.auth.logout.path, { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  // Calculate writer stats
  const writerStats = allArticles.reduce((acc, article) => {
    if (article.writerId) {
      if (!acc[article.writerId]) {
        acc[article.writerId] = {
          writerId: article.writerId,
          totalArticles: 0,
          totalClicks: 0,
          approvedArticles: 0,
        };
      }
      acc[article.writerId].totalArticles++;
      acc[article.writerId].totalClicks += article.clicks;
      if (article.status === "approved") {
        acc[article.writerId].approvedArticles++;
      }
    }
    return acc;
  }, {} as Record<number, any>);

  const writerStatsArray = Object.values(writerStats).sort(
    (a: any, b: any) => b.totalClicks - a.totalClicks
  );

  const eventData = analytics
    ? Object.entries(analytics.eventBreakdown).map(([event, count]) => ({
        name: event,
        value: count as number,
      }))
    : [];

  const COLORS = ["#0066CC", "#00B8A9", "#1A3B52", "#FF6B6B", "#4ECDC4"];

  if (isLoading || analyticsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-900 dark:text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400">Welcome back, {user?.name}!</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="w-full sm:w-auto border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Sessions</CardTitle>
                <Users className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.totalSessions}</div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Events</CardTitle>
                <TrendingUp className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.totalEvents}</div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Articles</CardTitle>
                <FileText className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{pendingArticles.length}</div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Clicks</CardTitle>
                <Eye className="h-4 w-4 text-blue-600 dark:text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {allArticles.reduce((sum, a) => sum + a.clicks, 0)}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <TabsTrigger 
              value="pending"
              className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white"
            >
              Pending Approval ({pendingArticles.length})
            </TabsTrigger>
            <TabsTrigger 
              value="writers"
              className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white"
            >
              Writer Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white"
            >
              Overall Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Articles Pending Approval</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">Review and approve or reject articles submitted by writers</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingArticles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No pending articles
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingArticles.map((article) => (
                        <TableRow key={article.id}>
                          <TableCell className="font-medium">
                            <div>
                              <p className="font-medium">{article.title}</p>
                              <p className="text-sm text-muted-foreground">{article.excerpt.substring(0, 80)}...</p>
                            </div>
                          </TableCell>
                          <TableCell>{article.author.name}</TableCell>
                          <TableCell>{article.category.name}</TableCell>
                          <TableCell>{new Date(article.publishedAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleArticleStatus(article.id, "approved")}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleArticleStatus(article.id, "rejected")}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="writers">
            <div className="space-y-4">
              <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white">Writer Performance</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">See which writers are getting the most engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Writer ID</TableHead>
                        <TableHead>Total Articles</TableHead>
                        <TableHead>Approved</TableHead>
                        <TableHead>Total Clicks</TableHead>
                        <TableHead>Avg Clicks/Article</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {writerStatsArray.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">
                            No writer data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        writerStatsArray.map((stat: any) => (
                          <TableRow key={stat.writerId}>
                            <TableCell>Writer {stat.writerId}</TableCell>
                            <TableCell>{stat.totalArticles}</TableCell>
                            <TableCell>{stat.approvedArticles}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Eye className="mr-1 h-4 w-4" />
                                {stat.totalClicks}
                              </div>
                            </TableCell>
                            <TableCell>
                              {stat.totalArticles > 0
                                ? Math.round(stat.totalClicks / stat.totalArticles)
                                : 0}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white">Top Content by Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Clicks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allArticles
                        .sort((a, b) => b.clicks - a.clicks)
                        .slice(0, 10)
                        .map((article) => (
                          <TableRow key={article.id}>
                            <TableCell className="font-medium">{article.title}</TableCell>
                            <TableCell>{article.category.name}</TableCell>
                            <TableCell>{getStatusBadge(article.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Eye className="mr-1 h-4 w-4" />
                                {article.clicks}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            {analytics && (
              <div className="space-y-6">
                {/* Charts */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* Top Articles */}
                  <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-slate-900 dark:text-white">Top Articles by Views</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.topArticles}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="title" angle={-45} textAnchor="end" height={80} />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="views" fill="#0066CC" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Event Breakdown */}
                  <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-slate-900 dark:text-white">Event Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={eventData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {eventData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* User Behavior */}
                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white">User Behavior Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Average Scroll Depth</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.userBehavior.scrollDepthAvg}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Chat Sessions</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.chatEngagement.totalChats}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Chat Engagement Rate</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {analytics.totalSessions > 0
                            ? Math.round((analytics.chatEngagement.totalChats / analytics.totalSessions) * 100)
                            : 0}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
