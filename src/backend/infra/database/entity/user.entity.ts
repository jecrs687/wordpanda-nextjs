

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserWords } from "./user_words.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    first_name: string

    @Column()
    last_name: string

    @Column()
    username: string

    @Column()
    email: string

    @Column()
    password: string

    @Column()
    role: number

    @OneToMany(() => UserWords, (userWords) => userWords.user)
    words: UserWords[]

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    last_access: Date

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    updated_at: Date

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    deleted_at: Date

}