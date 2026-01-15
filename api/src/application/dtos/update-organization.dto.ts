import { IsString, IsOptional, IsBoolean, IsNumber, Min, Max } from 'class-validator';

export class UpdateOrganizationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @Min(1)
  @Max(1000)
  @IsOptional()
  maxMembers?: number;
}

