import React, { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';
import { NewsArticle, Category } from '../types/news';
import { getCategories } from '../data/mockNewsData';
import {
  fetchAllArticles,
  fetchArticlesByCategory,
  fetchTrendingArticles,
  searchAllArticles,
  subscribeToNewsUpdates,
  startArticlePolling,
  stopArticlePolling,
  subscribeToCheckingStatus
} from '../services/newsService';
import JournalFilters from './JournalFilters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import BookmarkedArticles from './BookmarkedArticles';
import Logo from './Logo';
import { toast } from '../components/ui/sonner';

const JournalFeed: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'trending'>('newest');
  const [activeTab, setActiveTab] = useState<'feed' | 'bookmarks'>('feed');
  const [categories] = useState<Category[]>(getCategories());
  const [hasNewEntries, setHasNewEntries] = useState<boolean>(false);
  const [isCheckingForUpdates, setIsCheckingForUpdates] = useState<boolean>(false);

  // Load initial articles and set up real-time updates
  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true);
      try {
        // Check if we have entries from a previous day
        const cachedData = localStorage.getItem('journalSphere_dailyEntries');
        const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

        if (cachedData) {
          const { date } = JSON.parse(cachedData);
          // If the cached date is not today, we have new entries
          if (date !== currentDate) {
            setHasNewEntries(true);
          }
        }

        // Initial load of articles
        const allArticles = await fetchAllArticles();
        setArticles(allArticles);
      } catch (error) {
        console.error('Error loading articles:', error);
        toast.error('Failed to load articles. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    // Load initial articles
    loadArticles();

    // Subscribe to real-time updates
    const unsubscribeNews = subscribeToNewsUpdates((updatedArticles) => {
      console.log('Received real-time article update:', updatedArticles.length);
      setArticles(updatedArticles);
      setHasNewEntries(true);

      // Show a toast notification about new articles
      toast.success('New journal entries have been added!', {
        description: 'Fresh content is now available.',
        action: {
          label: 'View',
          onClick: () => {
            setHasNewEntries(false);
            setActiveTab('feed');
          }
        }
      });
    });

    // Subscribe to checking status updates
    const unsubscribeCheckingStatus = subscribeToCheckingStatus((isChecking) => {
      setIsCheckingForUpdates(isChecking);

      if (isChecking) {
        console.log('Checking for new journal entries...');
      } else {
        console.log('Finished checking for new journal entries');
      }
    });

    // Start polling for new articles every 30 seconds (for demo purposes)
    // In a production app, this would be more like 5-15 minutes
    startArticlePolling(30000);

    // Clean up on component unmount
    return () => {
      unsubscribeNews();
      unsubscribeCheckingStatus();
      stopArticlePolling();
    };
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    const applyFilters = async () => {
      setIsLoading(true);
      try {
        let result: NewsArticle[] = [];

        // First apply category filter
        if (selectedCategory === 'all') {
          result = [...articles];
        } else {
          result = await fetchArticlesByCategory(selectedCategory);
        }

        // Then apply search filter if there's a query
        if (searchQuery.trim()) {
          const searchResults = await searchAllArticles(searchQuery);
          result = result.filter(article =>
            searchResults.some(searchResult => searchResult.id === article.id)
          );
        }

        // Apply sorting
        if (sortBy === 'trending') {
          if (selectedCategory === 'all') {
            result = await fetchTrendingArticles();
          } else {
            result = result.filter(article => article.trending);
          }
        } else {
          // Default to newest sort
          result = result.sort((a, b) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
          );
        }

        setFilteredArticles(result);
      } catch (error) {
        console.error('Error applying filters:', error);
        toast.error('Failed to apply filters. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    applyFilters();
  }, [articles, selectedCategory, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('newest');
  };

  // Function to manually refresh journal entries
  const handleRefreshJournalEntries = async () => {
    setIsLoading(true);
    try {
      // Remove the cached entries to force a fresh fetch
      localStorage.removeItem('journalSphere_dailyEntries');

      // Force a refresh of articles
      const allArticles = await fetchAllArticles(true);
      setArticles(allArticles);

      // Clear the new entries indicator
      setHasNewEntries(false);

      // Show success message
      toast.success('Journal entries refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing journal entries:', error);
      toast.error('Failed to refresh journal entries. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderSkeletons = () => {
    return Array(6).fill(0).map((_, index) => (
      <div key={index} className="bg-gray-100 rounded-lg overflow-hidden h-[400px] animate-pulse">
        <div className="h-48 bg-gray-200"></div>
        <div className="p-4 space-y-4">
          <div className="flex justify-between">
            <div className="h-6 bg-gray-200 w-1/4 rounded"></div>
            <div className="h-4 bg-gray-200 w-1/5 rounded"></div>
          </div>
          <div className="h-8 bg-gray-200 w-3/4 rounded"></div>
          <div className="h-4 bg-gray-200 w-full rounded"></div>
          <div className="h-4 bg-gray-200 w-full rounded"></div>
          <div className="h-4 bg-gray-200 w-2/3 rounded"></div>
          <div className="flex gap-2 mt-2">
            <div className="h-6 bg-gray-200 w-20 rounded-full"></div>
            <div className="h-6 bg-gray-200 w-20 rounded-full"></div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <div className="mb-2">
              <Logo size="large" />
            </div>
            <p className="text-gray-600">Discover thoughtful journal entries and news across various categories</p>
          </div>
          <button
            onClick={handleRefreshJournalEntries}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            disabled={isLoading || isCheckingForUpdates}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${isCheckingForUpdates ? 'animate-spin' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            {isLoading ? 'Refreshing...' : isCheckingForUpdates ? 'Checking for updates...' : 'Refresh Entries'}
          </button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger
            value="feed"
            onClick={() => {
              setActiveTab('feed');
              // When clicking on the feed tab, clear the new entries indicator
              if (hasNewEntries) {
                setHasNewEntries(false);
              }
            }}
            className={activeTab === 'feed' ? 'bg-news-blue-light text-white' : ''}
          >
            <div className="relative">
              Journal Feed
              {hasNewEntries && (
                <span className="absolute -top-2 -right-2 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                </span>
              )}
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="bookmarks"
            onClick={() => setActiveTab('bookmarks')}
            className={activeTab === 'bookmarks' ? 'bg-news-blue-light text-white' : ''}
          >
            Bookmarks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          <JournalFilters
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onReset={handleResetFilters}
          />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderSkeletons()}
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium text-gray-700">No entries found</h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your search or filter to find more journal entries
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="bookmarks">
          <BookmarkedArticles />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JournalFeed;
