
import React, { createContext, useContext, useState, useEffect } from 'react';
import { NewsArticle } from '../types/news';

// Define the shape of our context
interface BookmarkContextType {
  bookmarks: NewsArticle[];
  addBookmark: (article: NewsArticle) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
}

// Create the context with a default value
const BookmarkContext = createContext<BookmarkContextType>({
  bookmarks: [],
  addBookmark: () => {},
  removeBookmark: () => {},
  isBookmarked: () => false,
});

// Create a provider component
export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<NewsArticle[]>([]);

  // Load bookmarks from localStorage on component mount
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem('bookmarks');
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      // Continue with empty bookmarks array if localStorage is not accessible
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      // Continue even if localStorage is not accessible
    }
  }, [bookmarks]);

  // Add a bookmark
  const addBookmark = (article: NewsArticle) => {
    setBookmarks((prevBookmarks) => {
      // Check if the article is already bookmarked
      if (!prevBookmarks.some((bookmark) => bookmark.id === article.id)) {
        return [...prevBookmarks, article];
      }
      return prevBookmarks;
    });
  };

  // Remove a bookmark
  const removeBookmark = (id: string) => {
    setBookmarks((prevBookmarks) => 
      prevBookmarks.filter((bookmark) => bookmark.id !== id)
    );
  };

  // Check if an article is bookmarked
  const isBookmarked = (id: string) => {
    return bookmarks.some((bookmark) => bookmark.id === id);
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
};

// Create a hook for using the bookmark context
export const useBookmarks = () => useContext(BookmarkContext);
