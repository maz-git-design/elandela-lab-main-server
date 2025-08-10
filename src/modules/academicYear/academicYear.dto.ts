import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateAcademicYearDto {
  @IsInt()
  startingYear: number;

  @IsInt()
  endingYear: number;

  @IsOptional()
  @IsString()
  status?: string;
}
