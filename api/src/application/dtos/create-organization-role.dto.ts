import { IsUUID } from 'class-validator';

export class CreateOrganizationRoleDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  roleId: string;

  @IsUUID()
  organizationId: string;
}

