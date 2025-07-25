import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database.module';
import { ApartmentModule } from './modules/apartment.module';
import { SearchModule } from './modules/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // .forRoot({
    //   isGlobal: true,
    //   envFilePath: '.env',
    // }),
    DatabaseModule,
    ApartmentModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
