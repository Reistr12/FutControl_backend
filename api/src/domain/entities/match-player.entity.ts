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
import { PaymentMethodEnum } from '../enums/payment-method.enum';

@Entity('match_players')
export class MatchPlayer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  matchId: string;

  @ManyToOne(() => Match)
  @JoinColumn({ name: 'matchId' })
  match: Match;

  @Column({ type: 'uuid', nullable: true })
  memberId: string | null;

  @ManyToOne(() => OrganizationMember)
  @JoinColumn({ name: 'memberId' })
  member: OrganizationMember;

  @Column({ type: 'int', nullable: true })
  teamNumber: number | null;

  @Column({ default: false })
  isGuest: boolean;

  @Column({ type: 'varchar', nullable: true })
  guestName: string | null;

  @Column({ type: 'varchar', nullable: true })
  guestEmail: string | null;

  @Column({ default: false })
  hasPaid: boolean;

  @Column({ type: 'varchar', nullable: true })
  paymentMethod: PaymentMethodEnum | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
