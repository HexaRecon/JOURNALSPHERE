
import { NewsArticle, Category } from '../types/news';
import { v4 as uuidv4 } from 'uuid';

// Mock data for categories
const categories: Category[] = ['politics', 'technology', 'business', 'health', 'science', 'entertainment', 'sports', 'world', 'journal'];

// Function to generate real English paragraphs instead of Lorem Ipsum
const generateEnglishContent = (category: Category, sentences: number = 5): string => {
  const contentByCategory = {
    politics: "Political analysts are examining the implications of recent legislative changes. The debate continues in congress over budget allocations for next fiscal year. Polls indicate shifting voter sentiment on key policy issues. Local governments are implementing new strategies to address community concerns. International relations remain a focal point for diplomatic discussions.",
    technology: "Tech companies unveiled innovative solutions at the annual developer conference. Cloud computing continues to revolutionize how businesses operate globally. Artificial intelligence applications are expanding into new sectors including healthcare and transportation. Privacy concerns remain at the forefront of technology policy discussions. Open-source development communities are growing rapidly across major platforms.",
    business: "Market analysts predict steady growth for the upcoming quarter despite economic pressures. Small businesses are adapting to changing consumer behavior through digital transformation. Several major mergers were announced that could reshape key industry segments. Supply chain improvements have helped stabilize prices in retail sectors. Investment in sustainable business practices continues to increase among Fortune 500 companies.",
    health: "Medical researchers published promising results from clinical trials of new treatments. Public health officials released updated guidelines for preventative care. Healthcare providers are implementing telehealth solutions to improve patient access. Nutrition experts recommend balanced approaches to diet that focus on whole foods. Mental health awareness campaigns are making an impact in reducing stigma.",
    science: "Astronomers discovered a potentially habitable exoplanet using the latest observation technology. Climate scientists presented new models with improved prediction accuracy. Genetic research has identified promising targets for disease treatment. Conservation efforts have shown positive results in protecting endangered species. Advancements in quantum computing may lead to breakthroughs in complex problem solving.",
    entertainment: "Critics praised several independent films that premiered at international festivals. Streaming platforms announced plans for original content development. Musicians are exploring new distribution models in the digital economy. Theater productions are returning with innovative approaches to staging and audience engagement. Gaming industry revenues continue to grow with expansion into mobile platforms.",
    sports: "Athletes broke multiple records during the championship season. Teams are implementing advanced analytics to improve performance and strategy. International competitions brought together participants from over 100 countries. Youth sports programs are emphasizing inclusive approaches to player development. Stadium renovations focused on sustainability and improved spectator experience.",
    world: "International cooperation on climate initiatives reached new milestones at the summit. Humanitarian organizations are coordinating relief efforts in regions affected by natural disasters. Cultural exchange programs have resumed with strong participation across continents. Economic development projects are creating opportunities in emerging markets. Peace negotiations continue with involvement from multiple stakeholder nations.",
    journal: "Today I reflected on the importance of mindfulness in daily life. Taking time to appreciate small moments creates a greater sense of fulfillment and presence. Journaling has become an essential practice for processing thoughts and emotions. Setting intentions each morning helps maintain focus on personal growth goals. The practice of gratitude transforms how we perceive challenges and opportunities."
  };

  const paragraphs = contentByCategory[category].split('. ');
  const selectedContent = paragraphs.slice(0, sentences).join('. ');

  return selectedContent + (sentences > 3 ? "\n\nFurther analysis shows that these developments will have lasting impacts on the industry. Experts from around the world have weighed in with various perspectives on these changes. Many believe this represents a significant shift in how the sector will operate going forward. Others suggest a more measured approach to interpreting these trends. Time will tell which viewpoint proves more accurate, but the importance of these developments is undeniable." : "");
};

// Function to create a mock news article
const createMockArticle = (
  id: string,
  title: string,
  category: Category,
  trending: boolean = false
): NewsArticle => {
  const source = `Source ${Math.floor(Math.random() * 5) + 1}`;
  const author = `Author ${Math.floor(Math.random() * 10) + 1}`;
  const publishedAt = new Date(
    new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 30))
  ).toISOString();
  const summary = generateEnglishContent(category, 2);
  const content = generateEnglishContent(category, 10);
  // Map of static images by category for reliability using Pixabay CDN
  const categoryImages = {
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
  const imageUrl = categoryImages[category] || categoryImages.journal;
  const url = `https://example.com/news/${id}`;

  return {
    id,
    title,
    source,
    author,
    publishedAt,
    summary,
    content,
    imageUrl,
    url,
    categories: [category],
    trending,
  };
};

// Generate mock articles
const allArticles: NewsArticle[] = [
  createMockArticle(uuidv4(), 'Tech Giants Announce New AI Collaboration', 'technology', true),
  createMockArticle(uuidv4(), 'Political Tensions Rise Ahead of Elections', 'politics'),
  createMockArticle(uuidv4(), 'New Study Shows Benefits of Regular Exercise', 'health', true),
  createMockArticle(uuidv4(), 'Stock Market Reaches Record High', 'business'),
  createMockArticle(uuidv4(), 'Breakthrough in Cancer Research', 'science'),
  createMockArticle(uuidv4(), 'Blockbuster Movie Breaks Box Office Records', 'entertainment'),
  createMockArticle(uuidv4(), 'Local Team Wins National Championship', 'sports', true),
  createMockArticle(uuidv4(), 'International Peace Talks Underway', 'world'),
  createMockArticle(uuidv4(), 'New Gadget Revolutionizes Home Automation', 'technology'),
  createMockArticle(uuidv4(), 'Government Announces New Economic Stimulus Package', 'business'),
  createMockArticle(uuidv4(), 'Scientists Discover New Species in the Amazon', 'science'),
  createMockArticle(uuidv4(), 'Controversial Bill Sparks Debate in Congress', 'politics'),
  createMockArticle(uuidv4(), 'Global Health Crisis Averted', 'health'),
  createMockArticle(uuidv4(), 'Summer Movie Season Heats Up', 'entertainment'),
  createMockArticle(uuidv4(), 'Star Athlete Signs Record-Breaking Deal', 'sports'),
  createMockArticle(uuidv4(), 'Tensions Rise in the South China Sea', 'world'),
  createMockArticle(uuidv4(), 'Tech Startup Valued at $1 Billion', 'technology'),
  createMockArticle(uuidv4(), 'Economic Forecast Predicts Slow Growth', 'business'),
  createMockArticle(uuidv4(), 'New Evidence Suggests Life on Mars', 'science'),
  createMockArticle(uuidv4(), 'Political Scandal Rocks the Capital', 'politics'),
  createMockArticle(uuidv4(), 'New Diet Fad Sweeping the Nation', 'health'),
  createMockArticle(uuidv4(), 'Indie Film Wins Major Award', 'entertainment'),
  createMockArticle(uuidv4(), 'Record Attendance at Local Marathon', 'sports'),
  createMockArticle(uuidv4(), 'Diplomatic Relations Improve Between Nations', 'world'),
  createMockArticle(uuidv4(), 'AI Technology Transforming Industries', 'technology'),
  createMockArticle(uuidv4(), 'Interest Rates Expected to Rise', 'business'),
  createMockArticle(uuidv4(), 'New Study on Climate Change Released', 'science'),
  createMockArticle(uuidv4(), 'Election Results Spark Protests', 'politics'),
  createMockArticle(uuidv4(), 'New Vaccine Shows Promise', 'health'),
  createMockArticle(uuidv4(), 'Music Festival Draws Huge Crowds', 'entertainment'),
  createMockArticle(uuidv4(), 'Controversial Call Costs Team the Game', 'sports'),
  createMockArticle(uuidv4(), 'Global Leaders Meet to Discuss Trade', 'world'),
  createMockArticle(uuidv4(), 'Cybersecurity Threats on the Rise', 'technology'),
  createMockArticle(uuidv4(), 'Job Market Shows Signs of Recovery', 'business'),
  createMockArticle(uuidv4(), 'Scientists Map Human Brain in Unprecedented Detail', 'science'),
  createMockArticle(uuidv4(), 'Political Parties Clash Over Budget', 'politics'),
  createMockArticle(uuidv4(), 'New Treatment for Chronic Disease Developed', 'health'),
  createMockArticle(uuidv4(), 'Art Exhibition Features Emerging Artists', 'entertainment'),
  createMockArticle(uuidv4(), 'Athlete Breaks World Record', 'sports'),
  createMockArticle(uuidv4(), 'International Agreement Signed on Climate Action', 'world'),
  createMockArticle(uuidv4(), 'The Future of Work: AI and Automation', 'technology'),
  createMockArticle(uuidv4(), 'Investing in Renewable Energy', 'business'),
  createMockArticle(uuidv4(), 'The Ethics of Gene Editing', 'science'),
  createMockArticle(uuidv4(), 'The Impact of Social Media on Politics', 'politics'),
  createMockArticle(uuidv4(), 'The Latest Trends in Healthcare', 'health'),
  createMockArticle(uuidv4(), 'The Evolution of Music', 'entertainment'),
  createMockArticle(uuidv4(), 'The Business of Sports', 'sports'),
  createMockArticle(uuidv4(), 'The Geopolitics of Oil', 'world'),
  // Journal entries with content-specific images
  {
    id: uuidv4(),
    title: 'Daily Gratitude: The Power of Appreciation',
    source: 'Daily Journal',
    author: 'Sarah Johnson',
    publishedAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    summary: 'Practicing gratitude can transform our perspective and improve our mental wellbeing.',
    content: `
Today's journal entry focuses on gratitude through a profound thought by Sarah Johnson: "Gratitude turns what we have into enough, and more. It turns denial into acceptance, chaos into order, confusion into clarity."

This quote speaks to the essence of gratitude and invites us to consider how expressing thankfulness for what we have can completely transform our outlook on life. When we embrace gratitude, we open ourselves to new perspectives and deeper understanding of our blessings.

When I first encountered this idea from Sarah Johnson, it resonated with me because it highlights how gratitude can transform our approach to life's challenges and opportunities. The wisdom here isn't just about intellectual understanding, but about practical application in our everyday choices.

How we might apply this insight:

1. Consider how gratitude appears in your current circumstances, even during difficult times
2. Reflect on a time when expressing thanks changed your perspective on a situation
3. Identify one small action you can take today to show appreciation to someone in your life
4. Share this perspective with someone who might benefit from cultivating more gratitude

The journey of personal growth often involves these moments of clarity where timeless wisdom meets our present reality. As we continue to explore ideas like this one from Sarah Johnson, we develop a richer understanding of ourselves and our place in the world.
    `,
    imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1000&auto=format&fit=crop',
    url: 'https://example.com/journal/gratitude',
    categories: ['journal'],
    trending: true,
  },
  {
    id: uuidv4(),
    title: 'Daily Balance: Finding Harmony in Life',
    source: 'Daily Journal',
    author: 'Michael Chen',
    publishedAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    summary: 'Creating balance between work, relationships, and self-care is essential for wellbeing.',
    content: `
Today's journal entry focuses on balance through a profound thought by Michael Chen: "Balance is not something you find, it's something you create. It requires constant adjustment, like riding a bicycle."

This quote speaks to the essence of balance and invites us to consider how maintaining equilibrium in our lives requires active participation, not passive discovery. When we embrace balance, we open ourselves to new perspectives and deeper understanding of our priorities.

When I first encountered this idea from Michael Chen, it resonated with me because it highlights how balance can transform our approach to life's challenges and opportunities. The wisdom here isn't just about intellectual understanding, but about practical application in our everyday choices.

How we might apply this insight:

1. Consider how balance appears in your current circumstances - where might you need adjustment?
2. Reflect on a time when you experienced the truth of this quote firsthand
3. Identify one small action you can take today to create more balance in your life
4. Share this perspective with someone who might be struggling with overwhelm

The journey of personal growth often involves these moments of clarity where timeless wisdom meets our present reality. As we continue to explore ideas like this one from Michael Chen, we develop a richer understanding of ourselves and our place in the world.
    `,
    imageUrl: 'https://images.unsplash.com/photo-1519834089823-af2d966a42c4?q=80&w=1000&auto=format&fit=crop',
    url: 'https://example.com/journal/balance',
    categories: ['journal'],
    trending: false,
  },
  {
    id: uuidv4(),
    title: 'Daily Growth: Embracing Life\'s Lessons',
    source: 'Daily Journal',
    author: 'Elena Rodriguez',
    publishedAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    summary: 'Taking time to reflect on daily experiences helps us grow and learn from challenges.',
    content: `
Today's journal entry focuses on growth through a profound thought by Elena Rodriguez: "Every experience, especially the difficult ones, offers an opportunity for growth. The question is whether we're willing to see it."

This quote speaks to the essence of growth and invites us to consider how our challenges can become our greatest teachers if we approach them with the right mindset. When we embrace growth, we open ourselves to new perspectives and deeper understanding of our potential.

When I first encountered this idea from Elena Rodriguez, it resonated with me because it highlights how growth can transform our approach to life's challenges and opportunities. The wisdom here isn't just about intellectual understanding, but about practical application in our everyday choices.

How we might apply this insight:

1. Consider how growth appears in your current circumstances, especially in difficult situations
2. Reflect on a time when you experienced significant personal development through challenge
3. Identify one small action you can take today that pushes you outside your comfort zone
4. Share this perspective with someone who might be facing a growth opportunity disguised as a problem

The journey of personal growth often involves these moments of clarity where timeless wisdom meets our present reality. As we continue to explore ideas like this one from Elena Rodriguez, we develop a richer understanding of ourselves and our place in the world.
    `,
    imageUrl: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?q=80&w=1000&auto=format&fit=crop',
    url: 'https://example.com/journal/growth',
    categories: ['journal'],
    trending: false,
  },
  {
    id: uuidv4(),
    title: 'Daily Mindfulness: The Art of Being Present',
    source: 'Daily Journal',
    author: 'David Thompson',
    publishedAt: new Date().toISOString(),
    summary: 'Mindfulness helps us stay present and engaged with our experiences rather than being distracted.',
    content: `
Today's journal entry focuses on mindfulness through a profound thought by David Thompson: "The present moment is the only time over which we have dominion. The most important person is always the person you are with, and the most important moment is now."

This quote speaks to the essence of mindfulness and invites us to consider how being fully present in each moment enriches our experience of life. When we embrace mindfulness, we open ourselves to new perspectives and deeper understanding of the richness available in every moment.

When I first encountered this idea from David Thompson, it resonated with me because it highlights how mindfulness can transform our approach to life's challenges and opportunities. The wisdom here isn't just about intellectual understanding, but about practical application in our everyday choices.

How we might apply this insight:

1. Consider how mindfulness appears in your current circumstances - where are you fully present?
2. Reflect on a time when being completely present enhanced an experience significantly
3. Identify one small action you can take today to practice greater awareness in a routine activity
4. Share this perspective with someone who might benefit from slowing down and being more present

The journey of personal growth often involves these moments of clarity where timeless wisdom meets our present reality. As we continue to explore ideas like this one from David Thompson, we develop a richer understanding of ourselves and our place in the world.
    `,
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop',
    url: 'https://example.com/journal/mindfulness',
    categories: ['journal'],
    trending: true,
  }
];

// Function to fetch all articles
export const getAllArticles = (): NewsArticle[] => {
  return allArticles;
};

// Function to fetch articles by category
export const getArticlesByCategory = (category: Category): NewsArticle[] => {
  return allArticles.filter(article => article.categories.includes(category));
};

// Function to fetch trending articles
export const getTrendingArticles = (): NewsArticle[] => {
  return allArticles.filter(article => article.trending);
};

// Function to search articles by title or summary
export const searchArticles = (query: string): NewsArticle[] => {
  const searchTerm = query.toLowerCase();
  return allArticles.filter(
    article =>
      article.title.toLowerCase().includes(searchTerm) ||
      article.summary.toLowerCase().includes(searchTerm)
  );
};

// Function to get all categories
export const getCategories = (): Category[] => {
  return categories;
};

// Function to fetch an article by ID
export const getArticleById = (id: string): NewsArticle | undefined => {
  return allArticles.find(article => article.id === id);
};

// New function to get related articles based on the same category
export const getRelatedArticles = (currentArticleId: string, category: Category, limit: number = 3): NewsArticle[] => {
  // Get articles in the same category but exclude the current article
  const related = allArticles.filter(article =>
    article.id !== currentArticleId &&
    article.categories.includes(category)
  );

  // Shuffle array to get random related articles
  const shuffled = [...related].sort(() => 0.5 - Math.random());

  // Return limited number of articles
  return shuffled.slice(0, limit);
};
