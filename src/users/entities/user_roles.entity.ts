import { Entity, PrimaryColumn, ManyToOne, JoinColumn  } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';

@Entity('user_roles')// Marks this class as a TypeORM entity, and 'user_roles' is the table name in the database
export class UserRole {
    // Defining the composite primary key by using two columns (user_id and role_id)
    @PrimaryColumn()
    user_id: number;

    @PrimaryColumn()
    role_id: number;

    // Used onDelete: 'CASCADE' option for a User or Role is deleted, all associated UserRole records will be deleted automatically.
    // Defining the relationship between the 'UserRole' and 'User' entities
    @ManyToOne(() => User, (user) => user.roles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })  // Explicitly mapping to user_id
    user: User;

    @ManyToOne(() => Role, (role) => role.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })  // Explicitly mapping to role_id
    role: Role;
}
