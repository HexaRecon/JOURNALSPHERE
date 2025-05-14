import { NewsArticle, Category } from '../types/news';
import { v4 as uuidv4 } from 'uuid';

// Define the NewsApiSource enum directly in this file to avoid circular dependencies
export enum NewsApiSource {
  MEDIASTACK = 'mediastack',
  NEWSAPI = 'newsapi',
  GUARDIAN = 'guardian'
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

// MediaStack mock articles
const mediaStackArticles: NewsArticle[] = [
  {
    id: uuidv4(),
    title: "Tech Giants Announce New AI Collaboration",
    source: "TechCrunch",
    author: "Sarah Johnson",
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    summary: "Major tech companies have formed a new alliance to develop ethical AI standards and share research.",
    content: `<h2>Tech Giants Announce New AI Collaboration</h2>
    <p>In a surprising move, several major technology companies announced today that they will be collaborating on artificial intelligence research and development. The alliance aims to establish ethical standards and share non-proprietary research to advance the field responsibly.</p>
    <p>The collaboration includes companies that are typically fierce competitors, signaling the importance they place on responsible AI development. "This is about ensuring AI benefits humanity as a whole," said one CEO involved in the initiative.</p>
    <p>Industry analysts see this as a response to increasing regulatory scrutiny and public concern about the rapid advancement of AI technologies. The alliance will focus on areas such as bias mitigation, safety protocols, and transparency in AI systems.</p>`,
    imageUrl: categoryImages.technology,
    url: "https://example.com/tech-ai-collaboration",
    categories: ["technology"],
    trending: true,
    apiSource: NewsApiSource.MEDIASTACK
  },
  {
    id: uuidv4(),
    title: "Global Markets React to New Economic Data",
    source: "Financial Times",
    author: "Michael Chen",
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    summary: "Stock markets worldwide showed mixed reactions to the latest economic indicators released today.",
    content: `<h2>Global Markets React to New Economic Data</h2>
    <p>Financial markets around the world showed varied responses to new economic data released by major economies today. Asian markets closed higher, while European indices showed more caution.</p>
    <p>The data revealed stronger-than-expected growth in some regions, but persistent inflation concerns continue to weigh on investor sentiment. Central banks are now under increased pressure to balance growth stimulation with inflation control.</p>
    <p>Analysts suggest that this mixed picture could lead to divergent monetary policies across different regions in the coming months, potentially creating both challenges and opportunities for global investors.</p>`,
    imageUrl: categoryImages.business,
    url: "https://example.com/global-markets-react",
    categories: ["business"],
    trending: false,
    apiSource: NewsApiSource.MEDIASTACK
  },
  {
    id: uuidv4(),
    title: "New Study Reveals Benefits of Mediterranean Diet",
    source: "Health Daily",
    author: "Dr. Emily Rodriguez",
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    summary: "Research confirms that following a Mediterranean diet can significantly reduce the risk of several chronic diseases.",
    content: `<h2>New Study Reveals Benefits of Mediterranean Diet</h2>
    <p>A comprehensive new study published in a leading medical journal has provided further evidence of the health benefits associated with the Mediterranean diet. The research, which followed participants over a ten-year period, found significant reductions in the risk of heart disease, stroke, and certain types of cancer.</p>
    <p>The Mediterranean diet emphasizes olive oil, fresh fruits and vegetables, whole grains, and moderate consumption of fish, while limiting red meat and processed foods. Researchers noted that the combination of these elements, rather than any single component, appears to be responsible for the health benefits.</p>
    <p>"What's particularly encouraging about these findings is that they show even partial adherence to the Mediterranean diet pattern can yield health benefits," said the study's lead author.</p>`,
    imageUrl: categoryImages.health,
    url: "https://example.com/mediterranean-diet-benefits",
    categories: ["health"],
    trending: true,
    apiSource: NewsApiSource.MEDIASTACK
  }
];

// NewsAPI mock articles
const newsApiArticles: NewsArticle[] = [
  {
    id: uuidv4(),
    title: "Breakthrough in Renewable Energy Storage Announced",
    source: "Science Today",
    author: "Dr. Robert Chen",
    publishedAt: new Date(Date.now() - 5400000).toISOString(),
    summary: "Scientists have developed a new battery technology that could solve one of renewable energy's biggest challenges.",
    content: `<h2>Breakthrough in Renewable Energy Storage Announced</h2>
    <p>A team of researchers has announced a significant breakthrough in energy storage technology that could address one of the main challenges facing renewable energy adoption. The new battery design offers substantially higher capacity and longer lifespan than current technologies, while using more abundant and environmentally friendly materials.</p>
    <p>"This could be a game-changer for solar and wind power," said the lead researcher. "The ability to efficiently store energy during peak production times for use during low-production periods has been a significant hurdle for renewable energy."</p>
    <p>Industry experts suggest that if the technology can be successfully scaled up for commercial production, it could accelerate the transition away from fossil fuels by making renewable energy more reliable and cost-effective.</p>`,
    imageUrl: categoryImages.science,
    url: "https://example.com/renewable-energy-breakthrough",
    categories: ["science", "technology"],
    trending: true,
    apiSource: NewsApiSource.NEWSAPI
  },
  {
    id: uuidv4(),
    title: "Major Film Festival Announces This Year's Winners",
    source: "Entertainment Weekly",
    author: "Jessica Martinez",
    publishedAt: new Date(Date.now() - 9000000).toISOString(),
    summary: "The prestigious international film festival concluded with surprise winners in several categories.",
    content: `<h2>Major Film Festival Announces This Year's Winners</h2>
    <p>The closing ceremony of this year's prestigious international film festival featured several surprise winners, with an independent production taking the top prize over heavily favored studio contenders. The winning film, directed by a first-time filmmaker, was praised for its innovative storytelling and powerful performances.</p>
    <p>"This represents a victory for independent cinema and proves that compelling stories can come from anywhere," said the festival director during the awards presentation.</p>
    <p>Other notable winners included a documentary about climate activism and an animated feature from a studio known for pushing creative boundaries. Industry observers note that the festival's selections often predict future award season contenders and influence global film distribution.</p>`,
    imageUrl: categoryImages.entertainment,
    url: "https://example.com/film-festival-winners",
    categories: ["entertainment"],
    trending: false,
    apiSource: NewsApiSource.NEWSAPI
  },
  {
    id: uuidv4(),
    title: "Historic Sports Championship Ends in Dramatic Fashion",
    source: "Sports Network",
    author: "James Wilson",
    publishedAt: new Date(Date.now() - 12600000).toISOString(),
    summary: "The championship final went to overtime, resulting in an unexpected victory that will go down in sports history.",
    content: `<h2>Historic Sports Championship Ends in Dramatic Fashion</h2>
    <p>In what many are already calling one of the greatest championship finals in recent memory, the underdog team secured a dramatic victory in overtime, overcoming a significant deficit in the final minutes of regulation time.</p>
    <p>The winning point came from an unlikely hero - a player who had been sidelined with injuries for much of the season but delivered a career-defining performance when it mattered most. "We never stopped believing," said the team captain during the post-game celebration.</p>
    <p>The championship victory marks a remarkable turnaround for a team that had struggled in recent years and was not considered a serious contender at the start of the season. Sports analysts are now discussing whether this could be the beginning of a new dynasty in the sport.</p>`,
    imageUrl: categoryImages.sports,
    url: "https://example.com/championship-dramatic-ending",
    categories: ["sports"],
    trending: true,
    apiSource: NewsApiSource.NEWSAPI
  }
];

// Guardian mock articles
const guardianArticles: NewsArticle[] = [
  {
    id: uuidv4(),
    title: "International Diplomatic Summit Addresses Global Challenges",
    source: "The Guardian",
    author: "Jonathan Pierce",
    publishedAt: new Date(Date.now() - 4500000).toISOString(),
    summary: "World leaders gathered to discuss climate change, security concerns, and economic cooperation.",
    content: `<h2>International Diplomatic Summit Addresses Global Challenges</h2>
    <p>A major diplomatic summit concluded today with world leaders reaching tentative agreements on several pressing global issues. The three-day conference focused primarily on climate action, international security, and post-pandemic economic recovery.</p>
    <p>The most significant outcome was a renewed commitment to climate goals, with several major economies pledging more ambitious carbon reduction targets and increased funding for green technology in developing nations. "This represents a meaningful step forward in our collective response to the climate crisis," said the summit host.</p>
    <p>However, observers note that significant challenges remain in translating these diplomatic commitments into concrete policy actions, particularly as many countries continue to face domestic political pressures that complicate international cooperation.</p>`,
    imageUrl: categoryImages.world,
    url: "https://example.com/diplomatic-summit",
    categories: ["world", "politics"],
    trending: true,
    apiSource: NewsApiSource.GUARDIAN
  },
  {
    id: uuidv4(),
    title: "New Legislation Aims to Reform Healthcare System",
    source: "The Guardian",
    author: "Sophia Williams",
    publishedAt: new Date(Date.now() - 8100000).toISOString(),
    summary: "Lawmakers have introduced a comprehensive bill that would significantly change healthcare delivery and coverage.",
    content: `<h2>New Legislation Aims to Reform Healthcare System</h2>
    <p>A bipartisan group of lawmakers has introduced legislation that proposes substantial reforms to the national healthcare system. The bill addresses issues ranging from insurance coverage and prescription drug pricing to healthcare workforce development and rural healthcare access.</p>
    <p>Proponents argue that the reforms would expand access to affordable care while creating mechanisms to control rising healthcare costs. "This represents a pragmatic approach to addressing the shortcomings in our current system," said one of the bill's sponsors.</p>
    <p>However, the legislation faces a challenging path forward, with various stakeholders expressing concerns about specific provisions. Healthcare policy experts suggest that while the comprehensive approach is ambitious, it may need to be broken into smaller components to have a realistic chance of passage.</p>`,
    imageUrl: categoryImages.health,
    url: "https://example.com/healthcare-reform-legislation",
    categories: ["health", "politics"],
    trending: false,
    apiSource: NewsApiSource.GUARDIAN
  },
  {
    id: uuidv4(),
    title: "Archaeological Discovery Reveals Ancient Urban Planning",
    source: "The Guardian",
    author: "Dr. Amelia Thompson",
    publishedAt: new Date(Date.now() - 11700000).toISOString(),
    summary: "Excavation of an ancient city has uncovered sophisticated urban design that was ahead of its time.",
    content: `<h2>Archaeological Discovery Reveals Ancient Urban Planning</h2>
    <p>Archaeologists working at an excavation site have uncovered evidence of remarkably sophisticated urban planning in an ancient city dating back over 4,000 years. The discovery challenges previous assumptions about the development of urban centers in the region.</p>
    <p>The excavation revealed a grid-like street system, advanced water management infrastructure, and specialized districts for different activities - features that weren't thought to have been developed until much later in history. "This suggests a level of social organization and engineering knowledge that forces us to reconsider the timeline of urban development," said the lead archaeologist.</p>
    <p>The findings also indicate that the city maintained extensive trade networks with distant regions, based on artifacts made from materials not locally available. Researchers are now using advanced technologies to map the entire urban layout without further excavation.</p>`,
    imageUrl: categoryImages.science,
    url: "https://example.com/archaeological-discovery",
    categories: ["science"],
    trending: true,
    apiSource: NewsApiSource.GUARDIAN
  }
];

// Combined mock articles from all sources
export const getAllMockArticles = (): NewsArticle[] => {
  return [...mediaStackArticles, ...newsApiArticles, ...guardianArticles];
};

// Get mock articles by source
export const getMockArticlesBySource = (source: NewsApiSource): NewsArticle[] => {
  switch (source) {
    case NewsApiSource.MEDIASTACK:
      return [...mediaStackArticles];
    case NewsApiSource.NEWSAPI:
      return [...newsApiArticles];
    case NewsApiSource.GUARDIAN:
      return [...guardianArticles];
    default:
      return [];
  }
};

// Get mock articles by category
export const getMockArticlesByCategory = (category: Category): NewsArticle[] => {
  return getAllMockArticles().filter(article => article.categories.includes(category));
};

// Get trending mock articles
export const getTrendingMockArticles = (): NewsArticle[] => {
  return getAllMockArticles().filter(article => article.trending);
};

// Search mock articles
export const searchMockArticles = (query: string): NewsArticle[] => {
  const searchTerm = query.toLowerCase();
  return getAllMockArticles().filter(
    article =>
      article.title.toLowerCase().includes(searchTerm) ||
      article.summary.toLowerCase().includes(searchTerm) ||
      article.content.toLowerCase().includes(searchTerm)
  );
};

// Get mock article by ID
export const getMockArticleById = (id: string): NewsArticle | null => {
  return getAllMockArticles().find(article => article.id === id) || null;
};

// Get related mock articles
export const getRelatedMockArticles = (
  currentArticleId: string,
  category: Category,
  limit: number = 3
): NewsArticle[] => {
  const related = getAllMockArticles().filter(
    article => article.id !== currentArticleId && article.categories.includes(category)
  );

  // Shuffle and limit
  const shuffled = [...related].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
};
