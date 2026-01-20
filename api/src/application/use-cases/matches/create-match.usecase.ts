import { CreateMatchDto } from "@application/dtos/create-match.dto";
import { MemberRoleEnum } from "@domain/enums/member-role.enum";
import { OrganizationAccessService } from "@application/services/organization-access.service";
import { Match } from "@domain/entities/match.entity";
import type { IMatchRepository } from "@domain/repositories/match.repository.interface";
import { CurrentUserData } from "@infrastructure/decorators/current-user.decorator";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CreateMatchUseCase {
    constructor(
        private readonly organizationAccessService: OrganizationAccessService,
        @Inject('IMatchRepository')
        private readonly matchRepository: IMatchRepository,
    ) {}

    async execute(data: CreateMatchDto, userInfo: CurrentUserData, organizationId: string): Promise<Match> {
        const isAdmin = await this.organizationAccessService.verifyUserHasRole(userInfo.id, organizationId, MemberRoleEnum.ADMIN);

        if (!isAdmin) {
            throw new BadRequestException('Apenas administradores podem criar partidas nesta organização');
        }

        const now = new Date();
        const matchDate = new Date(data.date);
        const registrationDate = new Date(data.registrationOpenDate);

        const drawDate = new Date(matchDate);

        if (registrationDate < now) {
            throw new BadRequestException('A data de abertura de inscrições deve ser uma data futura');
        }

        if (registrationDate < drawDate) {
            throw new BadRequestException('A data de abertura de inscrições deve ser anterior ao horário do sorteio (30 min antes da partida)');
        }

        if (matchDate < now) {
            throw new BadRequestException('A data da partida deve ser uma data futura');
        }

        if (data.startTime >= data.endTime) {
            throw new BadRequestException('O horário de início deve ser anterior ao horário de término');
        }

        const totalPlayers = data.maxTeams * data.playersPerTeam;
        if (totalPlayers > data.maxPlayers) {
            throw new BadRequestException('O número total de jogadores nos times não pode exceder o máximo de jogadores');
        }

        const match = await this.matchRepository.create({
            organizationId,
            maxPlayers: data.maxPlayers,
            date: data.date,
            startTime: data.startTime,
            endTime: data.endTime,
            maxGuests: data.maxGuests,
            maxTeams: data.maxTeams,
            playersPerTeam: data.playersPerTeam,
            registrationOpenDate: data.registrationOpenDate,
            price: data.price,
        });

        return match;
    }
}
