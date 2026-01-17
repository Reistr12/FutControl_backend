import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
  OneToMany,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrganizationRole } from './organization-role.entity';
import { User } from './user.entity';

@Entity('organization_members')
@Unique(['userId', 'organizationId'])
export class OrganizationMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organizationId' })
  organizationId: string;

  @OneToOne(() => OrganizationRole, role => role.memberId)
  @JoinColumn({ name: 'id', referencedColumnName: 'memberId' })
  organizationRole: OrganizationRole;

  @Column({ name: 'userId' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

