import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Apartment } from '../entities/apartment.entity';
import { SearchHistory } from '../entities/search-history.entity';

config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  synchronize: configService.get('NODE_ENV') === 'development',
  logging: configService.get('NODE_ENV') === 'development',
  entities: [Apartment, SearchHistory],
  migrations: ['src/**/migrations/*{.ts,.js}'],
  subscribers: ['src/**/*.subscriber{.ts,.js}'],
});
