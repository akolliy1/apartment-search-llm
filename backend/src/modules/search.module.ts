import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchHistory } from '../entities/search-history.entity';
import { Apartment } from '../entities/apartment.entity';
import { SearchController } from '../controllers/search.controller';
import { SearchService } from '../services/search.service';
import { LangchainService } from '../services/langchain.service';
import { RecommendationService } from '../services/recommendation.service';
import { ApartmentModule } from './apartment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SearchHistory, Apartment]),
    ApartmentModule,
  ],
  controllers: [SearchController],
  providers: [SearchService, LangchainService, RecommendationService],
  exports: [SearchService, LangchainService, RecommendationService],
})
export class SearchModule {}
