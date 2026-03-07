import { Organization } from "@domain/entities/organization.entity";
import { OrganizationMemberRole } from "@domain/entities/organization-role.entity";
import { OrganizationMember } from "@domain/entities/organization-member.entity";
import { Role } from "@domain/entities/role.entity";
import { IOrganizationRepository } from "@domain/repositories/organization.repository.interface";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class OrganizationRepository implements IOrganizationRepository {
    constructor(
        @InjectRepository(Organization)
        private readonly organizationRepo: Repository<Organization>,
        @InjectRepository(OrganizationMemberRole)
        private readonly roleRepo: Repository<OrganizationMemberRole>,
        @InjectRepository(OrganizationMember)
        private readonly memberRepo: Repository<OrganizationMember>,
        @InjectRepository(Role)
        private readonly baseRoleRepo: Repository<Role>,
    ) {}

    // Organization methods
    async findById(id: string): Promise<Organization | null> {
        return this.organizationRepo.findOne({ where: { id } });
    }

    async listOrganizations(isPublic?: boolean): Promise<Organization[]> {
        let qb = this.organizationRepo.createQueryBuilder('organization');
        qb.select([
            'organization.id',
            'organization.name',
            'organization.description',
            'organization.location',
            'organization.isPublic',
            'organization.isActive',
            'organization.maxMembers',
            'organization.createdAt',
            'organization.updatedAt',
        ]);

        if (isPublic) {
            qb.where('organization.isPublic = :isPublic', { isPublic: true })
        }
        
        return await qb.getMany();
    }

    async create(organization: Partial<Organization>): Promise<Organization> {
        const newOrganization = this.organizationRepo.create(organization);
        return this.organizationRepo.save(newOrganization);
    }

    async save(organization: Organization): Promise<Organization> {
        return this.organizationRepo.save(organization);
    }

    async update(id: string, organization: Partial<Organization>): Promise<Organization> {
        await this.organizationRepo.update(id, organization);
        const updated = await this.findById(id);
        if (!updated) {
            throw new Error('Organization not found');
        }
        return updated;
    }

    async delete(id: string): Promise<void> {
        await this.organizationRepo.delete(id);
    }

    // ------------------------------------------------OrganizationRole methods
    async findRoleById(id: string): Promise<OrganizationMemberRole | null> {
        return this.roleRepo.findOne({ where: { id } });
    }

    async findRolesByOrganizationId(organizationId: string): Promise<OrganizationMemberRole[]> {
        const members = await this.memberRepo.find({ where: { organizationId } });
        if (members.length === 0) return [];
        
        const memberIds = members.map(m => m.id);
        return this.roleRepo.createQueryBuilder('role')
            .where('role.organizationMemberId IN (:...memberIds)', { memberIds })
            .getMany();
    }

    async findRolesByUserIdAndOrganizationId(userId: string, organizationId: string): Promise<OrganizationMemberRole[]> {
        const member = await this.memberRepo.findOne({ where: { userId, organizationId } });
        if (!member) return [];
        
        return this.roleRepo.find({
            where: { organizationMemberId: member.id },
        });
    }

    async createRole(organizationRole: Partial<OrganizationMemberRole>): Promise<OrganizationMemberRole> {
        const newOrganizationMemberRole = this.roleRepo.create(organizationRole);
        return this.roleRepo.save(newOrganizationMemberRole);
    }

    async saveRole(organizationRole: OrganizationMemberRole): Promise<OrganizationMemberRole> {
        return this.roleRepo.save(organizationRole);
    }

    async deleteRole(id: string): Promise<void> {
        await this.roleRepo.softDelete(id);
    }

    async findRoleByName(name: string): Promise<OrganizationMemberRole | null> {
        const role = await this.baseRoleRepo.findOne({ where: { name } });
        if (!role) return null;
        
        return this.roleRepo.findOne({ where: { roleId: role.id } });
    }
    
    // ---------------------------OrganizationMember methods
    async findMemberById(id: string): Promise<OrganizationMember | null> {
        return this.memberRepo.findOne({
            where: { id },
            relations: ['user', 'organization'],
        });
    }

    async findMemberByUserIdAndOrganizationId(
        userId: string,
        organizationId: string,
    ): Promise<OrganizationMember | null> {
        return this.memberRepo.findOne({
            where: { userId, organizationId },
            relations: ['user', 'organization'],
        });
    }

    async findMembersByOrganizationId(organizationId: string, search?: string): Promise<OrganizationMember[]> {
        const qb = this.memberRepo.createQueryBuilder('member')
            .leftJoinAndSelect('member.user', 'user')
            .where('member.organizationId = :organizationId', { organizationId })
            .andWhere('member.deletedAt IS NULL');

        if (search) {
            qb.andWhere('(user.name ILIKE :search OR user.email ILIKE :search)', { search: `%${search}%` });
        }

        return await qb.getMany();
    }

    async findMembersByUserId(userId: string): Promise<OrganizationMember[]> {
        return this.memberRepo.find({
            where: { userId },
            relations: ['organization'],
        });
    }

    async findAllMembers(): Promise<OrganizationMember[]> {
        return this.memberRepo.find({
            relations: ['user', 'organization'],
        });
    }

    async createMember(organizationMember: Partial<OrganizationMember>): Promise<OrganizationMember> {
        const newMember = this.memberRepo.create(organizationMember);
        return this.memberRepo.save(newMember);
    }

    async saveMember(organizationMember: OrganizationMember): Promise<OrganizationMember> {
        return this.memberRepo.save(organizationMember);
    }

    async deleteMember(id: string): Promise<void> {
        await this.memberRepo.softDelete(id);
    }

    async deleteMemberByUserAndOrganization(userId: string, organizationId: string): Promise<void> {
        await this.memberRepo.softDelete({ userId, organizationId });
    }
}