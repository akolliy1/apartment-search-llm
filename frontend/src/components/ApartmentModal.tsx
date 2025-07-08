import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from './ui/dialog.jsx';
import { Badge } from './ui/badge';
import { Button } from './ui/button.jsx';
import { Separator } from './ui/separator.jsx';
import { 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  Wifi, 
  Car, 
  Dumbbell,
  Waves,
  Shield,
  Home,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';

const ApartmentModal = ({ apartment, isOpen, onClose }) => {
  if (!apartment) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
    return <IconComponent className="h-5 w-5" />;
  };

  const formatAmenityName = (amenity) => {
    return amenity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {apartment.title}
          </DialogTitle>
          <DialogDescription className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            {apartment.address}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Price and Basic Info */}
          <div className="flex flex-wrap items-center justify-between bg-gray-50 rounded-lg p-4">
            <div className="flex items-center text-3xl font-bold text-green-600">
              <DollarSign className="h-8 w-8" />
              {formatPrice(apartment.price)}
              <span className="text-lg text-gray-500 ml-2">per month</span>
            </div>
            <div className="flex gap-4 text-gray-600">
              <div className="flex items-center">
                <Bed className="h-5 w-5 mr-1" />
                <span>{apartment.bedrooms} {apartment.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-5 w-5 mr-1" />
                <span>{apartment.bathrooms} {apartment.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
              </div>
              <div className="flex items-center">
                <Square className="h-5 w-5 mr-1" />
                <span>{apartment.square_feet} sq ft</span>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-sm">
              {apartment.room_type.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {apartment.location}
            </Badge>
            {apartment.available && (
              <Badge variant="default" className="text-sm bg-green-600">
                Available Now
              </Badge>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{apartment.description}</p>
          </div>

          <Separator />

          {/* Amenities */}
          {apartment.amenities && apartment.amenities.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {apartment.amenities.map((amenity, index) => (
                  <div 
                    key={index}
                    className="flex items-center bg-gray-50 rounded-lg px-3 py-2"
                  >
                    {getAmenityIcon(amenity)}
                    <span className="ml-2 text-sm">{formatAmenityName(amenity)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Location Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Location</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-gray-600" />
                <span className="text-gray-700">{apartment.address}</span>
              </div>
              <div className="text-sm text-gray-600">
                Coordinates: {apartment.latitude}, {apartment.longitude}
              </div>
            </div>
          </div>

          {/* Listing Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Listing Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                <span className="text-gray-600">Listed: {formatDate(apartment.created_at)}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                <span className="text-gray-600">Updated: {formatDate(apartment.updated_at)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button className="flex-1 min-w-[200px]">
              <Phone className="h-4 w-4 mr-2" />
              Contact Landlord
            </Button>
            <Button variant="outline" className="flex-1 min-w-[200px]">
              <Mail className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            <Button variant="outline" className="flex-1 min-w-[200px]">
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Map
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApartmentModal;

