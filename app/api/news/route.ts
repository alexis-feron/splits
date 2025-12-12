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

// Function to normalize strings for comparison
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "") // Remove punctuation
    .replace(/\s+/g, " "); // Normalize whitespace
}

// Function to calculate similarity between two strings (Jaccard similarity)
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = new Set(normalizeString(str1).split(" "));
  const words2 = new Set(normalizeString(str2).split(" "));

  const intersection = new Set([...words1].filter((x) => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}

// Function to remove duplicate articles
function removeDuplicates(articles: NewsArticle[]): NewsArticle[] {
  const uniqueArticles: NewsArticle[] = [];
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();

  for (const article of articles) {
    // Skip if exact URL already exists
    if (article.url && seenUrls.has(article.url)) {
      continue;
    }

    // Skip if exact title already exists
    const normalizedTitle = normalizeString(article.title);
    if (seenTitles.has(normalizedTitle)) {
      continue;
    }

    // Check for similar titles (>80% similarity)
    let isDuplicate = false;
    for (const existingArticle of uniqueArticles) {
      const similarity = calculateSimilarity(
        article.title,
        existingArticle.title
      );
      if (similarity > 0.8) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      uniqueArticles.push(article);
      if (article.url) seenUrls.add(article.url);
      seenTitles.add(normalizedTitle);
    }
  }

  return uniqueArticles;
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

  // Remove duplicates
  return removeDuplicates(articles);
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
