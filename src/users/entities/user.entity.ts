import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Role } from './role.entity';


@Entity('users') // Define the 'users' table in the database
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @ManyToMany(() => Role)// Establishes a many-to-many relationship with the Role entity
    @JoinTable({
        name: 'user_roles',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },// Defines the foreign key from 'user' side
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },// Defines the foreign key from 'role' side
    })
    roles: Role[];// An array of Role entities associated with the user
}