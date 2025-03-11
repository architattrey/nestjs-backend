import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;// e.g., 'admin', 'editor', 'viewer'

  @Column({ default: true })
  isActive: boolean; // Status of the role
  
}
