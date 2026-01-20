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

@Entity('organization_matches')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Column()
  maxPlayers: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column({ nullable: true })
  maxGuests: number;

  @Column()
  maxTeams: number;

  @Column()
  playersPerTeam: number;

  @Column({ type: 'timestamp' })
  registrationOpenDate: Date;

  @Column({ default: false })
  registrationClosed: boolean;

  @Column({ default: false })
  teamsDrawn: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
