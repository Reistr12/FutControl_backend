import { OrganizationAccessService } from "@application/services/organization-access.service";
import { PaymentMethodEnum } from "@domain/enums/payment-method.enum";
import { PlayerTypeEnum } from "@domain/enums/player-type.enum";
import type { IMatchRepository } from "@domain/repositories/match.repository.interface";
import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class SubscribeInMatchUseCase {
    constructor(
        @Inject('IMatchRepository')
        private readonly matchRepository: IMatchRepository,
        private readonly organizationAccessService: OrganizationAccessService
    ) {}

    async execute(params: {
        userId: string;
        matchId: string;
        type: PlayerTypeEnum;
        guestName?: string;
    }) {
        const { userId, matchId, type, guestName } = params;
        const isGuest = type === PlayerTypeEnum.GUEST;

        const match = await this.matchRepository.findById(matchId);
        if (!match) {
            throw new NotFoundException('Partida não encontrada');
        }

        let organizationMemberId: string | null = null;

        if (!isGuest) {
            const member = await this.organizationAccessService.verifyUserIsMember(userId, match.organizationId);
            if (!member) {
                throw new BadRequestException('Você não é membro desta organização');
            }
            organizationMemberId = member.id;
        } else {
            if (!guestName) {
                throw new BadRequestException('Nome é obrigatório para convidados');
            }
        }

        const now = new Date();
        if (match.schedule && now < new Date(match.schedule)) {
            throw new BadRequestException('As inscrições ainda não foram abertas');
        }

        if (match.endAt && now > new Date(match.endAt)) {
            throw new BadRequestException('As inscrições para esta partida já foram fechadas');
        }

        const players = await this.matchRepository.findPlayersByMatchId(matchId);

        if (!isGuest && organizationMemberId) {
            if (players.some(p => p.organizationMemberId === organizationMemberId)) {
                throw new BadRequestException('Você já está inscrito nesta partida');
            }
        } else if (isGuest && guestName) {
            if (players.some(p => p.type === PlayerTypeEnum.GUEST && p.guestName === guestName)) {
                throw new BadRequestException('Este convidado já está inscrito nesta partida');
            }
        }

        if (players.length >= match.maxPlayers) {
            throw new BadRequestException('A partida já atingiu o número máximo de jogadores');
        }

        if (isGuest && match.maxGuests) {
            const currentGuests = players.filter(p => p.type === PlayerTypeEnum.GUEST).length;
            if (currentGuests >= match.maxGuests) {
                throw new BadRequestException('A partida já atingiu o número máximo de convidados');
            }
        }

        const player = await this.matchRepository.addPlayer({
            matchId,
            organizationMemberId,
            type,
            guestName: isGuest ? guestName : null,
        });

        return player;
    }
}
