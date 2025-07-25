import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Apartment } from '../entities/apartment.entity';
import { SearchParametersDto } from '../dto/search-parameters.dto';
import { SearchHistory } from '../entities/search-history.entity';

export interface RecommendationScore {
  apartment: Apartment;
  score: number;
  factors: {
    price_match: number;
    location_proximity: number;
    feature_similarity: number;
    popularity: number;
  };
}

@Injectable()
export class RecommendationService {
  private readonly logger = new Logger(RecommendationService.name);

  constructor(
    @InjectRepository(Apartment)
    private readonly apartmentRepository: Repository<Apartment>,
    @InjectRepository(SearchHistory)
    private readonly searchHistoryRepository: Repository<SearchHistory>,
  ) {}

  async generateRecommendations(
    searchParameters: SearchParametersDto,
    userId?: string,
    limit: number = 10,
  ): Promise<Apartment[]> {
    this.logger.log(
      `Generating recommendations for parameters: ${JSON.stringify(searchParameters)}`,
    );

    try {
      // Get all available apartments
      const allApartments = await this.apartmentRepository.find({
        where: { available: true },
      });

      // Calculate scores for each apartment
      const scoredApartments = await Promise.all(
        allApartments.map((apartment) =>
          this.calculateRecommendationScore(
            apartment,
            searchParameters,
            // userId,
          ),
        ),
      );

      // Sort by score (descending) and return top results
      const recommendations = [...scoredApartments]
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((scored) => scored.apartment);

      this.logger.log(`Generated ${recommendations.length} recommendations`);

      return recommendations;
    } catch (error) {
      this.logger.error(`Error generating recommendations: ${error.message}`);
      return [];
    }
  }

  private async calculateRecommendationScore(
    apartment: Apartment,
    searchParameters: SearchParametersDto,
    // userId?: string,
  ): Promise<RecommendationScore> {
    const factors = {
      price_match: this.calculatePriceMatchScore(apartment, searchParameters),
      location_proximity: this.calculateLocationScore(
        apartment,
        searchParameters,
      ),
      feature_similarity: this.calculateFeatureScore(
        apartment,
        searchParameters,
      ),
      popularity: await this.calculatePopularityScore(apartment),
    };

    // Weighted average of all factors
    const weights = {
      price_match: 0.3,
      location_proximity: 0.25,
      feature_similarity: 0.25,
      popularity: 0.2,
    };

    const totalScore =
      factors.price_match * weights.price_match +
      factors.location_proximity * weights.location_proximity +
      factors.feature_similarity * weights.feature_similarity +
      factors.popularity * weights.popularity;

    return {
      apartment,
      score: totalScore,
      factors,
    };
  }

  private calculatePriceMatchScore(
    apartment: Apartment,
    searchParameters: SearchParametersDto,
  ): number {
    const price = Number(apartment.price);
    const minPrice = searchParameters.min_price ?? 0;
    const maxPrice = searchParameters.max_price ?? 1000000;

    // Perfect match if within range
    if (price >= minPrice && price <= maxPrice) {
      // Higher score for prices closer to the middle of the range
      const midPoint = (minPrice + maxPrice) / 2;
      const distance = Math.abs(price - midPoint);
      const maxDistance = (maxPrice - minPrice) / 2;
      return 1 - (distance / maxDistance) * 0.3; // Score between 0.7 and 1.0
    }

    // Penalty for being outside the range
    if (price < minPrice) {
      const deficit = minPrice - price;
      return Math.max(0, 1 - (deficit / minPrice) * 2);
    } else {
      const excess = price - maxPrice;
      return Math.max(0, 1 - (excess / maxPrice) * 2);
    }
  }

  private calculateLocationScore(
    apartment: Apartment,
    searchParameters: SearchParametersDto,
  ): number {
    if (!searchParameters.location || searchParameters.location === 'any') {
      return 0.5; // Neutral score if no location preference
    }

    // Simple string matching for location
    const apartmentLocation = apartment.location.toLowerCase();
    const apartmentAddress = apartment.address.toLowerCase();
    const searchLocation = searchParameters.location.toLowerCase();

    if (
      apartmentLocation.includes(searchLocation) ||
      apartmentAddress.includes(searchLocation)
    ) {
      return 1.0; // Perfect match
    }

    // Partial matching
    const locationWords = searchLocation.split(' ');
    let matchCount = 0;

    locationWords.forEach((word) => {
      if (apartmentLocation.includes(word) || apartmentAddress.includes(word)) {
        matchCount++;
      }
    });

    return matchCount / locationWords.length;
  }

  private calculateFeatureScore(
    apartment: Apartment,
    searchParameters: SearchParametersDto,
  ): number {
    let score = 0;
    let totalFactors = 0;

    // Bedroom match
    if (searchParameters.bedrooms !== undefined) {
      totalFactors++;
      if (apartment.bedrooms === searchParameters.bedrooms) {
        score += 1;
      } else {
        // Partial score based on difference
        const difference = Math.abs(
          apartment.bedrooms - searchParameters.bedrooms,
        );
        score += Math.max(0, 1 - difference * 0.3);
      }
    }

    // Room type match
    if (searchParameters.room_type && searchParameters.room_type !== 'any') {
      totalFactors++;
      const apartmentRoomType = apartment.room_type.toLowerCase();
      const searchRoomType = searchParameters.room_type.toLowerCase();

      if (
        apartmentRoomType.includes(searchRoomType) ||
        searchRoomType.includes(apartmentRoomType)
      ) {
        score += 1;
      }
    }

    // Amenities match
    if (searchParameters.amenities && searchParameters.amenities.length > 0) {
      totalFactors++;
      const apartmentAmenities = apartment.amenities || [];
      const matchingAmenities = searchParameters.amenities.filter((amenity) =>
        apartmentAmenities.some((apartmentAmenity) =>
          apartmentAmenity.toLowerCase().includes(amenity.toLowerCase()),
        ),
      );

      score += matchingAmenities.length / searchParameters.amenities.length;
    }

    return totalFactors > 0 ? score / totalFactors : 0.5;
  }

  private async calculatePopularityScore(
    apartment: Apartment,
  ): Promise<number> {
    try {
      // Count how many times this apartment's location has been searched
      const locationSearches = await this.searchHistoryRepository
        .createQueryBuilder('search_history')
        .where(
          "search_history.extracted_parameters->>'location' ILIKE :location",
          {
            location: `%${apartment.location}%`,
          },
        )
        .getCount();

      // Count searches for similar price range
      const priceSearches = await this.searchHistoryRepository
        .createQueryBuilder('search_history')
        .where(
          "(search_history.extracted_parameters->>'min_price')::numeric <= :price AND " +
            "(search_history.extracted_parameters->>'max_price')::numeric >= :price",
          { price: apartment.price },
        )
        .getCount();

      // Normalize scores (assuming max 100 searches for any criteria)
      const locationScore = Math.min(locationSearches / 100, 1);
      const priceScore = Math.min(priceSearches / 100, 1);

      return (locationScore + priceScore) / 2;
    } catch (error) {
      this.logger.error(`Error calculating popularity score: ${error.message}`);
      return 0.1; // Default low popularity score
    }
  }

  async getRecommendationExplanation(
    apartment: Apartment,
    searchParameters: SearchParametersDto,
  ): Promise<string> {
    const score = await this.calculateRecommendationScore(
      apartment,
      searchParameters,
    );

    const explanations: string[] = [];

    if (score.factors.price_match > 0.8) {
      explanations.push('Excellent price match for your budget');
    } else if (score.factors.price_match > 0.6) {
      explanations.push('Good price match for your budget');
    }

    if (score.factors.location_proximity > 0.8) {
      explanations.push('Located in your preferred area');
    }

    if (score.factors.feature_similarity > 0.8) {
      explanations.push('Matches your room and amenity preferences');
    }

    if (score.factors.popularity > 0.6) {
      explanations.push('Popular choice among similar searches');
    }

    return explanations.length > 0
      ? explanations.join(', ')
      : 'This apartment matches some of your criteria';
  }
}
