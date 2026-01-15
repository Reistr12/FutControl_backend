import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
  Max,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da organização é obrigatório' })
  @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'A descrição deve ter no máximo 500 caracteres' })
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber({}, { message: 'O número máximo de membros deve ser um número' })
  @Min(1, { message: 'O número máximo de membros deve ser pelo menos 1' })
  @Max(1000, { message: 'O número máximo de membros não pode exceder 1000' })
  @IsOptional()
  maxMembers?: number;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

