import GamesPage from "./_container/GamesPage/page";
// query the mediaId and language from the URL
export default async function Page({ searchParams }: {
    searchParams: Promise<{
        mediaId: string;
        language: string;
    }>;
}) {
    const { mediaId, language } = await searchParams;
    return (
        <GamesPage mediaId={mediaId} languageCode={language} />
    );
}

