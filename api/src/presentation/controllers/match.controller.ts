import { CreateMatchDto } from "@application/dtos/create-match.dto";
import { SubscribeMatchDto } from "@application/dtos/subscribe-match.dto";
import { AddPlayerToMatchDto } from "@application/dtos/add-player-to-match.dto";
import { CreateMatchUseCase } from "@application/use-cases/matches/create-match.usecase";
import { ListMatchesUseCase } from "@application/use-cases/matches/list-matches.usescase";
import { SubscribeInMatchUseCase } from "@application/use-cases/matches/subscribe-in-match.usecase";
import { AddPlayerToMatchUseCase } from "@application/use-cases/matches/add-player-to-match.usecase";
import { GetMatchPlayersUseCase } from "@application/use-cases/matches/get-match-players.usecase";
import { Match } from "@domain/entities/match.entity";
import { MatchPlayer } from "@domain/entities/match-player.entity";
import { CurrentUser, type CurrentUserData } from "@infrastructure/decorators/current-user.decorator";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";

@Controller('matches')
export class MatchController {
    constructor(
        private readonly createMatchUseCase: CreateMatchUseCase,
        private readonly listMatchesUseCase: ListMatchesUseCase,
        private readonly subscribeInMatchUseCase: SubscribeInMatchUseCase,
        private readonly addPlayerToMatchUseCase: AddPlayerToMatchUseCase,
        private readonly getMatchPlayersUseCase: GetMatchPlayersUseCase,
    ) { }

    @Post(':organizationId')
    createMatch(
        @Body() data: CreateMatchDto, 
        @CurrentUser() user: CurrentUserData, 
        @Param('organizationId') organizationId: string
    ): Promise<Match> {
        return this.createMatchUseCase.execute(data, user, organizationId);
    }

    @Get(':idOrganization')
    async listMatches(
        @Param('idOrganization') idOrganization: string,
        @CurrentUser() user: CurrentUserData    
    ): Promise<Match[]> {
        return await this.listMatchesUseCase.execute(idOrganization, user);
    }

    @Post(':matchId/subscribe')
    async subscribeToMatch(
        @Param('matchId') matchId: string,
        @Body() data: SubscribeMatchDto,
        @CurrentUser() user: CurrentUserData
    ): Promise<MatchPlayer> {
        return await this.subscribeInMatchUseCase.execute({
            matchId,
            userId: user.id,
            isGuest: data.isGuest,
            guestName: data.guestName,
            guestEmail: data.guestEmail,
            hasPaid: data.hasPaid,
            paymentMethod: data.paymentMethod,
        });
    }

    @Post(':matchId/add-player')
    async addPlayerToMatch(
        @Param('matchId') matchId: string,
        @Body() data: AddPlayerToMatchDto,
        @CurrentUser() user: CurrentUserData
    ): Promise<MatchPlayer> {
        return await this.addPlayerToMatchUseCase.execute({
            adminUser: user,
            matchId,
            userId: data.userId,
            isGuest: data.isGuest,
            guestName: data.guestName,
            guestEmail: data.guestEmail,
            hasPaid: data.hasPaid,
            paymentMethod: data.paymentMethod,
        });
    }

    @Get(':matchId/players')
    async getMatchPlayers(@Param('matchId') matchId: string) {
        return await this.getMatchPlayersUseCase.execute(matchId);
    }
}
