"use client";
import HomeIcon from '@mui/icons-material/Home';
import LanguageIcon from '@mui/icons-material/Language';

import VideoIcon from "@assets/icons/video.svg";
import { SelectLanguage } from "@common/SelectLanguage";
import { ROUTES } from "@constants/ROUTES";
import useDevice from "@hooks/useDevice";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { getCookie } from "@utils/cookie";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./NavBar.module.scss";
const paths = [
    {
        path: ROUTES.DASHBOARD(),
        Icon: HomeIcon,
        name: "Home"
    },
    {
        path: ROUTES.LANGUAGES(),
        Icon: LanguageIcon,
        name: "Línguas"
    },
    // {
    //     path: ROUTES.GAMES(),
    //     icon: "/assets/icons/study.svg",
    //     name: "Games"
    // },
    {
        path: ROUTES.PROFILE(),
        Icon: AccountCircleIcon,
        name: "Perfil"
    },
    // {
    //     path: ROUTES.MOVIES(),
    //     icon: "/assets/icons/movies.svg",
    //     name: "Movies"
    // },
    // {
    //     path: ROUTES.VIDEOS(),
    //     icon: "/assets/icons/video.svg",
    //     name: "Videos"
    // },

]
export function NavBar() {
    const [path, setPath] = useState<string>('')
    const [allPaths, setAllPaths] = useState<{
        path: string;
        Icon: any;
        name: string;
    }[]
    >(paths)
    const { extension } = useDevice()
    const route = usePathname()
    const router = useRouter();
    const updatePath = () => {
        setPath(window?.location.pathname)
    }
    useEffect(() => {
        updatePath();
        // router.prefetch(ROUTES.DASHBOARD())
        // router.prefetch(ROUTES.LANGUAGES())
        // router.prefetch(ROUTES.PROFILE())
    }, [route])

    useEffect(() => {
        const isAdmin = getCookie("admin") || localStorage.getItem("admin") === "true"
        if (isAdmin) paths.push(
            {
                path: ROUTES.ADMIN(),
                Icon: VideoIcon,
                name: "Admin"
            },
        )



    }, [extension])
    if (extension) return <></>
    return <nav className={styles.nav}>
        <div className={styles.logo}>
            <Image
                src="/assets/logo.png"
                alt="logo"
                width={20}
                height={20}
                className={styles.logo__image}
            />
            <h3 className={styles.logo__title}>
                Wordpanda
            </h3>

        </div>

        <ul className={styles.list}>
            {
                paths.map(({ path: url, Icon, name }, index) => <li
                    key={index}
                    className={clsx(
                        styles.item,
                        {
                            [styles.active]: path.includes(url)
                        }
                    )}
                >
                    <Link href={url}
                        className={clsx(
                            styles.link
                        )}
                    >
                        <Icon
                            height={10}
                            width={10}
                            className={styles.icon}
                        />
                        <span>{name}</span>
                    </Link>
                </li>)
            }
        </ul>
        <div className={styles.selectLanguageContainer}>
            <SelectLanguage
                title="Lingua"
                className={styles.selectLanguage}
            />
        </div>
        <div
            className={clsx(
                styles.item, styles.logout,
                {
                    [styles.active]: ROUTES.LOGOUT() === path
                }
            )}
        >
            <Link href={ROUTES.LOGOUT()}
                className={clsx(
                    styles.link
                )}
            >
                <LogoutIcon
                    height={20}
                    width={20}
                    className={styles.icon}
                />
                <span>
                    Logout
                </span>
            </Link>
        </div>
    </nav>
}