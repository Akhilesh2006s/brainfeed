import type { Express } from "express";
import { storage } from "./storage";

export async function registerSitemapRoute(app: Express): Promise<void> {
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const articles = await storage.getArticles();
      const categories = await storage.getCategories();

      const baseUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://brainfeed-production-1fde.up.railway.app";
      const now = new Date().toISOString().split("T")[0];

      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

      // Home page
      xml += `
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

      // Article pages
      articles?.forEach((article) => {
        const pubDate = article.publishedAt
          ? new Date(article.publishedAt).toISOString().split("T")[0]
          : now;

        xml += `
  <url>
    <loc>${baseUrl}/article/${article.slug}</loc>
    <lastmod>${pubDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
      });

      // Category pages
      categories?.forEach((category) => {
        xml += `
  <url>
    <loc>${baseUrl}/category/${category.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      });

      // Other pages
      const otherPages = [
        { path: "/chat", priority: "0.6", changefreq: "weekly" },
        { path: "/search", priority: "0.5", changefreq: "weekly" },
      ];

      otherPages.forEach(({ path, priority, changefreq }) => {
        xml += `
  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
      });

      xml += `
</urlset>`;

      res.type("application/xml");
      res.send(xml);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });
}
