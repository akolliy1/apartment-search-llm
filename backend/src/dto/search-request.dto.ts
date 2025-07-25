import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SearchRequestDto {
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsOptional()
  @IsString()
  user_id?: string;
}
