import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from '@domain/entities/match.entity';
import { MatchPlayer } from '@domain/entities/match-player.entity';
import { Organization } from '@domain/entities/organization.entity';
import { OrganizationRole } from '@domain/entities/organization-role.entity';
import { OrganizationMember } from '@domain/entities/organization-member.entity';
import { User } from '@domain/entities/user.entity';
import { Role } from '@domain/entities/role.entity';
import { MatchController } from '@presentation/controllers/match.controller';
import { MatchRepository } from '@infrastructure/repositories/match.repository';
import { OrganizationRepository } from '@infrastructure/repositories/organization.repository';
import { CreateMatchUseCase } from '@application/use-cases/matches/create-match.usecase';
import { ListMatchesUseCase } from '@application/use-cases/matches/list-matches.usescase';
import { SubscribeInMatchUseCase } from '@application/use-cases/matches/subscribe-in-match.usecase';
import { AddPlayerToMatchUseCase } from '@application/use-cases/matches/add-player-to-match.usecase';
import { GetMatchPlayersUseCase } from '@application/use-cases/matches/get-match-players.usecase';
import { OrganizationAccessService } from '@application/services/organization-access.service';
import { OrganizationRoleService } from '@application/services/organization-role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, MatchPlayer, Organization, OrganizationRole, OrganizationMember, User, Role]),
  ],
  controllers: [
    MatchController,
  ],
  providers: [
    {
      provide: 'IMatchRepository',
      useClass: MatchRepository,
    },
    {
      provide: 'IOrganizationRepository',
      useClass: OrganizationRepository,
    },
    OrganizationAccessService,
    OrganizationRoleService,
    CreateMatchUseCase,
    ListMatchesUseCase,
    SubscribeInMatchUseCase,
    AddPlayerToMatchUseCase,
    GetMatchPlayersUseCase,
  ],
})
export class MatchModule {}
