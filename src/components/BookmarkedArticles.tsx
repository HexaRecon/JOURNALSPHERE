
import React from 'react';
import { useBookmarks } from '../contexts/BookmarkContext';
import ArticleCard from './ArticleCard';
import { BookmarkIcon } from 'lucide-react';

const BookmarkedArticles: React.FC = () => {
  const { bookmarks } = useBookmarks();

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
        <BookmarkIcon size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700">No Bookmarks Yet</h2>
        <p className="text-gray-500 mt-2 text-center max-w-md">
          Save interesting articles by clicking the bookmark icon to access them later
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-news-blue-dark">Your Bookmarked Articles</h2>
        <span className="bg-news-blue-light text-white px-3 py-1 rounded-full text-sm">
          {bookmarks.length} {bookmarks.length === 1 ? 'article' : 'articles'}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarks.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default BookmarkedArticles;
