import { IsString, IsOptional } from 'class-validator';

export class CreateEquipmentCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imagePath?: string;
}
