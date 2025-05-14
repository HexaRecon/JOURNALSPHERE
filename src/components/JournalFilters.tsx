import React from 'react';
import { Category } from '../types/news';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface JournalFiltersProps {
  categories: Category[];
  selectedCategory: Category | 'all';
  setSelectedCategory: (category: Category | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'newest' | 'trending';
  setSortBy: (sort: 'newest' | 'trending') => void;
  onReset: () => void;
}

const JournalFilters: React.FC<JournalFiltersProps> = ({
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
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
      <div className="flex items-center gap-2 bg-white rounded-lg p-1 border shadow-sm flex-grow">
        <Search className="ml-2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search journal entries and articles..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="border-none shadow-none focus-visible:ring-0"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchQuery('')}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex gap-2 w-full md:w-auto">
        <Select
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value as Category | 'all')}
        >
          <SelectTrigger className="w-full md:w-[180px] bg-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-white">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Customize your journal feed with these filters
              </SheetDescription>
            </SheetHeader>
            <div className="py-4 space-y-6">
              <div className="space-y-2">
                <Label>Sort By</Label>
                <RadioGroup
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as 'newest' | 'trending')}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="newest" id="newest" />
                    <Label htmlFor="newest">Newest First</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="trending" id="trending" />
                    <Label htmlFor="trending">Trending</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <RadioGroup
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value as Category | 'all')}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">All Categories</Label>
                  </div>
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <RadioGroupItem value={category} id={category} />
                      <Label htmlFor={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Button onClick={onReset} variant="outline" className="w-full">
                Reset Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default JournalFilters;
