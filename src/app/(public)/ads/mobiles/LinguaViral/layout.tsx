import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'WordPanda - Aprenda idiomas de forma viral e divertida',
    description: 'Transforme seu aprendizado de idiomas com o método viral do WordPanda. Aprenda como nunca antes, de forma natural e eficiente.',
};

export default function LinguaViralLayout({
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
