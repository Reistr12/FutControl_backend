import { MemberRoleEnum } from "@domain/enums/member-role.enum";
import { OrganizationAccessService } from "@application/services/organization-access.service";
import { PaymentMethodEnum } from "@domain/enums/payment-method.enum";
import type { IMatchRepository } from "@domain/repositories/match.repository.interface";
import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CurrentUserData } from "@infrastructure/decorators/current-user.decorator";

@Injectable()
export class AddPlayerToMatchUseCase {
    constructor(
        @Inject('IMatchRepository')
        private readonly matchRepository: IMatchRepository,
        private readonly organizationAccessService: OrganizationAccessService
    ) {}

    async execute(params: {
        adminUser: CurrentUserData;
        matchId: string;
        userId?: string;
        isGuest: boolean;
        guestName?: string;
        guestEmail?: string;
        hasPaid?: boolean;
        paymentMethod?: PaymentMethodEnum;
    }) {
        const { adminUser, matchId, userId, isGuest, guestName, guestEmail, hasPaid, paymentMethod } = params;

        const match = await this.matchRepository.findById(matchId);
        if (!match) {
            throw new NotFoundException('Partida não encontrada');
        }

        const isAdmin = await this.organizationAccessService.verifyUserHasRole(
            adminUser.id,
            match.organizationId,
            MemberRoleEnum.ADMIN
        );
        if (!isAdmin) {
            throw new BadRequestException('Apenas administradores podem adicionar jogadores');
        }

        let memberId: string | null = null;

        if (!isGuest) {
            if (!userId) {
                throw new BadRequestException('ID do usuário é obrigatório para membros');
            }
            const member = await this.organizationAccessService.verifyUserIsMember(userId, match.organizationId);
            if (!member) {
                throw new BadRequestException('Usuário não é membro desta organização');
            }
            memberId = member.id;
        } else {
            if (!guestName || !guestEmail) {
                throw new BadRequestException('Nome e email são obrigatórios para convidados');
            }
        }

        const players = await this.matchRepository.findPlayersByMatchId(matchId);

        if (!isGuest && memberId) {
            if (players.some(p => p.memberId === memberId)) {
                throw new BadRequestException('Este membro já está inscrito nesta partida');
            }
        } else if (isGuest && guestEmail) {
            if (players.some(p => p.isGuest && p.guestEmail === guestEmail)) {
                throw new BadRequestException('Este convidado já está inscrito nesta partida');
            }
        }

        if (players.length >= match.maxPlayers) {
            throw new BadRequestException('A partida já atingiu o número máximo de jogadores');
        }

        if (isGuest && match.maxGuests) {
            const currentGuests = players.filter(p => p.isGuest).length;
            if (currentGuests >= match.maxGuests) {
                throw new BadRequestException('A partida já atingiu o número máximo de convidados');
            }
        }

        const player = await this.matchRepository.addPlayer({
            matchId,
            memberId,
            isGuest,
            guestName: isGuest ? guestName : null,
            guestEmail: isGuest ? guestEmail : null,
            hasPaid: hasPaid || false,
            paymentMethod: paymentMethod || null,
        });

        return player;
    }
}
