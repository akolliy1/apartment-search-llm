import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ApartmentService } from '../services/apartment.service';
import { sampleApartments } from '../data/sample-apartments';

async function seedDatabase() {
  console.log('Starting database seeding...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const apartmentService = app.get(ApartmentService);

  try {
    // Clear existing apartments (optional)
    console.log('Clearing existing apartments...');

    // Seed sample apartments
    console.log('Seeding sample apartments...');
    for (const apartmentData of sampleApartments) {
      await apartmentService.createApartment(apartmentData);
      console.log(`Created apartment: ${apartmentData.title}`);
    }

    console.log(`Successfully seeded ${sampleApartments.length} apartments`);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await app.close();
  }
}

// Run the seeding script
seedDatabase().catch((error) => {
  console.error('Unhandled error in seeding script:', error);
});
