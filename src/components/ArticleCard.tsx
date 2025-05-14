
import React from 'react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { BookmarkIcon, BookmarkCheckIcon } from 'lucide-react';
import { NewsArticle } from '../types/news';
import { useBookmarks } from '../contexts/BookmarkContext';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface ArticleCardProps {
  article: NewsArticle;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const bookmarked = isBookmarked(article.id);
  const navigate = useNavigate();

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking bookmark button
    if (bookmarked) {
      removeBookmark(article.id);
    } else {
      addBookmark(article);
    }
  };

  const handleCardClick = () => {
    navigate(`/article/${article.id}`);
  };

  const formattedDate = formatDistanceToNow(
    new Date(article.publishedAt),
    { addSuffix: true }
  );

  return (
    <Card
      className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={article.imageUrl}
          alt={article.title}
          title={article.categories.includes('journal') ? `Journal image related to ${article.title.split(':')[0].replace('Daily', '').trim().toLowerCase()}` : article.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
          onError={(e) => {
            // Fallback image if the original fails to load
            console.log('Image failed to load, using fallback');
            // Use a reliable fallback image from a CDN
            e.currentTarget.src = 'https://cdn.pixabay.com/photo/2016/03/26/22/21/books-1281581_1280.jpg';
            // Prevent infinite error loop if fallback also fails
            e.currentTarget.onerror = null;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-sm">
            {article.categories.includes('journal') && (
              <p className="line-clamp-2">{article.title.split(':')[0].replace('Daily', '').trim()} journal entry</p>
            )}
          </div>
        </div>
        {article.trending && (
          <Badge className="absolute top-2 right-2 bg-news-blue-light">
            Trending
          </Badge>
        )}
        {article.categories.includes('journal') && (
          <Badge className="absolute top-2 left-2 bg-purple-600">
            Journal
          </Badge>
        )}
        {article.apiSource && (
          <Badge className="absolute bottom-2 left-2 bg-gray-700">
            {article.apiSource}
          </Badge>
        )}
      </div>

      <CardContent className="flex-grow pt-4">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="bg-news-gray-light text-news-blue-dark">
            {article.source}
          </Badge>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>

        <h3 className="font-bold text-xl mb-2 line-clamp-2">{article.title}</h3>

        <p className="text-gray-600 mb-3 line-clamp-3">{article.summary}</p>

        <div className="flex flex-wrap gap-1 mt-auto">
          {article.categories.map((category) => (
            <Badge key={category} variant="secondary" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex justify-between items-center">
        <Button
          variant="link"
          className="text-news-blue-medium hover:text-news-blue-dark p-0"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/article/${article.id}`);
          }}
        >
          Read More
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleBookmarkToggle}
          className={bookmarked ? "text-news-blue-light hover:text-news-blue-medium" : "text-gray-500 hover:text-gray-700"}
        >
          {bookmarked ? <BookmarkCheckIcon size={20} /> : <BookmarkIcon size={20} />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
