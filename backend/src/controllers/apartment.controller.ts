import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApartmentService } from '../services/apartment.service';
import { Apartment } from '../entities/apartment.entity';
import { SearchParametersDto } from '../dto/search-parameters.dto';

@Controller('api/apartments')
export class ApartmentController {
  private readonly logger = new Logger(ApartmentController.name);

  constructor(private readonly apartmentService: ApartmentService) {}

  @Get()
  async getAllApartments(
    @Query() queryParams: Record<string, any>,
  ): Promise<{ apartments: Apartment[] }> {
    try {
      if (Object.keys(queryParams).length > 0) {
        const searchParams = this.mapQueryToSearchParams(queryParams);
        const apartments =
          await this.apartmentService.searchApartments(searchParams);
        return { apartments };
      }

      const apartments = await this.apartmentService.findAll();
      return { apartments };
    } catch (error) {
      this.logger.error(`Error getting apartments: ${error.message}`);
      throw new HttpException(
        'Failed to retrieve apartments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private mapQueryToSearchParams(queryParams: any): SearchParametersDto {
    const searchParams = new SearchParametersDto();

    if (queryParams.min_price)
      searchParams.min_price = Number(queryParams.min_price);
    if (queryParams.max_price)
      searchParams.max_price = Number(queryParams.max_price);
    if (queryParams.bedrooms)
      searchParams.bedrooms = Number(queryParams.bedrooms);
    if (queryParams.room_type) searchParams.room_type = queryParams.room_type;
    if (queryParams.location) searchParams.location = queryParams.location;
    if (queryParams.amenities) {
      searchParams.amenities = Array.isArray(queryParams.amenities)
        ? queryParams.amenities
        : [queryParams.amenities];
    }

    return searchParams;
  }

  @Get(':id')
  async getApartmentById(
    @Param('id') id: string,
  ): Promise<{ apartment: Apartment }> {
    try {
      const apartment = await this.apartmentService.findById(id);

      if (!apartment) {
        throw new HttpException('Apartment not found', HttpStatus.NOT_FOUND);
      }

      return { apartment };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Error getting apartment by ID: ${error.message}`);
      throw new HttpException(
        'Failed to retrieve apartment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async createApartment(
    @Body(ValidationPipe) apartmentData: Partial<Apartment>,
  ): Promise<{ apartment: Apartment }> {
    try {
      const apartment =
        await this.apartmentService.createApartment(apartmentData);

      return { apartment };
    } catch (error) {
      this.logger.error(`Error creating apartment: ${error.message}`);
      throw new HttpException(
        'Failed to create apartment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async updateApartment(
    @Param('id') id: string,
    @Body(ValidationPipe) updateData: Partial<Apartment>,
  ): Promise<{ apartment: Apartment }> {
    try {
      const apartment = await this.apartmentService.updateApartment(
        id,
        updateData,
      );

      if (!apartment) {
        throw new HttpException('Apartment not found', HttpStatus.NOT_FOUND);
      }

      return { apartment };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Error updating apartment: ${error.message}`);
      throw new HttpException(
        'Failed to update apartment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteApartment(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const success = await this.apartmentService.deleteApartment(id);

      if (!success) {
        throw new HttpException('Apartment not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        message: 'Apartment deleted successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Error deleting apartment: ${error.message}`);
      throw new HttpException(
        'Failed to delete apartment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
