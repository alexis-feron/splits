"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { NewsArticle } from "../api/news/route";

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cacheInfo, setCacheInfo] = useState<{
    cached: boolean;
    cacheAge: number;
  } | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        const response = await fetch("/api/news");

        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }

        const data = await response.json();
        setArticles(data.articles);
        setCacheInfo({
          cached: data.cached,
          cacheAge: data.cacheAge,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading news...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-8 sm:pb-8">
      <div className="flex justify-between items-center mb-6">
        {cacheInfo && (
          <div className="text-xs text-gray-500">
            {cacheInfo.cached
              ? `Updated ${Math.floor(cacheInfo.cacheAge / 60)} min ago`
              : "Fresh data"}
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <a
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {article.urlToImage && (
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <Image
                  src={article.urlToImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-red-600 uppercase">
                  {article.source.name}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(article.publishedAt)}
                </span>
              </div>
              <h2 className="text-lg font-bold mb-2 line-clamp-2 text-gray-900">
                {article.title}
              </h2>
              {article.description && (
                <p className="text-sm text-gray-600 line-clamp-3">
                  {article.description}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No news articles found.
        </div>
      )}
    </div>
  );
}
