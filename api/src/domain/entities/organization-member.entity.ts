import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
} from 'typeorm';

@Entity('organization_members')
@Unique(['userId', 'organizationId'])
export class OrganizationMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organizationId' })
  organizationId: string;

  @Column({ name: 'userId' })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

