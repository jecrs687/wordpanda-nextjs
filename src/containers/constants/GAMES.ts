import { ROUTES } from "./ROUTES"

export const GAMES: {
    title: string,
    description: string,
    image: string,
    url: string,
    icon?: string
}[] = [
        {
            title: 'Flashcards',
            description: 'Learn new words and phrases',
            image: '/images/flashcards.png',
            url: ROUTES.GAME_FLASHCARD(),
            icon: '/assets/icons/flashcard.svg'
        }, {
            title: 'Hangman',
            description: 'Guess the word or get hanged',
            image: '/images/hangman.png',
            url: ROUTES.GAME_HANGMAN()
        }, {
            title: 'Memory',
            description: 'Find the matching pairs',
            image: '/images/memory.png',
            url: ROUTES.GAME_MEMORY(),
            icon: '/assets/icons/mind.svg'

        }, {
            title: 'Quiz',
            description: 'Test your knowledge',
            image: '/images/quiz.png',
            url: ROUTES.GAME_QUIZ(),

        },
        {
            title: 'Listening',
            description: 'Test your listening skills',
            image: '/images/listening.png',
            url: ROUTES.GAME_LISTENING()
        },
        {
            title: 'Speaking',
            description: 'Test your speaking skills',
            image: '/images/speaking.png',
            url: ROUTES.GAME_SPEAK()
        },
        {
            title: 'Writing',
            description: 'Translate phrases and words to the language you are learning',
            image: '/images/writing.png',
            url: ROUTES.GAME_WRITE()
        },
        {
            title: 'Translate',
            description: 'Translate phrases and words to your language',
            image: '/images/translate.png',
            url: ROUTES.GAME_TRANSLATE(),
            icon: '/assets/icons/translation.svg'
        },
        {
            title: 'Chat',
            description: 'Chat with other users',
            image: '/images/chat.png',
            url: ROUTES.GAME_CHAT()
        }
    ]