import { useState } from 'react';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import { Search, Loader2 } from 'lucide-react';

const SearchForm = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const exampleQueries = [
    "2 bedroom apartment in Manhattan under $3000",
    "Studio near Central Park with gym",
    "Affordable 1BR in Brooklyn with parking",
    "Luxury apartment with pool and doorman",
    "Student housing near universities under $1200"
  ];

  const handleExampleClick = (example) => {
    setQuery(example);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI-Powered Apartment Search
        </CardTitle>
        <CardDescription className="text-lg">
          Describe your ideal apartment in natural language and let our AI find the perfect match
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="e.g., 2 bedroom apartment in Manhattan under $3000 with gym and parking"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full py-3 text-lg font-semibold"
            disabled={!query.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Search Apartments
              </>
            )}
          </Button>
        </form>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-600">Try these examples:</h3>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleExampleClick(example)}
                className="text-xs hover:bg-blue-50 hover:border-blue-300"
                disabled={isLoading}
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchForm;

