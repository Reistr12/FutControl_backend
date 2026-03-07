import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Match } from './match.entity';
import { OrganizationMember } from './organization-member.entity';
import { PlayerTypeEnum } from '../enums/player-type.enum';

@Entity('match_players')
export class MatchPlayer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'match_id' })
  matchId: string;

  @ManyToOne(() => Match)
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @Column({ type: 'uuid', nullable: true, name: 'organization_member_id' })
  organizationMemberId: string | null;

  @ManyToOne(() => OrganizationMember)
  @JoinColumn({ name: 'organization_member_id' })
  organizationMember: OrganizationMember;

  @Column({ type: 'enum', enum: PlayerTypeEnum })
  type: PlayerTypeEnum;

  @Column({ type: 'varchar', nullable: true, name: 'guest_name' })
  guestName: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @Column({ type: 'uuid', nullable: true, name: 'created_by' })
  createdBy: string;

  @Column({ type: 'uuid', nullable: true, name: 'updated_by' })
  updatedBy: string;

  @Column({ type: 'uuid', nullable: true, name: 'deleted_by' })
  deletedBy: string;
}
