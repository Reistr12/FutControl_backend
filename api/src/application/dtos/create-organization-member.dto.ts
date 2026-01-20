import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { MemberRoleEnum } from '@domain/enums/member-role.enum';

export class CreateOrganizationMemberDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  organizationId: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(MemberRoleEnum)
  memberRole: MemberRoleEnum
}
