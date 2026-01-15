import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
} from 'typeorm';

@Entity('organization_roles')
@Unique(['memberId', 'roleId', 'organizationId'])
export class OrganizationRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'memberId' })
  memberId: string;

  @Column({ name: 'roleId' })
  roleId: string;

  @Column({ name: 'organizationId' })
  organizationId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

