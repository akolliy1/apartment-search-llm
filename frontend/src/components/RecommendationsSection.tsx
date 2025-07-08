import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import ApartmentCard from './ApartmentCard';
import { Sparkles, AlertCircle } from 'lucide-react';

const RecommendationsSection = ({ recommendations, onViewDetails }) => {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
            AI Recommendations
          </CardTitle>
          <CardDescription>
            Based on your search criteria, here are {recommendations.length} additional apartments you might like
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((apartment) => (
          <div key={apartment.id} className="relative">
            <div className="absolute -top-2 -right-2 z-10">
              <div className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                Recommended
              </div>
            </div>
            <ApartmentCard
              apartment={apartment}
              onViewDetails={onViewDetails}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsSection;

