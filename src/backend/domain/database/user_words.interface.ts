import { UUID } from "crypto";

export interface IUserWords {
    user_id: number;
    word_id: UUID;
    errors: number;
    attempts: number;
}