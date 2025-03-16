import { ROUTES } from '@constants/ROUTES';
import prisma from '@infra/config/database';
import { Role } from '@prisma/client';
import { validateToken } from '@utils/token';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import styles from './layout.module.scss';

export default async function RootLayout({
    children }: {
        children: React.ReactNode
    }) {
    const token = (await cookies()).get("token")?.value
    if (!token) redirect(ROUTES.DASHBOARD())
    const { decoded } = validateToken(token)
    const user = await prisma.user.findUnique(
        {
            where: {
                id: decoded.id,
                role: Role.ADMIN
            }
        })
    if (!user) redirect(ROUTES.DASHBOARD())

    return (
        <div className={styles.container}>
            {
                children
            }
        </div >
    )
}
