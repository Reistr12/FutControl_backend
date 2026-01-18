import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import type { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { CreateOrganizationMemberDto, MemberRoleEnum } from '../../dtos/create-organization-member.dto';
import { OrganizationMember } from '../../../domain/entities/organization-member.entity';
import { OrganizationAccessService } from '../../services/organization-access.service';
import { OrganizationRoleService } from '@application/services/organization-role.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '@domain/entities/role.entity';

@Injectable()
export class CreateOrganizationMemberUseCase {
  constructor(
    @Inject('IOrganizationRepository')
    private readonly organizationRepository: IOrganizationRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly organizationAccessService: OrganizationAccessService,
    private readonly organizationRoleService: OrganizationRoleService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async execute(createDto: CreateOrganizationMemberDto, userId: string): Promise<OrganizationMember> {
    await this.organizationAccessService.verifyUserHasRole(userId, createDto.organizationId, MemberRoleEnum.ADMIN);

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

    const existing = await this.organizationRepository.findMemberByUserIdAndOrganizationId(
      createDto.userId,
      createDto.organizationId,
    );

    if (existing) {
      throw new ConflictException('Usuário já é membro desta organização');
    }

    const member = await this.organizationRepository.createMember(createDto);

    if (createDto.memberRole) {
      const role = await this.roleRepository.findOne({ where: { name: createDto.memberRole } });
      
      if (role) {
        await this.organizationRoleService.createOrganizationRole(
          member.id,
          createDto.organizationId,
          role.id,
        );
      }
    } 
    
    return member;
  }
}

