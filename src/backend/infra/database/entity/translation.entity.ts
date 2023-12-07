

import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Word } from "./word.entity";

@Entity()
export class Translation {
    @PrimaryGeneratedColumn()
    id: number

    @JoinColumn(
        { referencedColumnName: "id" }
    )
    word: Word

    @OneToMany(
        () => Word,
        word => word.id
    )
    words: Word[]



}