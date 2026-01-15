import { Organization } from '../entities/organization.entity';
import { OrganizationRole } from '../entities/organization-role.entity';
import { OrganizationMember } from '../entities/organization-member.entity';

export interface IOrganizationRepository {
  findById(id: string): Promise<Organization | null>;
  listOrganizations(isPublic?: boolean): Promise<Organization[]>;
  create(organization: Partial<Organization>): Promise<Organization>;
  save(organization: Organization): Promise<Organization>;
  update(id: string, organization: Partial<Organization>): Promise<Organization>;
  delete(id: string): Promise<void>;
}

export interface IOrganizationRoleRepository {
  findById(id: string): Promise<OrganizationRole | null>;
  findByOrganizationId(organizationId: string): Promise<OrganizationRole[]>;
  create(organizationRole: Partial<OrganizationRole>): Promise<OrganizationRole>;
  save(organizationRole: OrganizationRole): Promise<OrganizationRole>;
  delete(id: string): Promise<void>;
}

export interface IOrganizationMemberRepository {
  findById(id: string): Promise<OrganizationMember | null>;
  findByUserIdAndOrganizationId(
    userId: string,
    organizationId: string,
  ): Promise<OrganizationMember | null>;
  findByOrganizationId(organizationId: string): Promise<OrganizationMember[]>;
  findByUserId(userId: string): Promise<OrganizationMember[]>;
  findAll(): Promise<OrganizationMember[]>;
  create(organizationMember: Partial<OrganizationMember>): Promise<OrganizationMember>;
  save(organizationMember: OrganizationMember): Promise<OrganizationMember>;
  delete(id: string): Promise<void>;
  deleteByUserAndOrganization(userId: string, organizationId: string): Promise<void>;
}

