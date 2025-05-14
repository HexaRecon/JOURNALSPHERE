
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { NewsArticle } from '../types/news';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ArrowLeft, BookmarkIcon, BookmarkCheckIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useBookmarks } from '../contexts/BookmarkContext';
import { useNavigate } from 'react-router-dom';
import { AspectRatio } from '../components/ui/aspect-ratio';
import { fetchArticleById, fetchRelatedArticles } from '../services/newsService';
import Logo from '../components/Logo';
import { toast } from '../components/ui/sonner';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const navigate = useNavigate();

  useEffect(() => {
    const loadArticle = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const fetchedArticle = await fetchArticleById(id);
          setArticle(fetchedArticle);

          // Get related articles if we have a valid article
          if (fetchedArticle) {
            const related = await fetchRelatedArticles(fetchedArticle.id, fetchedArticle.categories[0]);
            setRelatedArticles(related);
          }
        }
      } catch (error) {
        console.error('Error loading article:', error);
        toast.error('Failed to load article. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [id]);

  const handleBookmarkToggle = () => {
    if (!article) return;

    const bookmarked = isBookmarked(article.id);
    if (bookmarked) {
      removeBookmark(article.id);
    } else {
      addBookmark(article);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 w-3/4 mb-4 rounded"></div>
          <div className="h-4 bg-gray-200 w-1/4 mb-8 rounded"></div>
          <div className="h-64 bg-gray-200 w-full mb-8 rounded"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 w-full rounded"></div>
            <div className="h-4 bg-gray-200 w-full rounded"></div>
            <div className="h-4 bg-gray-200 w-5/6 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Article not found</h2>
        <Button onClick={() => navigate('/')}>Return to home</Button>
      </div>
    );
  }

  const bookmarked = isBookmarked(article.id);
  const formattedDate = formatDistanceToNow(
    new Date(article.publishedAt),
    { addSuffix: true }
  );

  // Format content to handle paragraphs properly
  const paragraphs = article.content.split('\n\n');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6 flex justify-between items-center">
          <Link to="/" className="flex items-center text-news-blue-medium hover:text-news-blue-dark">
            <ArrowLeft size={18} className="mr-2" />
            Back to Home
          </Link>
          <Logo size="small" />
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="relative h-[350px] md:h-[450px] overflow-hidden bg-gray-100">
            <img
              src={article.imageUrl}
              alt={article.title}
              title={article.categories.includes('journal') ? `Journal image related to ${article.title.split(':')[0].replace('Daily', '').trim().toLowerCase()}` : article.title}
              className="w-full h-full object-cover"
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
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              {article.trending && (
                <Badge className="bg-news-blue-light">
                  Trending
                </Badge>
              )}
              {article.categories.includes('journal') && (
                <Badge className="bg-purple-600">
                  Journal
                </Badge>
              )}
            </div>
            {article.categories.includes('journal') && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm md:text-base">
                  Image: {article.title.split(':')[0].replace('Daily', '').trim()} - Visual representation of {article.title.split(':')[1].trim()}
                </p>
              </div>
            )}
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
              <div>
                <Badge variant="outline" className="bg-news-gray-light text-news-blue-dark mb-3">
                  {article.source}
                </Badge>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">{article.title}</h1>
              </div>

              <div className="mt-4 md:mt-0 flex items-center">
                <span className="text-gray-500 mr-4">By {article.author} • {formattedDate}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBookmarkToggle}
                  className={bookmarked ? "text-news-blue-light hover:text-news-blue-medium" : "text-gray-500 hover:text-gray-700"}
                >
                  {bookmarked ? <BookmarkCheckIcon size={20} /> : <BookmarkIcon size={20} />}
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {article.categories.map((category) => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>

            <div className="prose max-w-none">
              <p className="text-lg font-medium mb-4">{article.summary}</p>
              <div className="mt-6 text-gray-700 leading-relaxed space-y-4">
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-news-blue-dark">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((relArticle) => (
                <div
                  key={relArticle.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/article/${relArticle.id}`)}
                >
                  <AspectRatio ratio={16 / 9} className="bg-gray-100">
                    <img
                      src={relArticle.imageUrl}
                      alt={relArticle.title}
                      title={relArticle.categories.includes('journal') ? `Journal image related to ${relArticle.title.split(':')[0].replace('Daily', '').trim().toLowerCase()}` : relArticle.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback image if the original fails to load
                        console.log('Related image failed to load, using fallback');
                        // Use a reliable fallback image from a CDN
                        e.currentTarget.src = 'https://cdn.pixabay.com/photo/2016/03/26/22/21/books-1281581_1280.jpg';
                        // Prevent infinite error loop if fallback also fails
                        e.currentTarget.onerror = null;
                      }}
                    />
                    {relArticle.categories.includes('journal') && (
                      <>
                        <Badge className="absolute top-2 left-2 bg-purple-600">
                          Journal
                        </Badge>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                          <p className="text-white text-xs line-clamp-1">
                            {relArticle.title.split(':')[0].replace('Daily', '').trim()}
                          </p>
                        </div>
                      </>
                    )}
                  </AspectRatio>
                  <div className="p-4">
                    <Badge variant="outline" className="mb-2 text-xs">{relArticle.source}</Badge>
                    <h3 className="font-semibold text-lg line-clamp-2 mb-2">{relArticle.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{relArticle.summary}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(relArticle.publishedAt), { addSuffix: true })}
                      </span>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-news-blue-medium hover:text-news-blue-dark"
                      >
                        Read More
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;
