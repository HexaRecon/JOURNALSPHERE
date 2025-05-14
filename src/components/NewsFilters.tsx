
import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Category } from '../types/news';
import { Filter, Search } from 'lucide-react';

interface NewsFiltersProps {
  categories: Category[];
  selectedCategory: Category | 'all';
  setSelectedCategory: (category: Category | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'newest' | 'trending';
  setSortBy: (sort: 'newest' | 'trending') => void;
  onReset: () => void;
}

const NewsFilters: React.FC<NewsFiltersProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  onReset,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 bg-white rounded-lg p-1 border shadow-sm flex-grow">
          <Search className="ml-2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search journal entries and articles..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="border-none shadow-none focus-visible:ring-0"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Label htmlFor="sort-by" className="whitespace-nowrap">Sort:</Label>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'newest' | 'trending')}>
            <SelectTrigger id="sort-by" className="w-[130px] bg-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={onReset} className="whitespace-nowrap">
            Reset Filters
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <Tabs
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value as Category | 'all')}
          className="w-full"
        >
          <div className="flex items-center mb-2">
            <Filter className="mr-2 h-5 w-5" />
            <h3 className="font-medium">Categories:</h3>
          </div>
          <TabsList className="bg-news-gray-light w-full flex flex-nowrap overflow-x-auto">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-news-blue-light data-[state=active]:text-white"
            >
              All
            </TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="data-[state=active]:bg-news-blue-light data-[state=active]:text-white"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default NewsFilters;
