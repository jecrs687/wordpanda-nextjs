import { ROUTES } from '@constants/ROUTES';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const token = cookies().get('token');
    if (!token) redirect(ROUTES.LOGIN());

    return (
        <div>
            {children}
        </div>
    )
}
