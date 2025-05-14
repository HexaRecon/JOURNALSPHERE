import { NewsArticle, Category } from '../types/news';
import { v4 as uuidv4 } from 'uuid';

// NewsAPI.org configuration
const NEWS_API_KEY = '4a2c1d9c0e8c4f8b9f6e3d2a1c0b8f6e'; // Replace with your actual API key
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

// Use a CORS proxy to avoid CORS issues
const USE_CORS_PROXY = true;
const CORS_PROXY = 'https://corsproxy.org/?';

// Category mapping from NewsAPI to our app categories
const categoryMapping: Record<string, Category> = {
  general: 'world',
  business: 'business',
  entertainment: 'entertainment',
  health: 'health',
  science: 'science',
  sports: 'sports',
  technology: 'technology'
};

// Interface for NewsAPI response
interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

// Interface for NewsAPI article
interface NewsApiArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

// Map of category to reliable fallback images
const categoryImages: Record<string, string> = {
  technology: 'https://cdn.pixabay.com/photo/2016/11/19/14/00/code-1839406_1280.jpg',
  politics: 'https://cdn.pixabay.com/photo/2017/08/30/07/56/money-2696228_1280.jpg',
  health: 'https://cdn.pixabay.com/photo/2014/12/10/21/01/doctor-563428_1280.jpg',
  business: 'https://cdn.pixabay.com/photo/2015/01/09/11/08/startup-594090_1280.jpg',
  science: 'https://cdn.pixabay.com/photo/2016/04/15/08/04/dna-1330614_1280.jpg',
  entertainment: 'https://cdn.pixabay.com/photo/2016/11/22/19/15/hand-1850120_1280.jpg',
  sports: 'https://cdn.pixabay.com/photo/2016/11/29/03/53/athletes-1867185_1280.jpg',
  world: 'https://cdn.pixabay.com/photo/2016/10/20/18/35/earth-1756274_1280.jpg',
  journal: 'https://cdn.pixabay.com/photo/2016/03/26/22/21/books-1281581_1280.jpg'
};

/**
 * Fetches news articles from NewsAPI.org
 * @param category - Optional category to filter by
 * @param limit - Number of articles to fetch (default: 10)
 * @returns Promise<NewsArticle[]> - Array of news articles
 */
export const fetchNewsApiArticles = async (
  category?: Category,
  limit: number = 10
): Promise<NewsArticle[]> => {
  try {
    // Map our category to NewsAPI category
    const newsApiCategory = category && category !== 'journal' ? category : 'general';
    
    // Build the API URL with parameters
    let url = `${NEWS_API_BASE_URL}/top-headlines?apiKey=${NEWS_API_KEY}&pageSize=${limit}&language=en`;
    
    // Add category filter if provided
    if (category && category !== 'journal') {
      url += `&category=${newsApiCategory}`;
    }
    
    // Add CORS proxy if needed
    if (USE_CORS_PROXY) {
      url = `${CORS_PROXY}${encodeURIComponent(url)}`;
    }
    
    console.log(`Fetching from NewsAPI: ${url}`);
    
    // Fetch data from NewsAPI with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`NewsAPI request failed with status ${response.status}`);
    }
    
    const data: NewsApiResponse = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error(`NewsAPI returned status: ${data.status}`);
    }
    
    // Transform NewsAPI articles to our app format
    return data.articles.map(article => transformNewsApiArticle(article));
  } catch (error) {
    console.error('Error fetching articles from NewsAPI:', error);
    return [];
  }
};

/**
 * Transforms a NewsAPI article to our app's NewsArticle format
 * @param article - NewsAPI article
 * @returns NewsArticle - Transformed article
 */
const transformNewsApiArticle = (article: NewsApiArticle): NewsArticle => {
  // Use the article image if available, otherwise use a fallback image
  const category = article.source.name?.toLowerCase().includes('sport') ? 'sports' : 'world';
  const imageUrl = article.urlToImage || categoryImages[category] || categoryImages.world;
  
  return {
    id: uuidv4(),
    title: article.title,
    source: article.source.name,
    author: article.author || article.source.name,
    publishedAt: article.publishedAt,
    summary: article.description || 'No description available',
    content: article.content || `<h2>${article.title}</h2><p>${article.description || ''}</p><p>Read the full article at <a href="${article.url}" target="_blank">${article.source.name}</a></p>`,
    imageUrl: imageUrl,
    url: article.url,
    categories: [category],
    trending: Math.random() > 0.7, // 30% chance of being trending
  };
};

/**
 * Searches for articles in NewsAPI
 * @param query - Search query
 * @param limit - Number of articles to fetch (default: 10)
 * @returns Promise<NewsArticle[]> - Array of news articles
 */
export const searchNewsApiArticles = async (
  query: string,
  limit: number = 10
): Promise<NewsArticle[]> => {
  try {
    // Build the API URL with parameters
    let url = `${NEWS_API_BASE_URL}/everything?apiKey=${NEWS_API_KEY}&pageSize=${limit}&language=en&q=${encodeURIComponent(query)}`;
    
    // Add CORS proxy if needed
    if (USE_CORS_PROXY) {
      url = `${CORS_PROXY}${encodeURIComponent(url)}`;
    }
    
    console.log(`Searching NewsAPI for: ${query}`);
    
    // Fetch data from NewsAPI with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`NewsAPI search request failed with status ${response.status}`);
    }
    
    const data: NewsApiResponse = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error(`NewsAPI returned status: ${data.status}`);
    }
    
    // Transform NewsAPI articles to our app format
    return data.articles.map(article => transformNewsApiArticle(article));
  } catch (error) {
    console.error('Error searching articles from NewsAPI:', error);
    return [];
  }
};
