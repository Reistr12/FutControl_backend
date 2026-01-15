import { Injectable, Inject, NotFoundException, UnauthorizedException, BadRequestException, ForbiddenException } from '@nestjs/common';
import type { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { Organization } from '../../../domain/entities/organization.entity';
import { OrganizationAccessService } from '../../services/organization-access.service';

@Injectable()
export class GetOrganizationUseCase {
  constructor(
    @Inject('IOrganizationRepository')
    private readonly organizationRepository: IOrganizationRepository,
    private readonly organizationAccessService: OrganizationAccessService,
  ) {}

  async execute(id: string, userId: string): Promise<Organization> {
    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    if (!id) {
      throw new BadRequestException('ID da organização é obrigatório');
    }

    const isMember = await this.organizationAccessService.verifyUserIsMember(userId, id);
    if (!isMember) {
      throw new ForbiddenException('Usuário não é membro desta organização');
    }
    
    const organization = await this.organizationRepository.findById(id);
    if (!organization) {
      throw new NotFoundException('Organização não encontrada');
    }
    return organization;
  }
}

