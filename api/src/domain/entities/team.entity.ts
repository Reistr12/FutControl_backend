import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false })
  name: string
}