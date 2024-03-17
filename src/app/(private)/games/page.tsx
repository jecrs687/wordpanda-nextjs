import GamesPage from './_container/GamesPage/page';

export default async function Page() {
    const allowedGames = [
        'Translate',
        'Memory',
        'Flashcards'
    ]

    return (
        <GamesPage />
    )
}
