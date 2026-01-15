import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('invites')
export class Invite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'organizationId',
  })
  organizationId: string;

  @Column({
    name: 'userId',
  })
  userId: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
  })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}