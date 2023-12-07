

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    password: string

    @Column()
    role: number

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    updated_at: Date

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    deleted_at: Date

}