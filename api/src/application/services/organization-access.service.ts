import { Injectable, Inject, ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import type { IOrganizationRepository } from '../../domain/repositories/organization.repository.interface';
import { OrganizationMember } from '@domain/entities/organization-member.entity';
import { Repository } from 'typeorm';
import { Role } from '@domain/entities/role.entity';
import { OrganizationRole } from '@domain/entities/organization-role.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrganizationAccessService {
  constructor(
    @Inject('IOrganizationRepository')
    private readonly organizationRepository: IOrganizationRepository,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(OrganizationRole)
    private readonly organizationRoleRepository: Repository<OrganizationRole>,
  ) {}

  async verifyUserIsMember(userId: string, organizationId: string): Promise<OrganizationMember | false> {
    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const organization = await this.organizationRepository.findById(organizationId);
    if (!organization) {
      throw new NotFoundException('Organização não encontrada');
    }

    const member = await this.organizationRepository.findMemberByUserIdAndOrganizationId(
      userId,
      organizationId,
    );

    if (!member) {
      return false
    }

    return member;
  }

  async verifyUserHasRole(userId: string, organizationId: string, roleName: string): Promise<boolean> {
    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const isMember = await this.verifyUserIsMember(userId, organizationId);

    if (!isMember) {
      return false;
    }

    const role = await this.roleRepository.findOneBy({ name: roleName });

    if (!role) {
      throw new NotFoundException(`Função '${roleName}' não encontrada`);
    }

    const organizationRole = await this.organizationRoleRepository.findOne({
      where: {
        memberId: isMember.id,
        roleId: role.id,
        organizationId,
      },
    });

    const hasRole = !!organizationRole;

    return hasRole;
  }
}

