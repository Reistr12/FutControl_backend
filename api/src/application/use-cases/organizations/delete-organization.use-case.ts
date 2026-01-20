import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { OrganizationAccessService } from '../../services/organization-access.service';
import { Repository } from 'typeorm';
import { OrganizationRole } from '@domain/entities/organization-role.entity';
import { OrganizationMember } from '@domain/entities/organization-member.entity';
import { MemberRoleEnum } from '@domain/enums/member-role.enum';

@Injectable()
export class DeleteOrganizationUseCase {
  constructor(
    @Inject('IOrganizationRepository')
    private readonly organizationRepository: IOrganizationRepository,
    private readonly organizationAccessService: OrganizationAccessService,
    private readonly organizationRole: Repository<OrganizationRole>,
    private readonly organizationMembers: Repository<OrganizationMember>,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const organization = await this.organizationRepository.findById(id);

    if (!organization) {
      throw new NotFoundException('Organização não encontrada');
    }
    
    const isMemberAdmin = await this.organizationAccessService.verifyUserHasRole(userId, id, MemberRoleEnum.ADMIN);
    if (!isMemberAdmin) {
      throw new ForbiddenException('Usuário não tem permissão para deletar esta organização');
    }

    const organizationRoles = await this.organizationRole.find({ where: { organizationId: id } });

    for (const organizationRole of organizationRoles) {
      await this.organizationRole.softDelete(organizationRole.id);
    }

    const organizationMembers = await this.organizationMembers.find({ where: { organizationId: id } });

    for (const organizationMember of organizationMembers) {
      await this.organizationMembers.softDelete(organizationMember.id);
    }

    await this.organizationRepository.delete(id);
  }
}

