import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ROUTES } from 'src/containers/constants/ROUTES'



export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const token = cookies().get('token')
    if (token) redirect(ROUTES.DASHBOARD())

    return (
        children
    )
}
