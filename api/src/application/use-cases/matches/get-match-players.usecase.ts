import type { IMatchRepository } from "@domain/repositories/match.repository.interface";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class GetMatchPlayersUseCase {
    constructor(
        @Inject('IMatchRepository')
        private readonly matchRepository: IMatchRepository
    ) {}

    async execute(matchId: string) {
        const match = await this.matchRepository.findById(matchId);
        if (!match) {
            throw new NotFoundException('Partida não encontrada');
        }

        const players = await this.matchRepository.findPlayersByMatchId(matchId);
        
        return { match, players };
    }
}
