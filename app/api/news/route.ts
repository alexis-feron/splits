import redis from "@/app/utils/redis";
import { NextResponse } from "next/server";

const CACHE_KEY = "f1_news";
const CACHE_DURATION = 30 * 60; // 30 minutes in seconds

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export interface NewsResponse {
  articles: NewsArticle[];
  cachedAt: number;
}

interface EventRegistryArticle {
  title?: string;
  body?: string;
  url?: string;
  image?: string;
  dateTimePub?: string;
  date?: string;
  source?: {
    title?: string;
  };
}

async function fetchNewsFromAPI(): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWSAPI_TOKEN;

  if (!apiKey) {
    throw new Error("NEWSAPI_TOKEN is not configured");
  }

  // Using Event Registry API
  const url = "https://eventregistry.org/api/v1/article/getArticles";

  const requestBody = {
    query: {
      $query: {
        $and: [
          {
            $or: [
              {
                keyword: "Formula 1",
                keywordLoc: "body",
              },
              {
                keyword: "F1",
                keywordLoc: "body",
              },
            ],
          },
          {
            $or: [
              { sourceUri: "formula1.com" },
              { sourceUri: "motorsport.com" },
              { sourceUri: "autosport.com" },
              { sourceUri: "planetf1.com" },
              { sourceUri: "racefans.net" },
              { sourceUri: "the-race.com" },
              { sourceUri: "gpblog.com" },
              { sourceUri: "gptoday.net" },
              { sourceUri: "speedcafe.com" },
            ],
          },
          {
            lang: "eng",
          },
        ],
      },
      $filter: {
        forceMaxDataTimeWindow: "31",
        dataType: ["news", "blog"],
      },
    },
    resultType: "articles",
    articlesSortBy: "date",
    articlesCount: 30,
    apiKey: apiKey,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Event Registry API error details:", errorData);
    throw new Error(
      `Event Registry API error: ${response.status} ${
        response.statusText
      } - ${JSON.stringify(errorData)}`
    );
  }

  const data = await response.json();

  // Transform Event Registry format to our format
  const articles = (data.articles?.results || []).map(
    (article: EventRegistryArticle) => ({
      title: article.title || "",
      description: article.body?.substring(0, 200) || "",
      url: article.url || "",
      urlToImage: article.image || "",
      publishedAt: article.dateTimePub || article.date || "",
      source: {
        name: article.source?.title || "Unknown",
      },
    })
  );

  console.log(`Retrieved ${articles.length} F1 articles from reliable sources`);

  return articles;
}

export async function GET() {
  try {
    // Try to get cached news from Redis
    const cached = await redis.get<NewsResponse>(CACHE_KEY);

    if (cached && cached.articles && cached.cachedAt) {
      const now = Date.now();
      const cacheAge = (now - cached.cachedAt) / 1000; // in seconds

      // If cache is still fresh (less than 30 minutes old)
      if (cacheAge < CACHE_DURATION) {
        return NextResponse.json({
          articles: cached.articles,
          cached: true,
          cacheAge: Math.floor(cacheAge),
        });
      }
    }

    // Cache is stale or doesn't exist, fetch new data
    const articles = await fetchNewsFromAPI();

    // Store in Redis with current timestamp
    const newsData: NewsResponse = {
      articles,
      cachedAt: Date.now(),
    };

    await redis.set(CACHE_KEY, newsData);

    return NextResponse.json({
      articles,
      cached: false,
      cacheAge: 0,
    });
  } catch (error) {
    console.error("Error fetching F1 news:", error);
    return NextResponse.json(
      { error: "Failed to fetch F1 news" },
      { status: 500 }
    );
  }
}
