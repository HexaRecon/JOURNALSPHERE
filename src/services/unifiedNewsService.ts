import { NewsArticle, Category } from '../types/news';
import { fetchMediaStackArticles, searchMediaStackArticles } from './mediaStackApi';
import { fetchNewsApiArticles, searchNewsApiArticles } from './newsApiService';
import { fetchGuardianArticles, searchGuardianArticles } from './guardianApiService';

// API selection and fallback configuration
export enum NewsApiSource {
  MEDIASTACK = 'mediastack',
  NEWSAPI = 'newsapi',
  GUARDIAN = 'guardian'
}

// Default order of APIs to try
const API_PRIORITY: NewsApiSource[] = [
  NewsApiSource.MEDIASTACK,
  NewsApiSource.NEWSAPI,
  NewsApiSource.GUARDIAN
];

// Store the latest articles from each API source
const latestArticles: Record<NewsApiSource, NewsArticle[]> = {
  [NewsApiSource.MEDIASTACK]: [],
  [NewsApiSource.NEWSAPI]: [],
  [NewsApiSource.GUARDIAN]: []
};

/**
 * Fetches articles from multiple news APIs with fallback
 * @param category - Optional category to filter by
 * @param limit - Number of articles to fetch per API
 * @param apiPriority - Order of APIs to try (default: MEDIASTACK, NEWSAPI, GUARDIAN)
 * @returns Promise<NewsArticle[]> - Combined array of news articles
 */
export const fetchArticlesFromAllSources = async (
  category?: Category,
  limit: number = 10,
  apiPriority: NewsApiSource[] = API_PRIORITY
): Promise<NewsArticle[]> => {
  console.log(`Fetching articles from multiple sources for category: ${category || 'all'}`);
  
  // Try each API in order until we get results
  for (const apiSource of apiPriority) {
    try {
      let articles: NewsArticle[] = [];
      
      switch (apiSource) {
        case NewsApiSource.MEDIASTACK:
          console.log('Trying MediaStack API...');
          articles = await fetchMediaStackArticles(category, limit);
          break;
        case NewsApiSource.NEWSAPI:
          console.log('Trying NewsAPI.org...');
          articles = await fetchNewsApiArticles(category, limit);
          break;
        case NewsApiSource.GUARDIAN:
          console.log('Trying The Guardian API...');
          articles = await fetchGuardianArticles(category, limit);
          break;
      }
      
      if (articles.length > 0) {
        console.log(`Successfully fetched ${articles.length} articles from ${apiSource}`);
        
        // Store the latest articles from this source
        latestArticles[apiSource] = articles;
        
        return articles;
      }
    } catch (error) {
      console.error(`Error fetching from ${apiSource}:`, error);
      // Continue to the next API source
    }
  }
  
  console.warn('All API sources failed, returning empty array');
  return [];
};

/**
 * Searches for articles across multiple news APIs with fallback
 * @param query - Search query
 * @param limit - Number of articles to fetch per API
 * @param apiPriority - Order of APIs to try (default: MEDIASTACK, NEWSAPI, GUARDIAN)
 * @returns Promise<NewsArticle[]> - Combined array of news articles
 */
export const searchArticlesFromAllSources = async (
  query: string,
  limit: number = 10,
  apiPriority: NewsApiSource[] = API_PRIORITY
): Promise<NewsArticle[]> => {
  console.log(`Searching articles from multiple sources for query: ${query}`);
  
  // Try each API in order until we get results
  for (const apiSource of apiPriority) {
    try {
      let articles: NewsArticle[] = [];
      
      switch (apiSource) {
        case NewsApiSource.MEDIASTACK:
          console.log('Trying MediaStack API search...');
          articles = await searchMediaStackArticles(query, limit);
          break;
        case NewsApiSource.NEWSAPI:
          console.log('Trying NewsAPI.org search...');
          articles = await searchNewsApiArticles(query, limit);
          break;
        case NewsApiSource.GUARDIAN:
          console.log('Trying The Guardian API search...');
          articles = await searchGuardianArticles(query, limit);
          break;
      }
      
      if (articles.length > 0) {
        console.log(`Successfully found ${articles.length} articles from ${apiSource} for query: ${query}`);
        return articles;
      }
    } catch (error) {
      console.error(`Error searching from ${apiSource}:`, error);
      // Continue to the next API source
    }
  }
  
  console.warn('All API sources failed for search, returning empty array');
  return [];
};

/**
 * Fetches trending articles from all available sources
 * @param limit - Number of articles to fetch per API
 * @returns Promise<NewsArticle[]> - Array of trending articles
 */
export const fetchTrendingFromAllSources = async (limit: number = 5): Promise<NewsArticle[]> => {
  console.log('Fetching trending articles from all sources');
  
  // Collect all articles from all sources
  const allArticles: NewsArticle[] = [];
  
  // Try to get articles from each source
  for (const apiSource of API_PRIORITY) {
    try {
      let articles: NewsArticle[] = [];
      
      switch (apiSource) {
        case NewsApiSource.MEDIASTACK:
          articles = await fetchMediaStackArticles(undefined, limit * 2);
          break;
        case NewsApiSource.NEWSAPI:
          articles = await fetchNewsApiArticles(undefined, limit * 2);
          break;
        case NewsApiSource.GUARDIAN:
          articles = await fetchGuardianArticles(undefined, limit * 2);
          break;
      }
      
      // Add source identifier to each article
      articles.forEach(article => {
        article.apiSource = apiSource;
      });
      
      allArticles.push(...articles);
      
      // Store the latest articles from this source
      latestArticles[apiSource] = articles;
      
    } catch (error) {
      console.error(`Error fetching trending from ${apiSource}:`, error);
      // Continue to the next API source
    }
  }
  
  // Filter for trending articles
  const trendingArticles = allArticles.filter(article => article.trending);
  
  // If we don't have enough trending articles, add some non-trending ones
  if (trendingArticles.length < limit) {
    const nonTrending = allArticles.filter(article => !article.trending);
    const shuffled = [...nonTrending].sort(() => 0.5 - Math.random());
    trendingArticles.push(...shuffled.slice(0, limit - trendingArticles.length));
  }
  
  // Shuffle and limit
  const shuffled = [...trendingArticles].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
};

/**
 * Gets the latest cached articles from all sources
 * @returns Record<NewsApiSource, NewsArticle[]> - Latest articles by source
 */
export const getLatestArticlesBySource = (): Record<NewsApiSource, NewsArticle[]> => {
  return latestArticles;
};

/**
 * Gets all latest cached articles combined
 * @returns NewsArticle[] - All latest articles
 */
export const getAllLatestArticles = (): NewsArticle[] => {
  return Object.values(latestArticles).flat();
};
