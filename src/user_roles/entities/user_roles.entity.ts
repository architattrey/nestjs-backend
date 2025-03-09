import { Entity, PrimaryColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity('user_roles')// Marks this class as a TypeORM entity, and 'user_roles' is the table name in the database
export class UserRole {
    // Defining the composite primary key by using two columns (user_id and role_id)
    @PrimaryColumn()
    user_id: number;

    @PrimaryColumn()
    role_id: number;

    // Used onDelete: 'CASCADE' option for a User or Role is deleted, all associated UserRole records will be deleted automatically.
    // Defining the relationship between the 'UserRole' and 'User' entities
    @ManyToOne(() => User, (user) => user.roles, { onDelete: 'CASCADE' })// Specifies a many-to-one relationship with the User entity
    user: User;

    // Defining the relationship between the 'UserRole' and 'Role' entities
    @ManyToOne(() => Role, (role) => role.id, { onDelete: 'CASCADE' })// Specifies a many-to-one relationship with the Role entity
    role: Role;
}
