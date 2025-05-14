import { NewsArticle, Category } from '../types/news';
import { v4 as uuidv4 } from 'uuid';

// MediaStack API configuration
const MEDIASTACK_API_KEY = '365d6c5a17119a9d5247d4e9b7534803';
const MEDIASTACK_BASE_URL = 'https://api.mediastack.com/v1';

// Use a CORS proxy to avoid CORS issues
const USE_CORS_PROXY = true;
const CORS_PROXY = 'https://corsproxy.org/?';

// Category mapping from MediaStack to our app categories
const categoryMapping: Record<string, Category> = {
  general: 'world',
  business: 'business',
  entertainment: 'entertainment',
  health: 'health',
  science: 'science',
  sports: 'sports',
  technology: 'technology'
};

// Interface for MediaStack API response
interface MediaStackResponse {
  pagination: {
    limit: number;
    offset: number;
    count: number;
    total: number;
  };
  data: MediaStackArticle[];
}

// Interface for MediaStack article
interface MediaStackArticle {
  author: string | null;
  title: string;
  description: string;
  url: string;
  source: string;
  image: string | null;
  category: string;
  language: string;
  country: string;
  published_at: string;
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
 * Fetches news articles from MediaStack API
 * @param category - Optional category to filter by
 * @param limit - Number of articles to fetch (default: 10)
 * @returns Promise<NewsArticle[]> - Array of news articles
 */
export const fetchMediaStackArticles = async (
  category?: Category,
  limit: number = 10
): Promise<NewsArticle[]> => {
  try {
    // Build the API URL with parameters
    let url = `${MEDIASTACK_BASE_URL}/news?access_key=${MEDIASTACK_API_KEY}&languages=en&limit=${limit}`;

    // Add category filter if provided
    if (category && category !== 'journal') {
      url += `&categories=${category}`;
    }

    // Add sort parameter to get latest news
    url += '&sort=published_desc';

    // Add CORS proxy if needed
    if (USE_CORS_PROXY) {
      url = `${CORS_PROXY}${encodeURIComponent(url)}`;
    }

    console.log(`Fetching from: ${url}`);

    // Fetch data from MediaStack API with timeout
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
      throw new Error(`MediaStack API request failed with status ${response.status}`);
    }

    const data: MediaStackResponse = await response.json();

    // Transform MediaStack articles to our app format
    return data.data.map(article => transformMediaStackArticle(article));
  } catch (error) {
    console.error('Error fetching articles from MediaStack:', error);
    return [];
  }
};

/**
 * Transforms a MediaStack article to our app's NewsArticle format
 * @param article - MediaStack article
 * @returns NewsArticle - Transformed article
 */
const transformMediaStackArticle = (article: MediaStackArticle): NewsArticle => {
  // Map MediaStack category to our app category
  const category = categoryMapping[article.category] || 'world';

  // Generate a summary from the description
  const summary = article.description || 'No description available';

  // Use the article image if available, otherwise use a fallback image
  const imageUrl = article.image || categoryImages[category] || categoryImages.world;

  return {
    id: uuidv4(),
    title: article.title,
    source: article.source,
    author: article.author || article.source,
    publishedAt: article.published_at,
    summary: summary,
    content: `<h2>${article.title}</h2><p>${summary}</p><p>Read the full article at <a href="${article.url}" target="_blank">${article.source}</a></p>`,
    imageUrl: imageUrl,
    url: article.url,
    categories: [category],
    trending: Math.random() > 0.7, // 30% chance of being trending
  };
};

/**
 * Searches for articles in MediaStack API
 * @param query - Search query
 * @param limit - Number of articles to fetch (default: 10)
 * @returns Promise<NewsArticle[]> - Array of news articles
 */
export const searchMediaStackArticles = async (
  query: string,
  limit: number = 10
): Promise<NewsArticle[]> => {
  try {
    // Build the API URL with parameters
    let url = `${MEDIASTACK_BASE_URL}/news?access_key=${MEDIASTACK_API_KEY}&languages=en&limit=${limit}&keywords=${encodeURIComponent(query)}`;

    // Add CORS proxy if needed
    if (USE_CORS_PROXY) {
      url = `${CORS_PROXY}${encodeURIComponent(url)}`;
    }

    console.log(`Searching from: ${url}`);

    // Fetch data from MediaStack API with timeout
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
      throw new Error(`MediaStack API request failed with status ${response.status}`);
    }

    const data: MediaStackResponse = await response.json();

    // Transform MediaStack articles to our app format
    return data.data.map(article => transformMediaStackArticle(article));
  } catch (error) {
    console.error('Error searching articles from MediaStack:', error);
    return [];
  }
};
