import { IsString, MinLength, IsOptional } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string;
}

