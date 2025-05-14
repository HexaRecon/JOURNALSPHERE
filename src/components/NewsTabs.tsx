
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { BookmarkIcon, Newspaper } from 'lucide-react';

interface NewsTabsProps {
  activeTab: 'feed' | 'bookmarks';
  setActiveTab: (tab: 'feed' | 'bookmarks') => void;
  bookmarkCount: number;
}

const NewsTabs: React.FC<NewsTabsProps> = ({ activeTab, setActiveTab, bookmarkCount }) => {
  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'feed' | 'bookmarks')}>
      <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
        <TabsTrigger value="feed" className="flex items-center gap-2">
          <Newspaper className="h-4 w-4" />
          <span>Journal Feed</span>
        </TabsTrigger>
        <TabsTrigger value="bookmarks" className="flex items-center gap-2">
          <BookmarkIcon className="h-4 w-4" />
          <span>Bookmarks</span>
          {bookmarkCount > 0 && (
            <span className="bg-news-blue-light text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {bookmarkCount}
            </span>
          )}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default NewsTabs;
