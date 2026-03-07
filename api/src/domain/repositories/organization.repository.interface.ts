import { Organization } from '../entities/organization.entity';
import { OrganizationMemberRole } from '../entities/organization-role.entity';
import { OrganizationMember } from '../entities/organization-member.entity';

export interface IOrganizationRepository {
  // Organization methods
  findById(id: string): Promise<Organization | null>;
  listOrganizations(isPublic?: boolean): Promise<Organization[]>;
  create(organization: Partial<Organization>): Promise<Organization>;
  save(organization: Organization): Promise<Organization>;
  update(id: string, organization: Partial<Organization>): Promise<Organization>;
  delete(id: string): Promise<void>;

  // OrganizationRole methods
  findRoleById(id: string): Promise<OrganizationMemberRole | null>;
  findRolesByOrganizationId(organizationId: string): Promise<OrganizationMemberRole[]>;
  findRolesByUserIdAndOrganizationId(userId: string, organizationId: string): Promise<OrganizationMemberRole[]>;
  createRole(organizationRole: Partial<OrganizationMemberRole>): Promise<OrganizationMemberRole>;
  saveRole(organizationRole: OrganizationMemberRole): Promise<OrganizationMemberRole>;
  deleteRole(id: string): Promise<void>;
  findRoleByName(name: string): Promise<OrganizationMemberRole | null>;

  // OrganizationMember methods
  findMemberById(id: string): Promise<OrganizationMember | null>;
  findMemberByUserIdAndOrganizationId(userId: string, organizationId: string): Promise<OrganizationMember | null>;
  findMembersByOrganizationId(organizationId: string, search?: string): Promise<OrganizationMember[]>;
  findMembersByUserId(userId: string): Promise<OrganizationMember[]>;
  findAllMembers(): Promise<OrganizationMember[]>;
  createMember(organizationMember: Partial<OrganizationMember>): Promise<OrganizationMember>;
  saveMember(organizationMember: OrganizationMember): Promise<OrganizationMember>;
  deleteMember(id: string): Promise<void>;
  deleteMemberByUserAndOrganization(userId: string, organizationId: string): Promise<void>;
}

