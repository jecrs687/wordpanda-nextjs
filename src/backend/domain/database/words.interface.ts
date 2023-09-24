import { UUID } from "crypto";

export interface IWords {
    word_id: UUID;
    word: string;
    lang: string;
    created_at: Date;
}