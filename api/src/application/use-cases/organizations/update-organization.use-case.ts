import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { UpdateOrganizationDto } from '../../dtos/update-organization.dto';
import { Organization } from '../../../domain/entities/organization.entity';
import { OrganizationAccessService } from '../../services/organization-access.service';
import { MemberRoleEnum } from '@domain/enums/member-role.enum';

@Injectable()
export class UpdateOrganizationUseCase {
  constructor(
    @Inject('IOrganizationRepository')
    private readonly organizationRepository: IOrganizationRepository,
    private readonly organizationAccessService: OrganizationAccessService,
  ) {}

  async execute(id: string, updateDto: UpdateOrganizationDto, userId: string): Promise<Organization> {
    const isAdmin = await this.organizationAccessService.verifyUserHasRole(userId, id, MemberRoleEnum.ADMIN);
    if (!isAdmin) {
      throw new ForbiddenException('Apenas administradores podem atualizar a organização');
    }
    
    const organization = await this.organizationRepository.findById(id);
    if (!organization) {
      throw new NotFoundException('Organização não encontrada');
    }
    return this.organizationRepository.update(id, updateDto);
  }
}

