import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ListOrganizationsUseCase } from '@application/use-cases/organizations/list-organizatios.usecase';
import { CreateOrganizationUseCase } from '@application/use-cases/organizations/create-organization.use-case';
import { GetOrganizationUseCase } from '@application/use-cases/organizations/get-organization.use-case';
import { UpdateOrganizationUseCase } from '@application/use-cases/organizations/update-organization.use-case';
import { DeleteOrganizationUseCase } from '@application/use-cases/organizations/delete-organization.use-case';
import { CreateOrganizationDto } from '@application/dtos/create-organization.dto';
import { UpdateOrganizationDto } from '@application/dtos/update-organization.dto';
import { GetOrganizationRolesUseCase } from '@application/use-cases/organization-roles/get-organization-roles.use-case';
import { GetUserRolesInOrganizationUseCase } from '@application/use-cases/organization-roles/get-user-roles-in-organization.use-case';
import { CreateOrganizationMemberUseCase } from '@application/use-cases/organization-members/create-organization-member.use-case';
import { GetOrganizationMembersUseCase } from '@application/use-cases/organization-members/get-organization-members.use-case';
import { DeleteOrganizationMemberUseCase } from '@application/use-cases/organization-members/delete-organization-member.use-case';
import { CreateOrganizationMemberDto } from '@application/dtos/create-organization-member.dto';
import { OrganizationMember } from '@domain/entities/organization-member.entity';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '@infrastructure/decorators/current-user.decorator';
import type { CurrentUserData } from '@infrastructure/decorators/current-user.decorator';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationController {
  constructor(
    private readonly listOrganizationsUseCase: ListOrganizationsUseCase,
    private readonly createOrganizationUseCase: CreateOrganizationUseCase,
    private readonly getOrganizationUseCase: GetOrganizationUseCase,
    private readonly updateOrganizationUseCase: UpdateOrganizationUseCase,
    private readonly deleteOrganizationUseCase: DeleteOrganizationUseCase,
    private readonly getOrganizationRolesUseCase: GetOrganizationRolesUseCase,
    private readonly getUserRolesInOrganizationUseCase: GetUserRolesInOrganizationUseCase,
    private readonly createOrganizationMemberUseCase: CreateOrganizationMemberUseCase,
    private readonly getOrganizationMembersUseCase: GetOrganizationMembersUseCase,
    private readonly deleteOrganizationMemberUseCase: DeleteOrganizationMemberUseCase,
  ) {}

  @Get()
  async listOrganizations(
    @CurrentUser() user: CurrentUserData,
    @Query('search') search?: string,
    @Query('isPublic') isPublic?: boolean,
  ) {
    return this.listOrganizationsUseCase.execute({ 
      userId: user.id,
      search: search,
      isPublic: isPublic,
    });
  }

  @Get(':id')
  async getOrganization(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.getOrganizationUseCase.execute(id, user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrganization(
    @Body() createDto: CreateOrganizationDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.createOrganizationUseCase.execute(createDto, user);
  }

  @Put(':id')
  async updateOrganization(
    @Param('id') id: string,
    @Body() updateDto: UpdateOrganizationDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.updateOrganizationUseCase.execute(id, updateDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOrganization(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    await this.deleteOrganizationUseCase.execute(id, user.id);
  }

  // Organization Roles
  @Get(':organizationId/roles')
  async getOrganizationRoles(
    @Param('organizationId') organizationId: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.getOrganizationRolesUseCase.execute(organizationId, user.id);
  }

  @Get(':organizationId/roles/user/:userId')
  async getUserRolesInOrganization(
    @Param('organizationId') organizationId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.getUserRolesInOrganizationUseCase.execute(userId, organizationId, user.id);
  }

  // Organization Members
  @Get(':organizationId/members')
  async getOrganizationMembers(
    @Param('organizationId') organizationId: string,
    @Query('search') search: string,
    @CurrentUser() user: CurrentUserData,
  ): Promise<OrganizationMember[]> {
    return this.getOrganizationMembersUseCase.execute(organizationId, user.id, { search });
  }

  @Post(':organizationId/members')
  @HttpCode(HttpStatus.CREATED)
  async createOrganizationMember(
    @Param('organizationId') organizationId: string,
    @Body() createDto: CreateOrganizationMemberDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.createOrganizationMemberUseCase.execute(
      {
        ...createDto,
        organizationId,
      },
      user.id,
    );
  }

  @Delete(':organizationId/members/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOrganizationMember(
    @Param('organizationId') organizationId: string,
    @Param('userId') userId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    await this.deleteOrganizationMemberUseCase.execute(userId, organizationId, currentUser.id);
  }
}