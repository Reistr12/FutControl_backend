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
import { Organization } from './organization.entity';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'max_players' })
  maxPlayers: number;

  @Column({ name: 'max_guests' })
  maxGuests: number;

  @Column({ name: 'max_teams' })
  maxTeams: number;

  @Column({ name: 'players_per_team' })
  playersPerTeam: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'timestamp' })
  schedule: Date;

  @Column({ type: 'timestamp', name: 'start_at' })
  startAt: Date;

  @Column({ type: 'timestamp', name: 'end_at' })
  endAt: Date;

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
