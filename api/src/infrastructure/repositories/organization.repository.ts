import { Organization } from "@domain/entities/organization.entity";
import { OrganizationRole } from "@domain/entities/organization-role.entity";
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
        @InjectRepository(OrganizationRole)
        private readonly roleRepo: Repository<OrganizationRole>,
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
    async findRoleById(id: string): Promise<OrganizationRole | null> {
        return this.roleRepo.findOne({ where: { id } });
    }

    async findRolesByOrganizationId(organizationId: string): Promise<OrganizationRole[]> {
        return this.roleRepo.find({
            where: { organizationId },
        });
    }

    async findRolesByUserIdAndOrganizationId(userId: string, organizationId: string): Promise<OrganizationRole[]> {
        const member = await this.memberRepo.findOne({ where: { userId, organizationId } });
        if (!member) return [];
        
        return this.roleRepo.find({
            where: { memberId: member.id, organizationId },
        });
    }

    async createRole(organizationRole: Partial<OrganizationRole>): Promise<OrganizationRole> {
        const newOrganizationRole = this.roleRepo.create(organizationRole);
        return this.roleRepo.save(newOrganizationRole);
    }

    async saveRole(organizationRole: OrganizationRole): Promise<OrganizationRole> {
        return this.roleRepo.save(organizationRole);
    }

    async deleteRole(id: string): Promise<void> {
        await this.roleRepo.softDelete(id);
    }

    async findRoleByName(name: string): Promise<OrganizationRole | null> {
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
            relations: ['organizationRole', 'organizationRole.role'],
        });
    }

    async findMembersByOrganizationId(organizationId: string, search?: string): Promise<OrganizationMember[]> {
        const qb = this.memberRepo.createQueryBuilder('member')
            .leftJoinAndSelect('member.user', 'user')
            .leftJoinAndSelect('member.organizationRole', 'organizationRole')
            .leftJoinAndSelect('organizationRole.role', 'role')
            .where('member.organizationId = :organizationId', { organizationId })
            .andWhere('member.deletedAt IS NULL');

        if (search) {
            qb.andWhere('(user.name ILIKE :search OR user.email ILIKE :search)', { search: `%${search}%` });
        }

        const members = await qb.getMany();
        
        // Se não há role definido, assumir como 'member' por padrão
        return members.map(member => {
            if (!member.organizationRole) {
                member.organizationRole = {
                    id: '',
                    memberId: member.id,
                    roleId: '',
                    organizationId: member.organizationId,
                    role: { id: '', name: 'member' },
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null
                } as any;
            }
            return member;
        });
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