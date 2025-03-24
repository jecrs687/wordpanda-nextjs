import { TOKEN_KEY } from '@constants/CONFIGS'
import { ROUTES } from '@constants/ROUTES'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'



export default async function RootLayout(
    {
        children,
    }: {
        children: React.ReactNode
    }
) {
    const token = (await cookies()).get(TOKEN_KEY)?.value
    if (token) redirect(ROUTES.DASHBOARD())

    return (
        children
    )
}
