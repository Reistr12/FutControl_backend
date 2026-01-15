import { Injectable, Inject, ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import type { IOrganizationMemberRepository, IOrganizationRepository, IOrganizationRoleRepository } from '../../domain/repositories/organization.repository.interface';

@Injectable()
export class OrganizationAccessService {
  constructor(
    @Inject('IOrganizationRepository')
    private readonly organizationRepository: IOrganizationRepository,
    @Inject('IOrganizationMemberRepository')
    private readonly organizationMemberRepository: IOrganizationMemberRepository,
    @Inject('IOrganizationRoleRepository')
    private readonly organizationRoleRepository: IOrganizationRoleRepository,
  ) {}

  async verifyUserIsMember(userId: string, organizationId: string): Promise<boolean> {
    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const organization = await this.organizationRepository.findById(organizationId);
    if (!organization) {
      throw new NotFoundException('Organização não encontrada');
    }

    const member = await this.organizationMemberRepository.findByUserIdAndOrganizationId(
      userId,
      organizationId,
    );

    if (!member) {
      return false
    }

    return true;
  }

  async verifyUserHasRole(userId: string, organizationId: string, roleName: string): Promise<boolean> {
    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const isMember = await this.verifyUserIsMember(userId, organizationId);

    if (!isMember) {
      return false;
    }

    const role = await this.roleRepository.findByName(roleName);
    if (!role) {
      return false;
    }

    const userRoles = await this.organizationRoleRepository.findByUserIdAndOrganizationId(
      userId,
      organizationId,
    );

    const hasRole = userRoles.some((orgRole) => orgRole.roleId === role.id);

    return hasRole;
  }
}

