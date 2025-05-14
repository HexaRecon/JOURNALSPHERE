
import React, { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';
import { NewsArticle, Category } from '../types/news';
import { getCategories } from '../data/mockNewsData';
import { fetchAllArticles, fetchArticlesByCategory, fetchTrendingArticles, searchAllArticles } from '../services/newsService';
import NewsFilters from './NewsFilters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import BookmarkedArticles from './BookmarkedArticles';
import Logo from './Logo';
import { toast } from '../components/ui/sonner';

const NewsFeed: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'trending'>('newest');
  const [activeTab, setActiveTab] = useState<'feed' | 'bookmarks'>('feed');
  const [categories] = useState<Category[]>(getCategories());

  // Load initial articles
  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true);
      try {
        const allArticles = await fetchAllArticles();
        setArticles(allArticles);
      } catch (error) {
        console.error('Error loading articles:', error);
        toast.error('Failed to load articles. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
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
        <div className="mb-2">
          <Logo size="large" />
        </div>
        <p className="text-gray-600">Discover thoughtful journal entries and news across various categories</p>
      </div>

      <Tabs
        value={activeTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger
            value="feed"
            onClick={() => setActiveTab('feed')}
            className={activeTab === 'feed' ? 'bg-news-blue-light text-white' : ''}
          >
            Journal Feed
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
          <NewsFilters
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
              <h3 className="text-xl font-medium text-gray-700">No articles found</h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your search or filter to find more articles
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

export default NewsFeed;
