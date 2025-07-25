import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export interface SearchParameters {
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  room_type?: string;
  location?: string;
  max_distance?: number;
  amenities?: string[];
}

@Entity('search_history')
export class SearchHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  user_id: string;

  @Column({ type: 'text' })
  original_query: string;

  @Column({ type: 'json' })
  extracted_parameters: SearchParameters;

  @Column({ type: 'int' })
  results_count: number;

  @CreateDateColumn()
  created_at: Date;
}
