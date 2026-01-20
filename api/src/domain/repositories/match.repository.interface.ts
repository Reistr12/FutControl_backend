import { Match } from '../entities/match.entity';
import { MatchPlayer } from '../entities/match-player.entity';

export interface IMatchRepository {
  // Match operations
  create(match: Partial<Match>): Promise<Match>;
  findById(id: string): Promise<Match | null>;
  findByOrganizationId(organizationId: string): Promise<Match[]>;
  update(id: string, match: Partial<Match>): Promise<Match>;
  delete(id: string): Promise<void>;

  // MatchPlayer operations
  addPlayer(matchPlayer: Partial<MatchPlayer>): Promise<MatchPlayer>;
  removePlayer(matchId: string, memberId: string): Promise<void>;
  findPlayersByMatchId(matchId: string): Promise<MatchPlayer[]>;
  findPlayerByMatchAndMember(matchId: string, memberId: string): Promise<MatchPlayer | null>;
  countPlayersByMatchId(matchId: string): Promise<number>;
}
