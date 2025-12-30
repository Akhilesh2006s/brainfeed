import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const session = await getSession();

    const filters: any = {
      category: searchParams.get("category") || undefined,
      featured: searchParams.get("featured") === "true" ? true : searchParams.get("featured") === "false" ? false : undefined,
      search: searchParams.get("search") || undefined,
    };

    // If status filter is provided (admin/writer only)
    if (searchParams.get("status")) {
      filters.status = searchParams.get("status") as string;
    } else {
      // Public users only see approved articles
      if (!session) {
        filters.status = "approved";
      }
    }

    // If writerId filter is provided (for writer's own articles)
    if (searchParams.get("writerId")) {
      filters.writerId = parseInt(searchParams.get("writerId") as string);
    }

    const articles = await storage.getArticles(filters);
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Get articles error:", error);
    return NextResponse.json(
      { message: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

