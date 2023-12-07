

import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Word } from "./word.entity";
import { User } from "./user.entity";

@Entity()
export class UserWords {
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => Word)
    @JoinColumn()
    word: Word

    @ManyToOne(() => User, (user) => user.words)
    user: User

    @Column()
    attempts: number;

    @Column()
    errors: number;
}