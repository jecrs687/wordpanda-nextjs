
import SubtitleProvider from '@providers/SubtitleProvider'



export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (<>
        <SubtitleProvider />
        {children}
    </>
    )
}
