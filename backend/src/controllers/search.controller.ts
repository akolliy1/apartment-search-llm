import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { SearchService, SearchResult } from '../services/search.service';
import { SearchRequestDto } from '../dto/search-request.dto';
import { SearchParametersDto } from '../dto/search-parameters.dto';
import { Apartment } from '../entities/apartment.entity';
import { SearchHistory } from '../entities/search-history.entity';

@Controller('api/search')
export class SearchController {
  private readonly logger = new Logger(SearchController.name);

  constructor(private readonly searchService: SearchService) {}

  @Post('apartments')
  async searchApartments(
    @Body(ValidationPipe) searchRequest: SearchRequestDto,
  ): Promise<SearchResult> {
    try {
      this.logger.log(`Received search request: ${searchRequest.query}`);

      const result = await this.searchService.searchApartments(searchRequest);

      return result;
    } catch (error) {
      this.logger.error(`Error in apartment search: ${error.message}`);
      throw new HttpException(
        'Failed to search apartments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('recommendations/:searchId')
  async getRecommendations(
    @Param('searchId') searchId: string,
  ): Promise<{ recommendations: Apartment[] }> {
    try {
      const recommendations =
        await this.searchService.getRecommendations(searchId);

      return { recommendations };
    } catch (error) {
      this.logger.error(`Error getting recommendations: ${error.message}`);
      throw new HttpException(
        'Failed to get recommendations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('history')
  async getSearchHistory(
    @Query('userId') userId?: string,
  ): Promise<{ history: SearchHistory[] }> {
    try {
      const history = await this.searchService.getSearchHistory(userId);

      return { history };
    } catch (error) {
      this.logger.error(`Error getting search history: ${error.message}`);
      throw new HttpException(
        'Failed to get search history',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('popular')
  async getPopularSearches(): Promise<{
    popular_searches: { query: string; count: number }[];
  }> {
    try {
      const popularSearches = await this.searchService.getPopularSearches();

      return { popular_searches: popularSearches };
    } catch (error) {
      this.logger.error(`Error getting popular searches: ${error.message}`);
      throw new HttpException(
        'Failed to get popular searches',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('test-extraction')
  async testParameterExtraction(
    @Body() body: { query: string },
  ): Promise<{ extracted_parameters: SearchParametersDto }> {
    try {
      // This endpoint is for testing parameter extraction without performing a full search
      const searchRequest: SearchRequestDto = { query: body.query };
      const result = await this.searchService.searchApartments(searchRequest);

      return { extracted_parameters: result.parameters };
    } catch (error) {
      this.logger.error(`Error in parameter extraction test: ${error.message}`);
      throw new HttpException(
        'Failed to extract parameters',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
