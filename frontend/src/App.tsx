import { useState } from 'react';
import './App.css';
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';
import RecommendationsSection from './components/RecommendationsSection';
import ApartmentModal from './components/ApartmentModal';
import ErrorAlert from './components/ErrorAlert';
import { useApartmentSearch } from './hooks/useApartmentSearch';
import { Button } from './components/ui/button';
import { Home, Github, Info } from 'lucide-react';

function App() {
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const {
    searchResult,
    recommendations,
    isLoading,
    error,
    searchApartments,
    getRecommendations,
    clearResults,
    clearError,
  } = useApartmentSearch();

  const handleSearch = async (query: string) => {
    try {
      await searchApartments(query);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleGetRecommendations = async (searchId: string) => {
    try {
      await getRecommendations(searchId);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleViewDetails = (apartment) => {
    setSelectedApartment(apartment);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedApartment(null);
  };

  const handleNewSearch = () => {
    clearResults();
    clearError();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 min-w-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Home className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Apartment Search
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Info className="h-4 w-4 mr-2" />
                About
              </Button>
              <Button variant="ghost" size="sm">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Search Form */}
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />

          {/* Error Alert */}
          <ErrorAlert error={error} onDismiss={clearError} />

          {/* Search Results */}
          {searchResult && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Search Results
                </h2>
                <Button variant="outline" onClick={handleNewSearch}>
                  New Search
                </Button>
              </div>

              <SearchResults
                searchResult={searchResult}
                onViewDetails={handleViewDetails}
                onGetRecommendations={handleGetRecommendations}
              />
            </div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="space-y-6">
              <RecommendationsSection
                recommendations={recommendations}
                onViewDetails={handleViewDetails}
              />
            </div>
          )}

          {/* Welcome Message */}
          {!searchResult && !isLoading && (
            <div className="text-center py-12">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Find Your Perfect Apartment
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Use natural language to describe your ideal apartment. Our AI
                  will extract the key parameters and find the best matches for
                  you.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      🤖 AI-Powered Search
                    </h3>
                    <p className="text-sm text-gray-600">
                      Our Langchain integration extracts parameters from your
                      natural language queries
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      🎯 Smart Recommendations
                    </h3>
                    <p className="text-sm text-gray-600">
                      Get personalized apartment recommendations based on your
                      preferences
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      🔍 Advanced Filtering
                    </h3>
                    <p className="text-sm text-gray-600">
                      Automatically filters by price, location, amenities, and
                      more
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              Built with NestJS, TypeORM, Langchain, MCP, and React
            </p>
            <p className="text-sm">
              Demonstrating AI-powered parameter extraction and apartment
              recommendations
            </p>
          </div>
        </div>
      </footer>

      {/* Apartment Details Modal */}
      <ApartmentModal
        apartment={selectedApartment}
        isOpen={showModal}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
