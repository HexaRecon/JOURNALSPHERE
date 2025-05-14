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
    imageUrl: 'https://cdn.pixabay.com/photo/2015/06/19/21/24/avenue-815297_1280.jpg',
    description: 'Person meditating by a peaceful lake at sunrise'
  },
  {
    theme: 'gratitude',
    keywords: ['grateful', 'thankful', 'appreciation', 'blessing', 'gift', 'abundance'],
    imageUrl: 'https://cdn.pixabay.com/photo/2016/11/08/05/26/woman-1807533_1280.jpg',
    description: 'Hands holding a small plant growing from soil, symbolizing gratitude and growth'
  },
  {
    theme: 'nature',
    keywords: ['natural', 'outdoors', 'environment', 'earth', 'forest', 'mountain', 'ocean', 'wilderness'],
    imageUrl: 'https://cdn.pixabay.com/photo/2015/12/01/20/28/forest-1072828_1280.jpg',
    description: 'Sunlight streaming through a lush green forest'
  },
  {
    theme: 'growth',
    keywords: ['develop', 'improve', 'progress', 'evolve', 'learn', 'journey', 'potential'],
    imageUrl: 'https://cdn.pixabay.com/photo/2017/03/29/15/18/timelapse-2185605_1280.jpg',
    description: 'New plant sprouting from soil, representing personal growth'
  },
  {
    theme: 'reflection',
    keywords: ['reflect', 'contemplate', 'introspection', 'thought', 'consider', 'ponder', 'examine'],
    imageUrl: 'https://cdn.pixabay.com/photo/2016/11/14/04/36/boy-1822614_1280.jpg',
    description: 'Person looking at reflection in calm water'
  },
  {
    theme: 'balance',
    keywords: ['equilibrium', 'harmony', 'stability', 'center', 'peace', 'moderation'],
    imageUrl: 'https://cdn.pixabay.com/photo/2015/03/17/02/01/cubes-677092_1280.jpg',
    description: 'Balanced stones stacked on a beach at sunset'
  },
  {
    theme: 'wisdom',
    keywords: ['knowledge', 'insight', 'understanding', 'sage', 'philosophy', 'enlightenment', 'truth'],
    imageUrl: 'https://cdn.pixabay.com/photo/2015/11/06/11/45/book-1026890_1280.jpg',
    description: 'Open book with light illuminating the pages'
  },
  {
    theme: 'creativity',
    keywords: ['create', 'imagine', 'inspire', 'art', 'innovation', 'expression', 'original'],
    imageUrl: 'https://cdn.pixabay.com/photo/2016/01/19/17/57/paint-1149908_1280.jpg',
    description: 'Colorful art supplies and creative workspace'
  },
  {
    theme: 'courage',
    keywords: ['brave', 'strength', 'fearless', 'confidence', 'bold', 'daring', 'overcome'],
    imageUrl: 'https://cdn.pixabay.com/photo/2016/11/08/05/15/adventure-1807524_1280.jpg',
    description: 'Person standing on mountain peak overlooking vast landscape'
  },
  {
    theme: 'connection',
    keywords: ['relationship', 'community', 'bond', 'together', 'unity', 'friendship', 'love'],
    imageUrl: 'https://cdn.pixabay.com/photo/2017/10/25/16/54/african-2888640_1280.jpg',
    description: 'People holding hands in unity and support'
  },
  {
    theme: 'simplicity',
    keywords: ['minimal', 'essential', 'clarity', 'focus', 'uncomplicated', 'basic'],
    imageUrl: 'https://cdn.pixabay.com/photo/2015/07/09/22/45/tree-838667_1280.jpg',
    description: 'Minimalist scene with simple objects and clean lines'
  },
  {
    theme: 'resilience',
    keywords: ['endure', 'overcome', 'persevere', 'adapt', 'recover', 'strength', 'determination'],
    imageUrl: 'https://cdn.pixabay.com/photo/2017/04/23/19/30/tree-2254979_1280.jpg',
    description: 'Plant growing through crack in concrete, symbolizing resilience'
  }
];

// Default fallback image if no matching theme is found
const DEFAULT_JOURNAL_IMAGE = 'https://cdn.pixabay.com/photo/2016/03/26/22/21/books-1281581_1280.jpg';

// Since we're having issues with CORS proxies, we'll use our fallback system entirely
// and simulate API responses with a delay to mimic real API behavior
const USE_MOCK_API = true; // Set to true to use mock data instead of real API

// Store the last fetched timestamp to track updates
let lastFetchTimestamp = 0;

// Event emitter for article updates
type ArticleUpdateListener = (articles: NewsArticle[]) => void;
const articleUpdateListeners: ArticleUpdateListener[] = [];

/**
 * Generates fallback journal entries when the API fails
 * @returns NewsArticle[] - Array of fallback journal entries
 */
const generateFallbackJournalEntries = (): NewsArticle[] => {
  const fallbackEntries: NewsArticle[] = [
    {
      id: uuidv4(),
      title: 'Daily Resilience: Overcoming Challenges',
      source: 'Daily Journal',
      author: 'James Wilson',
      publishedAt: new Date().toISOString(),
      summary: 'Building resilience helps us navigate life\'s obstacles with grace and determination.',
      content: `
Today's journal entry focuses on resilience through a profound thought: "Resilience is not about never falling down, but about rising every time we fall."

This quote speaks to the essence of resilience and invites us to consider how our ability to recover from setbacks defines our character more than avoiding difficulties altogether. When we embrace resilience, we open ourselves to growth through challenges.

How we might apply this insight:

1. Consider how resilience appears in your current circumstances
2. Reflect on a time when you bounced back from a significant setback
3. Identify one small action you can take today to strengthen your resilience
4. Share this perspective with someone who might be facing difficulties

The journey of personal growth often involves these moments of clarity where timeless wisdom meets our present reality.
      `,
      imageUrl: 'https://cdn.pixabay.com/photo/2017/02/01/09/55/courage-2029281_1280.jpg',
      url: 'https://example.com/journal/resilience',
      categories: ['journal'],
      trending: true,
    },
    {
      id: uuidv4(),
      title: 'Daily Creativity: Embracing Innovation',
      source: 'Daily Journal',
      author: 'Sophia Chen',
      publishedAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
      summary: 'Creativity allows us to see new possibilities and solutions in everyday life.',
      content: `
Today's journal entry focuses on creativity through a profound thought: "Creativity is intelligence having fun."

This quote speaks to the essence of creativity and invites us to consider how creative thinking is not separate from analytical thinking but rather a playful expression of it. When we embrace creativity, we unlock new ways of solving problems.

How we might apply this insight:

1. Consider how creativity appears in your current circumstances
2. Reflect on a time when a creative approach led to an unexpected solution
3. Identify one small action you can take today to nurture your creative thinking
4. Share this perspective with someone who might benefit from thinking more creatively

The journey of personal growth often involves these moments of clarity where timeless wisdom meets our present reality.
      `,
      imageUrl: 'https://cdn.pixabay.com/photo/2016/11/30/12/16/question-mark-1872665_1280.jpg',
      url: 'https://example.com/journal/creativity',
      categories: ['journal'],
      trending: false,
    },
    {
      id: uuidv4(),
      title: 'Daily Patience: The Art of Waiting',
      source: 'Daily Journal',
      author: 'Marcus Johnson',
      publishedAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
      summary: 'Patience allows us to endure difficult times and appreciate the journey.',
      content: `
Today's journal entry focuses on patience through a profound thought: "Patience is not the ability to wait, but the ability to keep a good attitude while waiting."

This quote speaks to the essence of patience and invites us to consider how our mindset during periods of waiting is more important than the waiting itself. When we embrace patience, we find peace in the present moment.

How we might apply this insight:

1. Consider how patience appears in your current circumstances
2. Reflect on a time when patience led to a better outcome than rushing
3. Identify one small action you can take today to practice patience
4. Share this perspective with someone who might be in a period of waiting

The journey of personal growth often involves these moments of clarity where timeless wisdom meets our present reality.
      `,
      imageUrl: 'https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569_1280.jpg',
      url: 'https://example.com/journal/patience',
      categories: ['journal'],
      trending: false,
    }
  ];

  return fallbackEntries;
};

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

    // If no cached entries for today, generate new ones
    console.log('Fetching fresh journal entries for today');

    // If we're using mock API, simulate a network request with a delay
    if (USE_MOCK_API) {
      // Simulate network delay (between 500ms and 1500ms)
      const delay = Math.floor(Math.random() * 1000) + 500;
      await new Promise(resolve => setTimeout(resolve, delay));

      // Generate mock quotes
      const mockQuotes: QuoteResponse[] = [
        {
          _id: uuidv4(),
          content: "The only limit to our realization of tomorrow is our doubts of today.",
          author: "Franklin D. Roosevelt",
          tags: ["inspiration", "motivation"],
          dateAdded: new Date().toISOString()
        },
        {
          _id: uuidv4(),
          content: "The journey of a thousand miles begins with one step.",
          author: "Lao Tzu",
          tags: ["wisdom", "journey"],
          dateAdded: new Date().toISOString()
        },
        {
          _id: uuidv4(),
          content: "Happiness is not something ready-made. It comes from your own actions.",
          author: "Dalai Lama",
          tags: ["happiness", "mindfulness"],
          dateAdded: new Date().toISOString()
        },
        {
          _id: uuidv4(),
          content: "The best way to predict the future is to create it.",
          author: "Peter Drucker",
          tags: ["future", "creativity"],
          dateAdded: new Date().toISOString()
        },
        {
          _id: uuidv4(),
          content: "In the middle of difficulty lies opportunity.",
          author: "Albert Einstein",
          tags: ["opportunity", "resilience"],
          dateAdded: new Date().toISOString()
        }
      ];

      return mockQuotes.map((quote, index) => transformQuoteToJournalEntry(quote, index));
    }

    // This code will only run if USE_MOCK_API is false
    // We're keeping it for future reference, but it won't be used
    try {
      console.log('Note: Real API fetch is disabled. Using mock data instead.');
      throw new Error('API fetch disabled');
    } catch (error) {
      console.warn('Using mock data instead of real API');
      throw error;
    }

    // This code is unreachable when USE_MOCK_API is true
    // It's kept for reference only
    return [];
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

    // If no cached entries, return fallback entries
    console.log('Using fallback journal entries');
    return generateFallbackJournalEntries();
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

    // If we're using mock API, simulate a network request with a delay
    let latestEntries: NewsArticle[] = [];

    if (USE_MOCK_API) {
      // Simulate network delay (between 500ms and 1500ms)
      const delay = Math.floor(Math.random() * 1000) + 500;
      await new Promise(resolve => setTimeout(resolve, delay));

      // Generate mock quotes with slight variations to simulate new content
      const mockQuotes: QuoteResponse[] = [
        {
          _id: uuidv4(),
          content: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
          author: "Winston Churchill",
          tags: ["success", "courage"],
          dateAdded: new Date().toISOString()
        },
        {
          _id: uuidv4(),
          content: "Life is what happens when you're busy making other plans.",
          author: "John Lennon",
          tags: ["life", "planning"],
          dateAdded: new Date().toISOString()
        },
        {
          _id: uuidv4(),
          content: "The future belongs to those who believe in the beauty of their dreams.",
          author: "Eleanor Roosevelt",
          tags: ["future", "dreams"],
          dateAdded: new Date().toISOString()
        },
        {
          _id: uuidv4(),
          content: "The purpose of our lives is to be happy.",
          author: "Dalai Lama",
          tags: ["purpose", "happiness"],
          dateAdded: new Date().toISOString()
        },
        {
          _id: uuidv4(),
          content: "You only live once, but if you do it right, once is enough.",
          author: "Mae West",
          tags: ["life", "living"],
          dateAdded: new Date().toISOString()
        }
      ];

      latestEntries = mockQuotes.map((quote, index) => transformQuoteToJournalEntry(quote, index));
    } else {
      // This code will only run if USE_MOCK_API is false
      console.log('Note: Real API fetch is disabled. Using mock data instead.');
      throw new Error('API fetch disabled');
    }

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
