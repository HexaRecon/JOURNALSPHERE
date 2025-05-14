import { NewsArticle, Category } from '../types/news';
import { getAllArticles, getArticlesByCategory, getTrendingArticles, searchArticles, getArticleById, getRelatedArticles } from '../data/mockNewsData';
import { fetchDailyJournalEntries, fetchJournalEntryById, subscribeToArticleUpdates, checkForNewArticles } from './journalApi';
import {
  fetchArticlesFromAllSources,
  searchArticlesFromAllSources,
  fetchTrendingFromAllSources,
  getAllLatestArticles,
  NewsApiSource
} from './unifiedNewsService';

// Flag to use real APIs instead of mock data
const USE_REAL_APIS = true;

// Store the latest articles for real-time updates
let latestArticles: NewsArticle[] = [];

// Event emitter for article updates
type ArticleUpdateListener = (articles: NewsArticle[]) => void;
const articleUpdateListeners: ArticleUpdateListener[] = [];

// Subscribe to journal API updates
subscribeToArticleUpdates((newJournalArticles) => {
  // Update our latest articles
  if (USE_REAL_APIS) {
    // Get the latest articles from all API sources
    const apiArticles = getAllLatestArticles();
    latestArticles = [...apiArticles, ...newJournalArticles];
  } else {
    latestArticles = [...getAllArticles(), ...newJournalArticles];
  }

  // Notify our listeners
  notifyArticleUpdateListeners(latestArticles);
});

/**
 * Subscribe to article updates from the news service
 * @param listener - Function to call when new articles are available
 * @returns Function to unsubscribe
 */
export const subscribeToNewsUpdates = (listener: ArticleUpdateListener): () => void => {
  articleUpdateListeners.push(listener);

  // Return unsubscribe function
  return () => {
    const index = articleUpdateListeners.indexOf(listener);
    if (index !== -1) {
      articleUpdateListeners.splice(index, 1);
    }
  };
};

/**
 * Notify all listeners about new articles
 * @param articles - The new articles to notify about
 */
const notifyArticleUpdateListeners = (articles: NewsArticle[]): void => {
  articleUpdateListeners.forEach(listener => listener(articles));
};

// Start polling for new articles
let pollingInterval: number | null = null;
let isCurrentlyChecking = false;

// Event for checking status
type CheckingStatusListener = (isChecking: boolean) => void;
const checkingStatusListeners: CheckingStatusListener[] = [];

/**
 * Subscribe to checking status updates
 * @param listener - Function to call when checking status changes
 * @returns Function to unsubscribe
 */
export const subscribeToCheckingStatus = (listener: CheckingStatusListener): () => void => {
  checkingStatusListeners.push(listener);

  // Return unsubscribe function
  return () => {
    const index = checkingStatusListeners.indexOf(listener);
    if (index !== -1) {
      checkingStatusListeners.splice(index, 1);
    }
  };
};

/**
 * Notify all listeners about checking status
 * @param isChecking - Whether we're currently checking for updates
 */
const notifyCheckingStatusListeners = (isChecking: boolean): void => {
  checkingStatusListeners.forEach(listener => listener(isChecking));
};

/**
 * Start polling for new articles
 * @param intervalMs - Polling interval in milliseconds (default: 60000 = 1 minute)
 */
export const startArticlePolling = (intervalMs: number = 60000): void => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }

  // Check immediately
  const checkAndNotify = async () => {
    if (isCurrentlyChecking) return;

    isCurrentlyChecking = true;
    notifyCheckingStatusListeners(true);

    try {
      await checkForNewArticles();
    } finally {
      isCurrentlyChecking = false;
      notifyCheckingStatusListeners(false);
    }
  };

  checkAndNotify();

  // Then set up interval
  pollingInterval = window.setInterval(checkAndNotify, intervalMs);
};

/**
 * Stop polling for new articles
 */
export const stopArticlePolling = (): void => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
};

/**
 * Fetches all articles including journal entries from API
 * @param forceRefresh - Whether to force a refresh from the API
 * @returns Promise<NewsArticle[]> - Combined array of articles
 */
export const fetchAllArticles = async (forceRefresh: boolean = false): Promise<NewsArticle[]> => {
  try {
    // If we have latest articles and don't need to force refresh, return them
    if (latestArticles.length > 0 && !forceRefresh) {
      return latestArticles;
    }

    // Get journal articles from API
    const journalArticles = await fetchDailyJournalEntries();

    if (USE_REAL_APIS) {
      // Get news articles from all API sources
      console.log('Fetching articles from all API sources');
      const apiArticles = await fetchArticlesFromAllSources(undefined, 20);

      // Update our latest articles cache
      latestArticles = [...apiArticles, ...journalArticles];
    } else {
      // Get mock articles
      const mockArticles = getAllArticles();

      // Update our latest articles cache
      latestArticles = [...mockArticles, ...journalArticles];
    }

    // Combine and return all articles
    return latestArticles;
  } catch (error) {
    console.error('Error fetching all articles:', error);

    // If we have latest articles, return them as fallback
    if (latestArticles.length > 0) {
      return latestArticles;
    }

    // Otherwise fallback to mock data if API fails
    return getAllArticles();
  }
};

/**
 * Fetches articles by category, including from API for journal category
 * @param category - The category to filter by
 * @returns Promise<NewsArticle[]> - Filtered articles
 */
export const fetchArticlesByCategory = async (category: Category): Promise<NewsArticle[]> => {
  try {
    if (category === 'journal') {
      // For journal category, fetch from API
      return await fetchDailyJournalEntries();
    } else if (USE_REAL_APIS) {
      // For other categories, use all API sources
      console.log(`Fetching ${category} articles from all API sources`);
      return await fetchArticlesFromAllSources(category, 20);
    } else {
      // Use mock data if not using real APIs
      return getArticlesByCategory(category);
    }
  } catch (error) {
    console.error(`Error fetching articles for category ${category}:`, error);
    // Fallback to mock data
    return getArticlesByCategory(category);
  }
};

/**
 * Fetches trending articles including from API
 * @returns Promise<NewsArticle[]> - Trending articles
 */
export const fetchTrendingArticles = async (): Promise<NewsArticle[]> => {
  try {
    // Get journal articles and filter for trending ones
    const journalArticles = await fetchDailyJournalEntries();
    const trendingJournalArticles = journalArticles.filter(article => article.trending);

    if (USE_REAL_APIS) {
      // Fetch trending articles from all API sources
      console.log('Fetching trending articles from all API sources');
      const trendingApiArticles = await fetchTrendingFromAllSources(5);

      // Combine and return
      return [...trendingApiArticles, ...trendingJournalArticles];
    } else {
      // Get mock trending articles
      const mockTrending = getTrendingArticles();

      // Combine and return
      return [...mockTrending, ...trendingJournalArticles];
    }
  } catch (error) {
    console.error('Error fetching trending articles:', error);
    // Fallback to mock data
    return getTrendingArticles();
  }
};

/**
 * Searches articles by query, including API journal entries
 * @param query - The search query
 * @returns Promise<NewsArticle[]> - Search results
 */
export const searchAllArticles = async (query: string): Promise<NewsArticle[]> => {
  try {
    // Get journal articles
    const journalArticles = await fetchDailyJournalEntries();

    // Filter journal articles by search query
    const searchTerm = query.toLowerCase();
    const journalResults = journalArticles.filter(
      article =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.summary.toLowerCase().includes(searchTerm)
    );

    if (USE_REAL_APIS) {
      // Search all API sources
      console.log(`Searching all API sources for: ${query}`);
      const apiResults = await searchArticlesFromAllSources(query, 10);

      // Combine and return
      return [...apiResults, ...journalResults];
    } else {
      // Get mock search results
      const mockResults = searchArticles(query);

      // Combine and return
      return [...mockResults, ...journalResults];
    }
  } catch (error) {
    console.error('Error searching articles:', error);
    // Fallback to mock data
    return searchArticles(query);
  }
};

/**
 * Fetches an article by ID, checking both mock data and API
 * @param id - The article ID
 * @returns Promise<NewsArticle | null> - The article or null if not found
 */
export const fetchArticleById = async (id: string): Promise<NewsArticle | null> => {
  try {
    // Check if the article is in our latest articles cache
    const cachedArticle = latestArticles.find(article => article.id === id);
    if (cachedArticle) {
      return cachedArticle;
    }

    // Check if it's a journal article
    const journalArticle = await fetchJournalEntryById(id);
    if (journalArticle) {
      return journalArticle;
    }

    if (!USE_REAL_APIS) {
      // If not using real APIs, check mock data
      const mockArticle = getArticleById(id);
      if (mockArticle) {
        return mockArticle;
      }
    }

    // If we couldn't find the article, return null
    return null;
  } catch (error) {
    console.error('Error fetching article by ID:', error);

    // Fallback to mock data only
    if (!USE_REAL_APIS) {
      const mockArticle = getArticleById(id);
      return mockArticle || null;
    }

    return null;
  }
};

/**
 * Fetches related articles based on the same category
 * @param currentArticleId - The current article ID
 * @param category - The category to find related articles for
 * @param limit - Maximum number of related articles to return
 * @returns Promise<NewsArticle[]> - Related articles
 */
export const fetchRelatedArticles = async (
  currentArticleId: string,
  category: Category,
  limit: number = 3
): Promise<NewsArticle[]> => {
  try {
    if (category === 'journal') {
      // For journal category, get related journal entries from API
      const allJournalEntries = await fetchDailyJournalEntries();
      const related = allJournalEntries.filter(article => article.id !== currentArticleId);

      // Shuffle and limit
      const shuffled = [...related].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, limit);
    } else if (USE_REAL_APIS) {
      // For other categories with real APIs

      // First check if we have enough articles in our cache
      if (latestArticles.length > limit + 1) {
        const relatedArticles = latestArticles.filter(
          article => article.id !== currentArticleId &&
                    article.categories.includes(category) &&
                    article.categories[0] !== 'journal'
        );

        if (relatedArticles.length >= limit) {
          // Shuffle and limit
          const shuffled = [...relatedArticles].sort(() => 0.5 - Math.random());
          return shuffled.slice(0, limit);
        }
      }

      // If we don't have enough in cache, fetch fresh articles for this category
      console.log(`Fetching related ${category} articles from all API sources`);
      const categoryArticles = await fetchArticlesFromAllSources(category, limit + 1);

      // Filter out the current article
      const related = categoryArticles.filter(article => article.id !== currentArticleId);

      // Shuffle and limit
      const shuffled = [...related].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, limit);
    } else {
      // For other categories with mock data
      return getRelatedArticles(currentArticleId, category, limit);
    }
  } catch (error) {
    console.error('Error fetching related articles:', error);
    // Fallback to mock data
    return getRelatedArticles(currentArticleId, category, limit);
  }
};
