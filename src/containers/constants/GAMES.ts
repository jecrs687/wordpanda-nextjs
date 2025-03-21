import { ROUTES } from "src/containers/constants/ROUTES";

export const GAMES: {
    title: string,
    description: string,
    image: string,
    url: string,
    Icon?: any
}[] = [
        {
            title: 'Definição e Correspondência',
            description: 'Combine as palavras com suas definições correspondentes.',
            image: '/assets/games/definitionmatch.jpg',
            url: ROUTES.GAME_DEFINITIONMATCH(),
        },
        {
            title: 'Flashcard',
            description: 'Pratique seu vocabulário com cartões de memória.',
            image: '/assets/games/flashcard.jpg',
            url: ROUTES.GAME_FLASHCARD(),
        },
        {
            title: 'Flashcards',
            description: 'Pratique seu vocabulário com cartões de memória.',
            image: '/assets/games/flashcards.jpg',
            url: ROUTES.GAME_FLASHCARDS(),
        },
        {
            title: 'jogo da forca',
            description: 'Adivinhe a palavra antes que o boneco seja enforcado',
            image: '/assets/games/hangman.jpg',
            url: ROUTES.GAME_HANGMAN(),
        },
        {
            title: 'Jogo da Memória',
            description: 'Encontre os pares de palavras correspondentes.',
            image: '/assets/games/memory.jpg',
            url: ROUTES.GAME_MEMORY(),
        },
        {
            title: 'soletrando',
            description: 'Pratique a ortografia soletrando palavras.',
            image: '/assets/games/spellingbee.jpg',
            url: ROUTES.GAME_SPELLINGBEE(),
        },
        {
            title: 'Tradução',
            description: 'Traduza palavras para o idioma escolhido.',
            image: '/assets/games/translation.jpg',
            url: ROUTES.GAME_TRANSLATE(),
        },
        {
            title: 'Associação de Palavras',
            description: 'Associe palavras comuns em pares.',
            image: '/assets/games/wordassociation.jpg',
            url: ROUTES.GAME_WORDASSOCIATION(),
        },
        {
            title: 'Categorias de Palavras',
            description: 'Categorize palavras em grupos.',
            image: '/assets/games/wordcategories.jpg',
            url: ROUTES.GAME_WORDCATEGORIES(),
        },
        {
            title: 'Correntes de Palavras',
            description: 'Crie correntes de palavras com palavras relacionadas.',
            image: '/assets/games/wordchains.jpg',
            url: ROUTES.GAME_WORDCHAINS(),
        },
        {
            title: 'Pares de Palavras',
            description: 'Combine palavras em pares.',
            image: '/assets/games/wordpairs.jpg',
            url: ROUTES.GAME_WORDPAIRS(),
        },
        {
            title: 'Corrida de Palavras',
            description: 'Corra para encontrar as palavras correspondentes.',
            image: '/assets/games/wordrace.jpg',
            url: ROUTES.GAME_WORDRACE(),
        },
        {
            title: 'Embaralhar Palavras',
            description: 'Desembaralhe as letras para formar palavras.',
            image: '/assets/games/wordscramble.jpg',
            url: ROUTES.GAME_WORDSCRAMBLE(),
        },


    ]