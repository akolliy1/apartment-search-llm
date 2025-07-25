import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Apartment } from '../entities/apartment.entity';
import { SearchHistory } from '../entities/search-history.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_NAME', 'apartment_search'),
        entities: [Apartment, SearchHistory],
        synchronize: configService.get('NODE_ENV') !== 'production', // Only for development
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
