import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import type { IOrganizationMemberRepository } from '../../../domain/repositories/organization.repository.interface';
import type { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { CreateOrganizationMemberDto } from '../../dtos/create-organization-member.dto';
import { OrganizationMember } from '../../../domain/entities/organization-member.entity';
import { OrganizationAccessService } from '../../services/organization-access.service';

@Injectable()
export class CreateOrganizationMemberUseCase {
  constructor(
    @Inject('IOrganizationMemberRepository')
    private readonly organizationMemberRepository: IOrganizationMemberRepository,
    @Inject('IOrganizationRepository')
    private readonly organizationRepository: IOrganizationRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly organizationAccessService: OrganizationAccessService,
  ) {}

  async execute(createDto: CreateOrganizationMemberDto, userId: string): Promise<OrganizationMember> {
    // Verifica se o usuário tem permissão de admin
    await this.organizationAccessService.verifyUserHasRole(userId, createDto.organizationId, 'admin');
    
    const [organization, user] = await Promise.all([
      this.organizationRepository.findById(createDto.organizationId),
      this.userRepository.findById(createDto.userId),
    ]);

    if (!organization) {
      throw new NotFoundException('Organização não encontrada');
    }
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const existing = await this.organizationMemberRepository.findByUserIdAndOrganizationId(
      createDto.userId,
      createDto.organizationId,
    );

    if (existing) {
      throw new ConflictException('Usuário já é membro desta organização');
    }

    return this.organizationMemberRepository.create(createDto);
  }
}

