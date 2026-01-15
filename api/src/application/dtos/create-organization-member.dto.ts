import { IsUUID } from 'class-validator';

export class CreateOrganizationMemberDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  organizationId: string;
}

