import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity('organization_roles')
@Unique(['memberId', 'roleId', 'organizationId'])
export class OrganizationRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'memberId' })
  memberId: string;

  @Column({ name: 'roleId' })
  roleId: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({ name: 'organizationId' })
  organizationId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

