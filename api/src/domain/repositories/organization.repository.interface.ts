import { Organization } from '../entities/organization.entity';
import { OrganizationRole } from '../entities/organization-role.entity';
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
  findRoleById(id: string): Promise<OrganizationRole | null>;
  findRolesByOrganizationId(organizationId: string): Promise<OrganizationRole[]>;
  findRolesByUserIdAndOrganizationId(userId: string, organizationId: string): Promise<OrganizationRole[]>;
  createRole(organizationRole: Partial<OrganizationRole>): Promise<OrganizationRole>;
  saveRole(organizationRole: OrganizationRole): Promise<OrganizationRole>;
  deleteRole(id: string): Promise<void>;
  findRoleByName(name: string): Promise<OrganizationRole | null>;

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

