import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import { Badge } from './ui/badge.jsx';
import { Button } from './ui/button.jsx';
import { Separator } from './ui/separator.jsx';
import ApartmentCard from './ApartmentCard';
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Bed, 
  Home,
  Sparkles,
  AlertCircle
} from 'lucide-react';

const SearchResults = ({ searchResult, onViewDetails, onGetRecommendations }) => {
  const [showParameters, setShowParameters] = useState(false);

  if (!searchResult) {
    return null;
  }

  const { apartments, parameters, total_results, search_id } = searchResult;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatParameterValue = (key, value) => {
    if (value === null || value === undefined || value === 'any') {
      return 'Any';
    }
    
    switch (key) {
      case 'min_price':
        return `From ${formatPrice(value)}`;
      case 'max_price':
        return `Up to ${formatPrice(value)}`;
      case 'bedrooms':
        return `${value} ${value === 1 ? 'bedroom' : 'bedrooms'}`;
      case 'room_type':
        return value.toUpperCase();
      case 'location':
        return value;
      case 'max_distance':
        return `Within ${value} km`;
      case 'amenities':
        return Array.isArray(value) && value.length > 0 
          ? value.join(', ') 
          : 'Any';
      default:
        return value;
    }
  };

  const getParameterIcon = (key) => {
    const iconMap = {
      min_price: DollarSign,
      max_price: DollarSign,
      bedrooms: Bed,
      room_type: Home,
      location: MapPin,
      max_distance: MapPin,
      amenities: Sparkles,
    };
    
    const IconComponent = iconMap[key] || Filter;
    return <IconComponent className="h-4 w-4" />;
  };

  const getParameterLabel = (key) => {
    const labelMap = {
      min_price: 'Min Price',
      max_price: 'Max Price',
      bedrooms: 'Bedrooms',
      room_type: 'Room Type',
      location: 'Location',
      max_distance: 'Max Distance',
      amenities: 'Amenities',
    };
    
    return labelMap[key] || key;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Search Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-xl">
                <Search className="h-5 w-5 mr-2" />
                Search Results
              </CardTitle>
              <CardDescription>
                Found {total_results} {total_results === 1 ? 'apartment' : 'apartments'} matching your criteria
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowParameters(!showParameters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {showParameters ? 'Hide' : 'Show'} Filters
              </Button>
              {search_id && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onGetRecommendations(search_id)}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get Recommendations
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        {showParameters && (
          <CardContent>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Extracted Search Parameters:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(parameters).map(([key, value]) => {
                  const formattedValue = formatParameterValue(key, value);
                  if (formattedValue === 'Any' && key !== 'location' && key !== 'room_type') {
                    return null;
                  }
                  
                  return (
                    <div key={key} className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                      {getParameterIcon(key)}
                      <div>
                        <div className="text-xs text-gray-500">{getParameterLabel(key)}</div>
                        <div className="text-sm font-medium">{formattedValue}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Results */}
      {apartments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No apartments found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or using different keywords.
            </p>
            <p className="text-sm text-gray-500">
              Suggestions: Try broader location terms, increase your budget range, or reduce specific requirements.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apartments.map((apartment) => (
            <ApartmentCard
              key={apartment.id}
              apartment={apartment}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;

