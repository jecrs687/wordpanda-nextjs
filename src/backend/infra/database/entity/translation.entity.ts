

import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Word } from "./word.entity";

@Entity()
export class Translation {
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => Word)
    @JoinColumn()
    word: Word

    @ManyToMany(() => Word, (word) => word.translations)
    @JoinTable()
    translations: Word[]
}