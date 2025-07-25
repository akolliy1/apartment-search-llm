import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('apartments')
export class Apartment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  bedrooms: number;

  @Column({ type: 'int' })
  bathrooms: number;

  @Column({ type: 'varchar', length: 100 })
  room_type: string; // studio, 1BHK, 2BHK, etc.

  @Column({ type: 'varchar', length: 255 })
  location: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ type: 'int' })
  square_feet: number;

  @Column({ type: 'json', nullable: true })
  amenities: string[];

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ type: 'boolean', default: true })
  available: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
