import { NewsArticle, Category } from '../types/news';
import { v4 as uuidv4 } from 'uuid';

// The Guardian API configuration
const GUARDIAN_API_KEY = 'test'; // Replace with your actual API key (or use 'test' for development)
const GUARDIAN_API_BASE_URL = 'https://content.guardianapis.com';

// Use a CORS proxy to avoid CORS issues
const USE_CORS_PROXY = true;
const CORS_PROXY = 'https://corsproxy.org/?';

// Category mapping from Guardian sections to our app categories
const categoryMapping: Record<string, Category> = {
  world: 'world',
  business: 'business',
  politics: 'politics',
  uk: 'world',
  us: 'world',
  australia: 'world',
  technology: 'technology',
  sport: 'sports',
  football: 'sports',
  science: 'science',
  environment: 'science',
  lifeandstyle: 'health',
  culture: 'entertainment',
  film: 'entertainment',
  music: 'entertainment'
};

// Interface for Guardian API response
interface GuardianApiResponse {
  response: {
    status: string;
    userTier: string;
    total: number;
    startIndex: number;
    pageSize: number;
    currentPage: number;
    pages: number;
    results: GuardianApiArticle[];
  };
}

// Interface for Guardian API article
interface GuardianApiArticle {
  id: string;
  type: string;
  sectionId: string;
  sectionName: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  fields?: {
    headline?: string;
    trailText?: string;
    byline?: string;
    thumbnail?: string;
    body?: string;
  };
  isHosted: boolean;
  pillarId: string;
  pillarName: string;
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
 * Fetches news articles from The Guardian API
 * @param category - Optional category to filter by
 * @param limit - Number of articles to fetch (default: 10)
 * @returns Promise<NewsArticle[]> - Array of news articles
 */
export const fetchGuardianArticles = async (
  category?: Category,
  limit: number = 10
): Promise<NewsArticle[]> => {
  try {
    // Build the API URL with parameters
    let url = `${GUARDIAN_API_BASE_URL}/search?api-key=${GUARDIAN_API_KEY}&page-size=${limit}&show-fields=headline,trailText,byline,thumbnail,body`;
    
    // Add section filter if category is provided
    if (category && category !== 'journal') {
      // Map our category to Guardian section
      let guardianSection = category;
      if (category === 'sports') guardianSection = 'sport';
      if (category === 'health') guardianSection = 'lifeandstyle';
      if (category === 'entertainment') guardianSection = 'culture';
      
      url += `&section=${guardianSection}`;
    }
    
    // Add CORS proxy if needed
    if (USE_CORS_PROXY) {
      url = `${CORS_PROXY}${encodeURIComponent(url)}`;
    }
    
    console.log(`Fetching from Guardian API: ${url}`);
    
    // Fetch data from Guardian API with timeout
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
      throw new Error(`Guardian API request failed with status ${response.status}`);
    }
    
    const data: GuardianApiResponse = await response.json();
    
    if (data.response.status !== 'ok') {
      throw new Error(`Guardian API returned status: ${data.response.status}`);
    }
    
    // Transform Guardian articles to our app format
    return data.response.results.map(article => transformGuardianArticle(article));
  } catch (error) {
    console.error('Error fetching articles from Guardian API:', error);
    return [];
  }
};

/**
 * Transforms a Guardian API article to our app's NewsArticle format
 * @param article - Guardian API article
 * @returns NewsArticle - Transformed article
 */
const transformGuardianArticle = (article: GuardianApiArticle): NewsArticle => {
  // Map Guardian section to our category
  const sectionId = article.sectionId.toLowerCase();
  const category: Category = categoryMapping[sectionId] || 'world';
  
  // Use the article thumbnail if available, otherwise use a fallback image
  const imageUrl = article.fields?.thumbnail || categoryImages[category] || categoryImages.world;
  
  return {
    id: uuidv4(),
    title: article.fields?.headline || article.webTitle,
    source: 'The Guardian',
    author: article.fields?.byline || 'The Guardian',
    publishedAt: article.webPublicationDate,
    summary: article.fields?.trailText || 'No description available',
    content: article.fields?.body || `<h2>${article.webTitle}</h2><p>${article.fields?.trailText || ''}</p><p>Read the full article at <a href="${article.webUrl}" target="_blank">The Guardian</a></p>`,
    imageUrl: imageUrl,
    url: article.webUrl,
    categories: [category],
    trending: Math.random() > 0.7, // 30% chance of being trending
  };
};

/**
 * Searches for articles in The Guardian API
 * @param query - Search query
 * @param limit - Number of articles to fetch (default: 10)
 * @returns Promise<NewsArticle[]> - Array of news articles
 */
export const searchGuardianArticles = async (
  query: string,
  limit: number = 10
): Promise<NewsArticle[]> => {
  try {
    // Build the API URL with parameters
    let url = `${GUARDIAN_API_BASE_URL}/search?api-key=${GUARDIAN_API_KEY}&page-size=${limit}&q=${encodeURIComponent(query)}&show-fields=headline,trailText,byline,thumbnail,body`;
    
    // Add CORS proxy if needed
    if (USE_CORS_PROXY) {
      url = `${CORS_PROXY}${encodeURIComponent(url)}`;
    }
    
    console.log(`Searching Guardian API for: ${query}`);
    
    // Fetch data from Guardian API with timeout
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
      throw new Error(`Guardian API search request failed with status ${response.status}`);
    }
    
    const data: GuardianApiResponse = await response.json();
    
    if (data.response.status !== 'ok') {
      throw new Error(`Guardian API returned status: ${data.response.status}`);
    }
    
    // Transform Guardian articles to our app format
    return data.response.results.map(article => transformGuardianArticle(article));
  } catch (error) {
    console.error('Error searching articles from Guardian API:', error);
    return [];
  }
};
