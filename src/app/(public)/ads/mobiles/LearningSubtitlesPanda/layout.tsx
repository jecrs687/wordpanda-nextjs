import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'WordPanda - Aprenda idiomas de forma divertida com legendas',
    description: 'Revolucione seu aprendizado de idiomas com WordPanda. Use legendas de filmes e séries para aprender de maneira natural e eficiente.',
};

export default function LearningSubtitlesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
        </>
    );
}
