import { ROUTES } from "@constants/ROUTES";

export const GAMES: {
    titleKey: string,
    descriptionKey: string,
    image: string,
    url: string,
    Icon?: any
}[] = [
        {
            titleKey: 'games.games.definitionMatch.title',
            descriptionKey: 'games.games.definitionMatch.description',
            image: '/assets/games/definitionmatch.jpg',
            url: ROUTES.GAME_DEFINITIONMATCH(),
        },
        {
            titleKey: 'games.games.flashcard.title',
            descriptionKey: 'games.games.flashcard.description',
            image: '/assets/games/flashcard.jpg',
            url: ROUTES.GAME_FLASHCARD(),
        },
        {
            titleKey: 'games.games.flashcards.title',
            descriptionKey: 'games.games.flashcards.description',
            image: '/assets/games/flashcards.jpg',
            url: ROUTES.GAME_FLASHCARDS(),
        },
        {
            titleKey: 'games.games.hangman.title',
            descriptionKey: 'games.games.hangman.description',
            image: '/assets/games/hangman.jpg',
            url: ROUTES.GAME_HANGMAN(),
        },
        {
            titleKey: 'games.games.memory.title',
            descriptionKey: 'games.games.memory.description',
            image: '/assets/games/memory.jpg',
            url: ROUTES.GAME_MEMORY(),
        },
        {
            titleKey: 'games.games.spellingBee.title',
            descriptionKey: 'games.games.spellingBee.description',
            image: '/assets/games/spellingbee.jpg',
            url: ROUTES.GAME_SPELLINGBEE(),
        },
        {
            titleKey: 'games.games.translation.title',
            descriptionKey: 'games.games.translation.description',
            image: '/assets/games/translation.jpg',
            url: ROUTES.GAME_TRANSLATE(),
        },
        {
            titleKey: 'games.games.wordAssociation.title',
            descriptionKey: 'games.games.wordAssociation.description',
            image: '/assets/games/wordassociation.jpg',
            url: ROUTES.GAME_WORDASSOCIATION(),
        },
        {
            titleKey: 'games.games.wordCategories.title',
            descriptionKey: 'games.games.wordCategories.description',
            image: '/assets/games/wordcategories.jpg',
            url: ROUTES.GAME_WORDCATEGORIES(),
        },
        {
            titleKey: 'games.games.wordChains.title',
            descriptionKey: 'games.games.wordChains.description',
            image: '/assets/games/wordchains.jpg',
            url: ROUTES.GAME_WORDCHAINS(),
        },
        {
            titleKey: 'games.games.wordPairs.title',
            descriptionKey: 'games.games.wordPairs.description',
            image: '/assets/games/wordpairs.jpg',
            url: ROUTES.GAME_WORDPAIRS(),
        },
        {
            titleKey: 'games.games.wordRace.title',
            descriptionKey: 'games.games.wordRace.description',
            image: '/assets/games/wordrace.jpg',
            url: ROUTES.GAME_WORDRACE(),
        },
        {
            titleKey: 'games.games.wordScramble.title',
            descriptionKey: 'games.games.wordScramble.description',
            image: '/assets/games/wordscramble.jpg',
            url: ROUTES.GAME_WORDSCRAMBLE(),
        },
    ]