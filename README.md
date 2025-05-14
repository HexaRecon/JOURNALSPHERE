# JournalSphere

JournalSphere is a modern web application that combines thoughtful journal entries with news articles across various categories. The platform automatically fetches fresh content from APIs and presents it in an engaging, user-friendly interface.

![JournalSphere Screenshot](https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=1000&auto=format&fit=crop)

## Features

### Core Functionality

- **Journal Entries & News Articles**: Browse a curated collection of thoughtful journal entries alongside news articles from various categories
- **Category Filtering**: Filter content by categories including journal, technology, politics, health, and more
- **Search Functionality**: Search across all content with real-time results
- **Bookmarking**: Save favorite articles for later reading
- **Responsive Design**: Optimized for all devices from mobile to desktop

### Advanced Features

#### Real-Time Content Updates

- **Automatic Article Fetching**: The system automatically checks for new articles from the API every 30 seconds
- **Smart Caching**: Articles are cached for performance while ensuring fresh content is displayed
- **Visual Update Indicators**:
  - Pulsing notification dot when new content is available
  - Animated refresh icon during update checks
  - Toast notifications when new articles are automatically added

#### Content-Specific Images

- **Theme-Based Image System**: 12 different themes with relevant keywords (mindfulness, gratitude, growth, etc.)
- **Smart Content Analysis**: Analyzes article content to match with the most appropriate image
- **Image Descriptions**: Hover tooltips and captions explain the relationship between images and content

#### Daily Journal Entries

- **Daily Refresh**: New journal entries are fetched once per day
- **Content Persistence**: Same entries are shown throughout the day for consistency
- **Manual Refresh Option**: Users can force a refresh to get new content immediately

## Technical Implementation

### Architecture

JournalSphere is built with a modern React frontend using TypeScript for type safety. The application uses a publisher-subscriber (pub/sub) pattern for real-time updates and state management.

### Key Technologies

- **React & TypeScript**: For a robust, type-safe frontend
- **Tailwind CSS**: For responsive, utility-first styling
- **shadcn/ui**: For accessible, customizable UI components
- **Vite**: For fast development and optimized builds

### API Integration

The application integrates with the Quotable API to fetch inspirational quotes that are transformed into journal entries. Each quote is analyzed for themes and paired with relevant imagery.

```typescript
// Example of the article fetching system
export const checkForNewArticles = async (): Promise<boolean> => {
  try {
    // Only check if it's been at least 30 seconds since last check
    const currentTimestamp = Date.now();
    if (currentTimestamp - lastFetchTimestamp < 30000) {
      return false;
    }

    // Update timestamp and fetch latest entries
    lastFetchTimestamp = currentTimestamp;
    const response = await fetch(QUOTES_API_URL);
    const quotes: QuoteResponse[] = await response.json();
    const latestEntries = quotes.map((quote, index) =>
      transformQuoteToJournalEntry(quote, index)
    );

    // Compare with cached entries to detect new content
    const hasNewContent = /* comparison logic */;

    if (hasNewContent) {
      // Update cache and notify subscribers
      notifyArticleUpdateListeners(latestEntries);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking for new articles:', error);
    return false;
  }
};
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd journalsphere
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:8080`

## Usage Guide

### Browsing Content

- The main page displays a mix of journal entries and news articles
- Use the category filters to narrow down content
- Use the search bar to find specific topics

### Real-Time Updates

- A pulsing purple dot on the Journal Feed tab indicates new content is available
- Click the "Refresh Entries" button to manually fetch new content
- Toast notifications will appear when new articles are automatically added

### Bookmarking

- Click the bookmark icon on any article to save it
- Access your bookmarked articles through the Bookmarks tab
- Bookmarks are stored locally and persist across sessions

## Project Structure

```
src/
├── components/         # UI components
├── contexts/           # React contexts for state management
├── data/               # Mock data and data utilities
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
├── services/           # API services
│   ├── journalApi.ts   # Journal entry fetching and transformation
│   └── newsService.ts  # News article management and real-time updates
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Quotable API for providing inspirational quotes
- Unsplash for beautiful, free images
- shadcn/ui for the component library