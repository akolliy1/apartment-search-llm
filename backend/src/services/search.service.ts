import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchHistory } from '../entities/search-history.entity';
import { SearchRequestDto } from '../dto/search-request.dto';
import { SearchParametersDto } from '../dto/search-parameters.dto';
import { Apartment } from '../entities/apartment.entity';
import { LangchainService } from './langchain.service';
import { ApartmentService } from './apartment.service';
import { RecommendationService } from './recommendation.service';

export interface SearchResult {
  apartments: Apartment[];
  parameters: SearchParametersDto;
  total_results: number;
  search_id: string;
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    @InjectRepository(SearchHistory)
    private readonly searchHistoryRepository: Repository<SearchHistory>,
    private readonly langchainService: LangchainService,
    private readonly apartmentService: ApartmentService,
    private readonly recommendationService: RecommendationService,
  ) {}

  async searchApartments(
    searchRequest: SearchRequestDto,
  ): Promise<SearchResult> {
    this.logger.log(`Processing search request: ${searchRequest.query}`);

    try {
      // Step 1: Extract parameters using Langchain
      const extractedParams = await this.langchainService.extractParameters(
        searchRequest.query,
      );

      // Step 2: Enhance parameters using MCP-like services
      if (extractedParams.location && extractedParams.location !== 'any') {
        const locationData = await this.langchainService.enhanceLocationData(
          extractedParams.location,
        );
        extractedParams.location = locationData.normalized_location;
      }

      if (extractedParams.min_price || extractedParams.max_price) {
        const priceData = await this.langchainService.validatePriceRange(
          extractedParams.min_price,
          extractedParams.max_price,
        );
        extractedParams.min_price = priceData.min_price;
        extractedParams.max_price = priceData.max_price;
      }

      if (extractedParams.amenities && extractedParams.amenities.length > 0) {
        extractedParams.amenities =
          await this.langchainService.normalizeAmenities(
            extractedParams.amenities,
          );
      }

      // Step 3: Search apartments based on extracted parameters
      const apartments =
        await this.apartmentService.searchApartments(extractedParams);

      // Step 4: Apply distance filtering if location coordinates are available
      let filteredApartments = apartments;
      if (extractedParams.location && extractedParams.max_distance) {
        // In a real implementation, you would get coordinates from the location
        // For now, we'll skip distance filtering
        filteredApartments = apartments;
      }

      // Step 5: Save search history
      const searchHistory = await this.saveSearchHistory(
        searchRequest.query,
        extractedParams,
        filteredApartments.length,
        searchRequest.user_id,
      );

      // Step 6: Return results
      const result: SearchResult = {
        apartments: filteredApartments,
        parameters: extractedParams,
        total_results: filteredApartments.length,
        search_id: searchHistory.id,
      };

      this.logger.log(
        `Search completed. Found ${filteredApartments.length} apartments`,
      );

      return result;
    } catch (error) {
      this.logger.error(`Error processing search request: ${error.message}`);
      throw new Error('Failed to process search request');
    }
  }

  async getRecommendations(searchId: string): Promise<Apartment[]> {
    try {
      const searchHistory = await this.searchHistoryRepository.findOne({
        where: { id: searchId },
      });

      if (!searchHistory) {
        throw new Error('Search history not found');
      }

      return this.recommendationService.generateRecommendations(
        searchHistory.extracted_parameters,
      );
    } catch (error) {
      this.logger.error(`Error generating recommendations: ${error.message}`);
      return [];
    }
  }

  async getSearchHistory(userId?: string): Promise<SearchHistory[]> {
    const queryBuilder = this.searchHistoryRepository
      .createQueryBuilder('search_history')
      .orderBy('search_history.created_at', 'DESC')
      .limit(20);

    if (userId) {
      queryBuilder.where('search_history.user_id = :userId', { userId });
    }

    return queryBuilder.getMany();
  }

  private async saveSearchHistory(
    originalQuery: string,
    extractedParameters: SearchParametersDto,
    resultsCount: number,
    userId?: string,
  ): Promise<SearchHistory> {
    const searchHistory = this.searchHistoryRepository.create({
      user_id: userId,
      original_query: originalQuery,
      extracted_parameters: extractedParameters,
      results_count: resultsCount,
    });

    return this.searchHistoryRepository.save(searchHistory);
  }

  async getPopularSearches(): Promise<{ query: string; count: number }[]> {
    const result = await this.searchHistoryRepository
      .createQueryBuilder('search_history')
      .select('search_history.original_query', 'query')
      .addSelect('COUNT(*)', 'count')
      .groupBy('search_history.original_query')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    return result.map((item) => ({
      query: item.query,
      count: parseInt(String(item.count), 10),
    }));
  }
}
