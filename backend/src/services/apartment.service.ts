import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Apartment } from '../entities/apartment.entity';
import { SearchParametersDto } from '../dto/search-parameters.dto';

@Injectable()
export class ApartmentService {
  private readonly logger = new Logger(ApartmentService.name);

  constructor(
    @InjectRepository(Apartment)
    private readonly apartmentRepository: Repository<Apartment>,
  ) {}

  async findAll(): Promise<Apartment[]> {
    return this.apartmentRepository.find({
      where: { available: true },
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: string): Promise<Apartment | null> {
    return this.apartmentRepository.findOne({
      where: { id, available: true },
    });
  }

  async searchApartments(
    parameters: SearchParametersDto,
  ): Promise<Apartment[]> {
    this.logger.log(
      `Searching apartments with parameters: ${JSON.stringify(parameters)}`,
    );

    const queryBuilder: SelectQueryBuilder<Apartment> = this.apartmentRepository
      .createQueryBuilder('apartment')
      .where('apartment.available = :available', { available: true });

    // Apply price filters
    if (parameters.min_price !== undefined) {
      queryBuilder.andWhere('apartment.price >= :min_price', {
        min_price: parameters.min_price,
      });
    }

    if (parameters.max_price !== undefined) {
      queryBuilder.andWhere('apartment.price <= :max_price', {
        max_price: parameters.max_price,
      });
    }

    // Apply bedroom filter
    if (parameters.bedrooms !== undefined) {
      queryBuilder.andWhere('apartment.bedrooms = :bedrooms', {
        bedrooms: parameters.bedrooms,
      });
    }

    // Apply room type filter
    if (parameters.room_type && parameters.room_type !== 'any') {
      queryBuilder.andWhere('apartment.room_type ILIKE :room_type', {
        room_type: `%${parameters.room_type}%`,
      });
    }

    // Apply location filter
    if (parameters.location && parameters.location !== 'any') {
      queryBuilder.andWhere(
        '(apartment.location ILIKE :location OR apartment.address ILIKE :location)',
        { location: `%${parameters.location}%` },
      );
    }

    // Apply amenities filter
    if (parameters.amenities && parameters.amenities.length > 0) {
      // Check if apartment has any of the requested amenities
      const amenityConditions = parameters.amenities.map((amenity, index) => {
        const paramName = `amenity_${index}`;
        queryBuilder.setParameter(paramName, `%${amenity}%`);
        return `apartment.amenities::text ILIKE :${paramName}`;
      });

      queryBuilder.andWhere(`(${amenityConditions.join(' OR ')})`);
    }

    // Order by price (ascending) and creation date (descending)
    queryBuilder
      .orderBy('apartment.price', 'ASC')
      .addOrderBy('apartment.created_at', 'DESC');

    // Limit results to prevent overwhelming responses
    queryBuilder.limit(50);

    const results = await queryBuilder.getMany();

    this.logger.log(`Found ${results.length} apartments matching criteria`);

    return results;
  }

  async createApartment(apartmentData: Partial<Apartment>): Promise<Apartment> {
    const apartment = this.apartmentRepository.create(apartmentData);
    return this.apartmentRepository.save(apartment);
  }

  async updateApartment(
    id: string,
    updateData: Partial<Apartment>,
  ): Promise<Apartment | null> {
    await this.apartmentRepository.update(id, updateData);
    return this.findById(id);
  }

  async deleteApartment(id: string): Promise<boolean> {
    const result = await this.apartmentRepository.update(id, {
      available: false,
    });
    return (result.affected ?? 0) > 0;
  }

  // Calculate distance between two coordinates (Haversine formula)
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Filter apartments by distance from a specific location
  async filterByDistance(
    apartments: Apartment[],
    targetLat: number,
    targetLon: number,
    maxDistance: number,
  ): Promise<Apartment[]> {
    return apartments.filter((apartment) => {
      const distance = this.calculateDistance(
        targetLat,
        targetLon,
        apartment.latitude,
        apartment.longitude,
      );
      return distance <= maxDistance;
    });
  }
}
