import {
  IsOptional,
  IsNumber,
  IsString,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SearchParametersDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  min_price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  max_price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  @Type(() => Number)
  bedrooms?: number;

  @IsOptional()
  @IsString()
  room_type?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  max_distance?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  static getDefaults(): SearchParametersDto {
    return {
      min_price: 0,
      max_price: 1000000,
      bedrooms: 1,
      room_type: 'any',
      location: 'any',
      max_distance: 50,
      amenities: [],
    };
  }
}
