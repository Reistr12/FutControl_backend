import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
export enum MemberRoleEnum {
  ADMIN = 'admin',
  MEMBER = 'member'
}
export class CreateOrganizationMemberDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  organizationId: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum({
    MemberRoleEnum
  })
  memberRole: MemberRoleEnum
}

