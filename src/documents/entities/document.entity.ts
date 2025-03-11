import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Document {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    content: string;

    @Column()
    filePath: string; // Store the file path

    @Column()
    ownerId: number;  

    @ManyToOne(() => User, (user) => user.id)
    owner: User;
}
// This entity represents a document, which is associated with a user.
// The document has an id, title, content, and owner.