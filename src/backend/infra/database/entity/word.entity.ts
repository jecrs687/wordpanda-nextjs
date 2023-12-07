import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Translation } from "./translation.entity";

@Entity()
export class Word {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    word: string

    @Column()
    lang: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @ManyToMany(() => Translation, (translations) => translations.translations)
    translations: Translation[]
}