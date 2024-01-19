import { ROUTES } from '@constants/ROUTES';
import { Svg } from '@core/Svg';
import clsx from 'clsx';
import { cookies, headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import styles from './layout.module.scss';

export default function RootLayout({
    children }: {
        children: React.ReactNode
    }) {
    const token = cookies().get('token');
    if (!token) redirect(ROUTES.LOGIN());
    const headersList = headers()
    const pathname = '/' + headersList.get("referer")?.split("//")?.[1]?.split("/")?.slice(1)?.join("/");
    const paths = [
        {
            path: ROUTES.DASHBOARD(),
            icon: "/assets/icons/dashboard.svg",
            name: "Dashboard"
        },
        {
            path: ROUTES.LANGUAGES(),
            icon: "/assets/icons/language.svg",
            name: "Languages"
        },
        {
            path: ROUTES.GAMES(),
            icon: "/assets/icons/study.svg",
            name: "Games"
        },
        {
            path: ROUTES.PROFILE(),
            icon: "/assets/icons/profile.svg",
            name: "Profile"
        },
        {
            path: ROUTES.MOVIES(),
            icon: "/assets/icons/movies.svg",
            name: "Movies"
        },
        {
            path: ROUTES.VIDEOS(),
            icon: "/assets/icons/video.svg",
            name: "Videos"
        },
        {
            path: ROUTES.LOGOUT(),
            icon: "/assets/icons/logout.svg",
            name: "Logout"
        },
    ]
    return (
        <div className={styles.container}>
            <nav className={styles.nav}>
                <Image
                    src="/assets/icons/menu.svg"
                    alt="logo"
                    width={20}
                    height={20}
                    className={styles.menu}
                />
                <ul>
                    {
                        paths.map(({ path, icon, name }, index) => <li
                            key={index}
                            className={clsx(
                                {
                                    [styles.active]: path === pathname
                                }
                            )}
                        >
                            <Link href={path}
                                className={clsx(
                                    styles.link
                                )}
                            >
                                <Svg
                                    height={20}
                                    width={20}
                                    svg={icon}
                                    className={styles.icon}
                                />
                                <span>{name}</span>
                            </Link>
                        </li>)
                    }
                </ul>
            </nav>
            <main className={styles.content}>
                {children}
            </main>
        </div >
    )
}
