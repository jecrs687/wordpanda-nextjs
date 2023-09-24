import { UUID } from "crypto";

export interface ITranslation {
    word_id: UUID;
    translation: string;
}