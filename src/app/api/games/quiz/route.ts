import { quizGameAction } from "@backend/domain/actions/Games/quiz.action";
import { Language, Word, WordGameQuiz } from "@prisma/client";


export type GamesQuizPostRequest = {
    words: string[]
}

export type GamesQuizPostResponse = {
    data?: {
        words: Array<
            Word & {
                wordGameQuiz: WordGameQuiz[],
                language: Language
            }
        >,
    },
    err?: string | null,
    msg?: string,
}
export async function POST(request: Request) {
    const {
        words
    }: GamesQuizPostRequest = await request.json();
    return Response.json(await quizGameAction({ words }));
}