import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apartment } from '../entities/apartment.entity';
import { ApartmentController } from '../controllers/apartment.controller';
import { ApartmentService } from '../services/apartment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Apartment])],
  controllers: [ApartmentController],
  providers: [ApartmentService],
  exports: [ApartmentService],
})
export class ApartmentModule {}
