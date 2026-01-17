import { OrganizationMember } from "@domain/entities/organization-member.entity";
import { OrganizationRole } from "@domain/entities/organization-role.entity";
import { Organization } from "@domain/entities/organization.entity";
import { Role } from "@domain/entities/role.entity";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Transaction } from "typeorm";

@Injectable()
export class OrganizationRoleService {
    constructor(
        @InjectRepository(OrganizationRole)
        private readonly organizationRoleRepository: Repository<OrganizationRole>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(Organization)
        private readonly organizationRepository: Repository<Organization>,
        @InjectRepository(OrganizationMember)
        private readonly organizationMemberRepository: Repository<OrganizationMember>,
    ) {}
    async createOrganizationRole(idMember: string, idOrganization: string, idRole: string): Promise<OrganizationRole> {
        const role = await this.roleRepository.createQueryBuilder('role')
          .where('role.id = :idRole', { idRole })
          .getOne();

        if (!role) {
            throw new BadRequestException('A role especificada não existe.');
        }

        const organization = await this.organizationRepository.createQueryBuilder('organization')
          .where('organization.id = :idOrganization', { idOrganization })
          .getOne();
          
        if (!organization) {
            throw new BadRequestException('A organização especificada não existe.');
        }

        const member = await this.organizationMemberRepository.createQueryBuilder('organizationMember')
          .where('organizationMember.id = :idMember', { idMember })
          .andWhere('organizationMember.organizationId = :idOrganization', { idOrganization })
          .getOne();

        if (!member) {
            throw new BadRequestException('O membro especificado não existe ou não pertence à organização.');
        }
        
        const organizationRole = new OrganizationRole();
        organizationRole.memberId = idMember;
        organizationRole.organizationId = idOrganization;
        organizationRole.roleId = idRole;
        
        await this.organizationRoleRepository.save(organizationRole);
        return organizationRole;
    }

    async updateOrganizationRole(idMember: string, idOrganization: string, idRole: string, newIdRole: string): Promise<OrganizationRole> {
        const organizationRole = await this.organizationRoleRepository.createQueryBuilder('organizationRole')
          .where('organizationRole.memberId = :idMember', { idMember })
          .andWhere('organizationRole.organizationId = :idOrganization', { idOrganization })
          .andWhere('organizationRole.roleId = :idRole', { idRole })
          .getOne();

        if (!organizationRole) {
            throw new BadRequestException('A role especificada para o membro na organização não existe.');
        }

        const newRole = await this.roleRepository.createQueryBuilder('role')
          .where('role.id = :newIdRole', { newIdRole })
          .getOne();

        if (!newRole || newRole.id === organizationRole.roleId) {
            throw new BadRequestException('Erro ao tentar atualizar a papel operacional do membro na organização.');
        }

        organizationRole.roleId = newIdRole;
        await this.organizationRoleRepository.save(organizationRole);

        return organizationRole;
    }

    async deleteOrganizationRole(idMember: string, idOrganization: string, idRole: string): Promise<void> {
        const organizationRole = await this.organizationRoleRepository.createQueryBuilder('organizationRole')
        .where('organizationRole.memberId = :idMember', { idMember })
        .andWhere('organizationRole.organizationId = :idOrganization', { idOrganization })
        .andWhere('organizationRole.roleId = :idRole', { idRole })
        .getOne();

        const memberInOrganization = await this.organizationMemberRepository.createQueryBuilder('organizationMember')
          .where('organizationMember.id = :idMember', { idMember })
          .andWhere('organizationMember.organizationId = :idOrganization', { idOrganization })
          .andWhere('organizationMember.deletedAt IS NULL')
          .getOne();
        
        if (memberInOrganization) {
            throw new BadRequestException('Não é possível deletar a role de um membro que ainda pertence à organização.');
        }

        if (!organizationRole) {
            throw new BadRequestException('A role especificada para o membro na organização não existe.');
        }

        await this.organizationRoleRepository.softDelete(organizationRole);
    }
}