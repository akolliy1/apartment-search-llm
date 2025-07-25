import { Injectable, Logger } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { z } from 'zod';
import { SearchParametersDto } from '../dto/search-parameters.dto';

// Define the schema for parameter extraction
const searchParametersSchema = z.object({
  min_price: z.number().optional().describe('Minimum price for the apartment'),
  max_price: z.number().optional().describe('Maximum price for the apartment'),
  bedrooms: z.number().optional().describe('Number of bedrooms desired'),
  room_type: z
    .string()
    .optional()
    .describe('Type of room (e.g., studio, 1BHK, 2BHK)'),
  location: z.string().optional().describe('Desired location of the apartment'),
  max_distance: z
    .number()
    .optional()
    .describe('Maximum distance from preferred location in kilometers'),
  amenities: z
    .array(z.string())
    .optional()
    .describe('List of desired amenities'),
});

const parser = StructuredOutputParser.fromZodSchema(
  searchParametersSchema as any,
);

@Injectable()
export class LangchainService {
  private readonly logger = new Logger(LangchainService.name);
  private readonly llm: ChatOpenAI;
  // private readonly parser: StructuredOutputParser<SearchParameters>;

  constructor() {
    // Initialize OpenAI LLM
    this.llm = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      temperature: 0,
      // Note: In production, use environment variables for API keys
      openAIApiKey: process.env.OPENAI_API_KEY ?? 'your-openai-api-key',
    });

    // Initialize structured output parser
    // this.parser = StructuredOutputParser.fromZodSchema(searchParametersSchema);
  }

  get parser() {
    return parser;
  }

  async extractParameters(query: string): Promise<SearchParametersDto> {
    try {
      this.logger.log(`Extracting parameters from query: ${query}`);

      // Create the prompt template
      const prompt = PromptTemplate.fromTemplate(`
        Extract apartment search parameters from the following natural language query.
        If a parameter is not mentioned or cannot be inferred, do not include it in the output.
        
        Query: {query}
        
        {format_instructions}
      `);

      // Format the prompt with the query and format instructions
      const formattedPrompt = await prompt.format({
        query,
        format_instructions: this.parser.getFormatInstructions(),
      });

      // Get response from LLM
      const response = await this.llm.invoke(formattedPrompt);

      // Parse the structured output
      const extractedParams = (await this.parser.parse(
        response.content as string,
      )) as Record<string, any>;

      // Merge with defaults for missing parameters
      const defaults = SearchParametersDto.getDefaults();
      const finalParams = { ...defaults, ...extractedParams };

      this.logger.log(`Extracted parameters: ${JSON.stringify(finalParams)}`);

      return finalParams;
    } catch (error) {
      this.logger.error(`Error extracting parameters: ${error.message}`);

      // Return defaults if extraction fails
      return SearchParametersDto.getDefaults();
    }
  }

  // Simulate MCP integration for location services
  async enhanceLocationData(location: string): Promise<{
    normalized_location: string;
    latitude?: number;
    longitude?: number;
  }> {
    try {
      // This would typically call an MCP server for geocoding
      // For now, we'll simulate the functionality
      this.logger.log(`Enhancing location data for: ${location}`);

      // Simulate geocoding response
      const locationData = {
        normalized_location: location.toLowerCase().trim(),
        latitude: 40.7128, // Example: NYC coordinates
        longitude: -74.006,
      };

      return locationData;
    } catch (error) {
      this.logger.error(`Error enhancing location data: ${error.message}`);
      return { normalized_location: location };
    }
  }

  // Simulate MCP integration for price analysis
  async validatePriceRange(
    min_price?: number,
    max_price?: number,
  ): Promise<{
    min_price: number;
    max_price: number;
    market_analysis?: string;
  }> {
    try {
      // This would typically call an MCP server for market price analysis
      this.logger.log(`Validating price range: ${min_price} - ${max_price}`);

      const validated = {
        min_price: min_price ?? 0,
        max_price: max_price ?? 1000000,
        market_analysis: 'Price range is within market standards',
      };

      return validated;
    } catch (error) {
      this.logger.error(`Error validating price range: ${error.message}`);
      return {
        min_price: min_price ?? 0,
        max_price: max_price ?? 1000000,
      };
    }
  }

  // Simulate MCP integration for amenity mapping
  async normalizeAmenities(amenities: string[]): Promise<string[]> {
    try {
      // This would typically call an MCP server for amenity standardization
      this.logger.log(`Normalizing amenities: ${amenities.join(', ')}`);

      const amenityMapping: Record<string, string> = {
        gym: 'fitness_center',
        pool: 'swimming_pool',
        parking: 'parking_space',
        wifi: 'internet',
        ac: 'air_conditioning',
        heating: 'central_heating',
      };

      const normalized = amenities.map(
        (amenity) =>
          amenityMapping[amenity.toLowerCase()] || amenity.toLowerCase(),
      );

      return normalized;
    } catch (error) {
      this.logger.error(`Error normalizing amenities: ${error.message}`);
      return amenities;
    }
  }
}
