import { NewsArticle } from '../types/news';
import { v4 as uuidv4 } from 'uuid';

// Theme-based journal images with descriptive topics
interface ThemeImage {
  theme: string;
  keywords: string[];
  imageUrl: string;
  description: string;
}

const THEMED_JOURNAL_IMAGES: ThemeImage[] = [
  {
    theme: 'mindfulness',
    keywords: ['mindful', 'present', 'awareness', 'meditation', 'breath', 'calm', 'peace'],
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop',
    description: 'Person meditating by a peaceful lake at sunrise'
  },
  {
    theme: 'gratitude',
    keywords: ['grateful', 'thankful', 'appreciation', 'blessing', 'gift', 'abundance'],
    imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1000&auto=format&fit=crop',
    description: 'Hands holding a small plant growing from soil, symbolizing gratitude and growth'
  },
  {
    theme: 'nature',
    keywords: ['natural', 'outdoors', 'environment', 'earth', 'forest', 'mountain', 'ocean', 'wilderness'],
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000&auto=format&fit=crop',
    description: 'Sunlight streaming through a lush green forest'
  },
  {
    theme: 'growth',
    keywords: ['develop', 'improve', 'progress', 'evolve', 'learn', 'journey', 'potential'],
    imageUrl: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?q=80&w=1000&auto=format&fit=crop',
    description: 'New plant sprouting from soil, representing personal growth'
  },
  {
    theme: 'reflection',
    keywords: ['reflect', 'contemplate', 'introspection', 'thought', 'consider', 'ponder', 'examine'],
    imageUrl: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=1000&auto=format&fit=crop',
    description: 'Person looking at reflection in calm water'
  },
  {
    theme: 'balance',
    keywords: ['equilibrium', 'harmony', 'stability', 'center', 'peace', 'moderation'],
    imageUrl: 'https://images.unsplash.com/photo-1519834089823-af2d966a42c4?q=80&w=1000&auto=format&fit=crop',
    description: 'Balanced stones stacked on a beach at sunset'
  },
  {
    theme: 'wisdom',
    keywords: ['knowledge', 'insight', 'understanding', 'sage', 'philosophy', 'enlightenment', 'truth'],
    imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1000&auto=format&fit=crop',
    description: 'Open book with light illuminating the pages'
  },
  {
    theme: 'creativity',
    keywords: ['create', 'imagine', 'inspire', 'art', 'innovation', 'expression', 'original'],
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop',
    description: 'Colorful art supplies and creative workspace'
  },
  {
    theme: 'courage',
    keywords: ['brave', 'strength', 'fearless', 'confidence', 'bold', 'daring', 'overcome'],
    imageUrl: 'https://images.unsplash.com/photo-1520116468816-95b69f847357?q=80&w=1000&auto=format&fit=crop',
    description: 'Person standing on mountain peak overlooking vast landscape'
  },
  {
    theme: 'connection',
    keywords: ['relationship', 'community', 'bond', 'together', 'unity', 'friendship', 'love'],
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000&auto=format&fit=crop',
    description: 'People holding hands in unity and support'
  },
  {
    theme: 'simplicity',
    keywords: ['minimal', 'essential', 'clarity', 'focus', 'uncomplicated', 'basic'],
    imageUrl: 'https://images.unsplash.com/photo-1473186505569-9c61870c11f9?q=80&w=1000&auto=format&fit=crop',
    description: 'Minimalist scene with simple objects and clean lines'
  },
  {
    theme: 'resilience',
    keywords: ['endure', 'overcome', 'persevere', 'adapt', 'recover', 'strength', 'determination'],
    imageUrl: 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?q=80&w=1000&auto=format&fit=crop',
    description: 'Plant growing through crack in concrete, symbolizing resilience'
  }
];

// Default fallback image if no matching theme is found
const DEFAULT_JOURNAL_IMAGE = 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=1000&auto=format&fit=crop';

// API endpoint for quotes that we'll use as journal entries
const QUOTES_API_URL = 'https://api.quotable.io/quotes/random?limit=5';

// Store the last fetched timestamp to track updates
let lastFetchTimestamp = 0;

// Event emitter for article updates
type ArticleUpdateListener = (articles: NewsArticle[]) => void;
const articleUpdateListeners: ArticleUpdateListener[] = [];

// Interface for the quote API response
interface QuoteResponse {
  _id: string;
  content: string;
  author: string;
  tags: string[];
  dateAdded: string;
}

/**
 * Fetches daily journal entries from the quotes API
 * Only fetches new entries once per day and caches them in localStorage
 * @returns Promise<NewsArticle[]> - Array of journal articles
 */
export const fetchDailyJournalEntries = async (): Promise<NewsArticle[]> => {
  try {
    // Check if we have cached entries for today
    const cachedData = localStorage.getItem('journalSphere_dailyEntries');
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    if (cachedData) {
      const { date, entries } = JSON.parse(cachedData);

      // If we have entries from today, return them
      if (date === currentDate && entries && entries.length > 0) {
        console.log('Using cached journal entries from today');
        return entries;
      }
    }

    // If no cached entries for today, fetch new ones
    console.log('Fetching fresh journal entries for today');
    const response = await fetch(QUOTES_API_URL);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const quotes: QuoteResponse[] = await response.json();

    // Transform quotes into journal articles
    const journalEntries = quotes.map((quote, index) => transformQuoteToJournalEntry(quote, index));

    // Cache the entries with today's date
    localStorage.setItem('journalSphere_dailyEntries', JSON.stringify({
      date: currentDate,
      entries: journalEntries
    }));

    return journalEntries;
  } catch (error) {
    console.error('Error fetching journal entries:', error);

    // If there's an error, try to use cached entries regardless of date
    const cachedData = localStorage.getItem('journalSphere_dailyEntries');
    if (cachedData) {
      const { entries } = JSON.parse(cachedData);
      if (entries && entries.length > 0) {
        console.log('Using cached journal entries due to fetch error');
        return entries;
      }
    }

    return [];
  }
};

/**
 * Finds the most relevant image for a quote based on its content
 * @param quoteContent - The content of the quote
 * @param tags - Tags associated with the quote
 * @returns string - URL of the most relevant image
 */
const findRelevantImage = (quoteContent: string, tags: string[]): { url: string, description: string } => {
  // Combine quote content and tags into a single string for analysis
  const combinedText = `${quoteContent} ${tags.join(' ')}`.toLowerCase();

  // Score each theme based on keyword matches
  const themeScores = THEMED_JOURNAL_IMAGES.map(theme => {
    // Count how many keywords from this theme appear in the combined text
    const matchCount = theme.keywords.filter(keyword =>
      combinedText.includes(keyword.toLowerCase())
    ).length;

    // Calculate a score based on matches and keyword count
    const score = matchCount / theme.keywords.length;

    return {
      theme,
      score
    };
  });

  // Sort themes by score (highest first)
  themeScores.sort((a, b) => b.score - a.score);

  // If we have a good match (score > 0), use that theme's image
  if (themeScores[0].score > 0) {
    return {
      url: themeScores[0].theme.imageUrl,
      description: themeScores[0].theme.description
    };
  }

  // If no good match, use a fallback based on tags if available
  if (tags.length > 0) {
    // Try to match the first tag to a theme
    const tagToMatch = tags[0].toLowerCase();
    const tagMatch = THEMED_JOURNAL_IMAGES.find(theme =>
      theme.theme.toLowerCase() === tagToMatch ||
      theme.keywords.some(k => k.toLowerCase() === tagToMatch)
    );

    if (tagMatch) {
      return {
        url: tagMatch.imageUrl,
        description: tagMatch.description
      };
    }
  }

  // If still no match, pick a random theme image
  const randomTheme = THEMED_JOURNAL_IMAGES[Math.floor(Math.random() * THEMED_JOURNAL_IMAGES.length)];
  return {
    url: randomTheme.imageUrl,
    description: randomTheme.description
  };
};

/**
 * Transforms a quote into a journal article format
 * @param quote - Quote response from API
 * @param index - Index of the quote in the array (for fallback)
 * @returns NewsArticle - Formatted journal article
 */
const transformQuoteToJournalEntry = (quote: QuoteResponse, index: number): NewsArticle => {
  // Generate a random date within the last week for the journal entry
  const publishedDate = new Date();
  publishedDate.setDate(publishedDate.getDate() - Math.floor(Math.random() * 7));

  // Create a longer content by repeating and expanding on the quote
  const expandedContent = generateExpandedContent(quote.content, quote.author);

  // Find the most relevant image based on quote content and tags
  const { url: imageUrl, description: imageDescription } = findRelevantImage(quote.content, quote.tags);

  // Create a more descriptive title based on the quote
  const titleWords = quote.content.split(' ');
  const shortTitle = titleWords.length > 8
    ? `${titleWords.slice(0, 8).join(' ')}...`
    : quote.content;

  // Determine a theme based on the content
  let theme = 'reflection';
  if (quote.tags && quote.tags.length > 0) {
    theme = quote.tags[0];
  }

  return {
    id: uuidv4(),
    title: `Daily ${theme.charAt(0).toUpperCase() + theme.slice(1)}: ${shortTitle}`,
    source: 'Daily Journal',
    author: quote.author,
    publishedAt: publishedDate.toISOString(),
    summary: quote.content,
    content: expandedContent,
    imageUrl: imageUrl,
    url: `https://example.com/journal/${quote._id}`,
    categories: ['journal'],
    trending: Math.random() > 0.7, // 30% chance of being trending
  };
};

/**
 * Generates expanded content for a journal entry based on a quote
 * @param quoteContent - The original quote content
 * @param author - The author of the quote
 * @returns string - Expanded journal content
 */
const generateExpandedContent = (quoteContent: string, author: string): string => {
  // Analyze the quote to determine its main theme
  const lowerQuote = quoteContent.toLowerCase();

  // Find the most relevant theme based on keywords
  let mainTheme = 'reflection';
  let themeDescription = 'reflecting on our thoughts and experiences';

  for (const theme of THEMED_JOURNAL_IMAGES) {
    // Check if any keywords from this theme appear in the quote
    const matchingKeywords = theme.keywords.filter(keyword =>
      lowerQuote.includes(keyword.toLowerCase())
    );

    if (matchingKeywords.length > 0) {
      mainTheme = theme.theme;
      themeDescription = theme.description;
      break;
    }
  }

  // Generate content based on the identified theme
  return `
Today's journal entry focuses on ${mainTheme} through a profound thought by ${author}: "${quoteContent}"

This quote speaks to the essence of ${mainTheme} and invites us to consider how ${themeDescription} relates to our daily experiences. When we embrace ${mainTheme}, we open ourselves to new perspectives and deeper understanding.

When I first encountered this idea from ${author}, it resonated with me because it highlights how ${mainTheme} can transform our approach to life's challenges and opportunities. The wisdom here isn't just about intellectual understanding, but about practical application in our everyday choices.

How we might apply this insight:

1. Consider how ${mainTheme} appears in your current circumstances
2. Reflect on a time when you experienced the truth of this quote firsthand
3. Identify one small action you can take today that aligns with this wisdom
4. Share this perspective with someone who might benefit from it

The journey of personal growth often involves these moments of clarity where timeless wisdom meets our present reality. As we continue to explore ideas like this one from ${author}, we develop a richer understanding of ourselves and our place in the world.
  `;
};

/**
 * Fetches a specific journal entry by ID
 * First checks the cache, then falls back to API if needed
 * @param id - The ID of the journal entry to fetch
 * @returns Promise<NewsArticle | null> - The journal article or null if not found
 */
export const fetchJournalEntryById = async (id: string): Promise<NewsArticle | null> => {
  try {
    // First check if we have cached entries
    const cachedData = localStorage.getItem('journalSphere_dailyEntries');

    if (cachedData) {
      const { entries } = JSON.parse(cachedData);
      if (entries && entries.length > 0) {
        // Look for the entry in the cached data
        const cachedEntry = entries.find((entry: NewsArticle) => entry.id === id);
        if (cachedEntry) {
          console.log('Found journal entry in cache');
          return cachedEntry;
        }
      }
    }

    // If not found in cache or no cache exists, fetch all entries and find the matching one
    console.log('Fetching journal entry from API');
    const allEntries = await fetchDailyJournalEntries();
    const entry = allEntries.find(entry => entry.id === id);

    return entry || null;
  } catch (error) {
    console.error('Error fetching journal entry by ID:', error);
    return null;
  }
};

/**
 * Subscribe to article updates
 * @param listener - Function to call when new articles are available
 * @returns Function to unsubscribe
 */
export const subscribeToArticleUpdates = (listener: ArticleUpdateListener): () => void => {
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

/**
 * Check for new articles from the API
 * This function compares the API response with cached entries to detect new content
 * @returns Promise<boolean> - True if new articles were found
 */
export const checkForNewArticles = async (): Promise<boolean> => {
  try {
    // To simulate a real API that would have a "getLatestArticles" endpoint,
    // we'll use the current timestamp to determine if we should consider this a new fetch
    const currentTimestamp = Date.now();

    // Only check for new articles if it's been at least 30 seconds since the last check
    // This prevents excessive API calls
    if (currentTimestamp - lastFetchTimestamp < 30000) {
      return false;
    }

    // Update the last fetch timestamp
    lastFetchTimestamp = currentTimestamp;

    // Get the cached entries
    const cachedData = localStorage.getItem('journalSphere_dailyEntries');
    let cachedEntries: NewsArticle[] = [];

    if (cachedData) {
      const { entries } = JSON.parse(cachedData);
      cachedEntries = entries || [];
    }

    // Fetch the latest entries from the API
    const response = await fetch(QUOTES_API_URL);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const quotes: QuoteResponse[] = await response.json();
    const latestEntries = quotes.map((quote, index) => transformQuoteToJournalEntry(quote, index));

    // In a real API, we would compare IDs or timestamps to detect new articles
    // For our demo, we'll compare the content of the first article to detect changes
    const hasNewContent = cachedEntries.length === 0 ||
      !cachedEntries.some(cached =>
        latestEntries.some(latest =>
          latest.summary === cached.summary && latest.author === cached.author
        )
      );

    if (hasNewContent) {
      console.log('New journal entries detected!');

      // Update the cache with the new entries
      const currentDate = new Date().toISOString().split('T')[0];
      localStorage.setItem('journalSphere_dailyEntries', JSON.stringify({
        date: currentDate,
        entries: latestEntries
      }));

      // Notify all listeners about the new articles
      notifyArticleUpdateListeners(latestEntries);

      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking for new articles:', error);
    return false;
  }
};
