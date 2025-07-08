import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import { Badge } from './ui/badge.jsx';
import { Button } from './ui/button.jsx';
import { 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Square, 
  Wifi, 
  Car, 
  Dumbbell,
  Waves,
  Shield,
  Home,
  ExternalLink
} from 'lucide-react';

const ApartmentCard = ({ apartment, onViewDetails }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      wifi: Wifi,
      internet: Wifi,
      parking_space: Car,
      parking: Car,
      fitness_center: Dumbbell,
      gym: Dumbbell,
      swimming_pool: Waves,
      pool: Waves,
      doorman: Shield,
      security: Shield,
      default: Home
    };
    
    const IconComponent = iconMap[amenity.toLowerCase()] || iconMap.default;
    return <IconComponent className="h-4 w-4" />;
  };

  const formatAmenityName = (amenity) => {
    return amenity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-300 border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-gray-900 mb-1">
              {apartment.title}
            </CardTitle>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{apartment.address}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-2xl font-bold text-green-600">
              <DollarSign className="h-6 w-6" />
              {formatPrice(apartment.price)}
            </div>
            <span className="text-sm text-gray-500">per month</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <CardDescription className="text-gray-700 line-clamp-2">
          {apartment.description}
        </CardDescription>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{apartment.bedrooms} {apartment.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{apartment.bathrooms} {apartment.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span>{apartment.square_feet} sq ft</span>
          </div>
        </div>

        <div className="flex items-center">
          <Badge variant="secondary" className="mr-2">
            {apartment.room_type.toUpperCase()}
          </Badge>
          <Badge variant="outline">
            {apartment.location}
          </Badge>
        </div>

        {apartment.amenities && apartment.amenities.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Amenities:</h4>
            <div className="flex flex-wrap gap-2">
              {apartment.amenities.slice(0, 6).map((amenity, index) => (
                <div 
                  key={index}
                  className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-700"
                >
                  {getAmenityIcon(amenity)}
                  <span className="ml-1">{formatAmenityName(amenity)}</span>
                </div>
              ))}
              {apartment.amenities.length > 6 && (
                <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-700">
                  +{apartment.amenities.length - 6} more
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pt-2">
          <Button 
            onClick={() => onViewDetails(apartment)}
            className="w-full"
            variant="outline"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApartmentCard;

