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
import { Role } from './role.entity';
import { OrganizationMember } from './organization-member.entity';

@Entity('organization_member_roles')
export class OrganizationMemberRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_member_id' })
  organizationMemberId: string;

  @ManyToOne(() => OrganizationMember)
  @JoinColumn({ name: 'organization_member_id' })
  organizationMember: OrganizationMember;

  @Column({ name: 'role_id' })
  roleId: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

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

