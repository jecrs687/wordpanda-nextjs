import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const token = cookies().get('token');
    if (!token) {
        redirect('/auth/login');
    }
    const device = cookies().get('mobile');

    return (
        device === 'mobile' ?
            <div>
                {children}

            </div> :
            <div>
                {children}
            </div>
    )
}
