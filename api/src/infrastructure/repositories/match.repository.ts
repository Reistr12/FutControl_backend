import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '@domain/entities/match.entity';
import { MatchPlayer } from '@domain/entities/match-player.entity';
import { IMatchRepository } from '@domain/repositories/match.repository.interface';

@Injectable()
export class MatchRepository implements IMatchRepository {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepo: Repository<Match>,
    @InjectRepository(MatchPlayer)
    private readonly matchPlayerRepo: Repository<MatchPlayer>,
  ) {}

  // Match operations
  async create(match: Partial<Match>): Promise<Match> {
    const newMatch = this.matchRepo.create(match);
    return this.matchRepo.save(newMatch);
  }

  async findById(id: string): Promise<Match | null> {
    return this.matchRepo.findOne({
      where: { id },
      relations: ['organization'],
    });
  }

  async findByOrganizationId(organizationId: string): Promise<Match[]> {
    return this.matchRepo.find({
      where: { organizationId },
      order: { date: 'ASC', startTime: 'ASC' },
    });
  }

  async update(id: string, match: Partial<Match>): Promise<Match> {
    await this.matchRepo.update(id, match);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Match not found');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.matchRepo.softDelete(id);
  }

  // MatchPlayer operations
  async addPlayer(matchPlayer: Partial<MatchPlayer>): Promise<MatchPlayer> {
    const newPlayer = this.matchPlayerRepo.create(matchPlayer);
    return this.matchPlayerRepo.save(newPlayer);
  }

  async removePlayer(matchId: string, memberId: string): Promise<void> {
    await this.matchPlayerRepo.softDelete({ matchId, memberId });
  }

  async findPlayersByMatchId(matchId: string): Promise<MatchPlayer[]> {
    return this.matchPlayerRepo.find({
      where: { matchId },
      relations: ['member', 'member.user'],
      order: { createdAt: 'ASC' },
    });
  }

  async findPlayerByMatchAndMember(matchId: string, memberId: string): Promise<MatchPlayer | null> {
    return this.matchPlayerRepo.findOne({
      where: { matchId, memberId },
      relations: ['member'],
    });
  }

  async countPlayersByMatchId(matchId: string): Promise<number> {
    return this.matchPlayerRepo.count({
      where: { matchId },
    });
  }
}
