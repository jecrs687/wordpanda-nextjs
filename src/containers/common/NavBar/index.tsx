"use client";
import { SelectLanguage } from "@common/SelectLanguage";
import { ROUTES } from "@constants/ROUTES";
import { Svg } from "@core/Svg";
import useDevice from "@hooks/useDevice";
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
        icon: "/assets/icons/dashboard.svg",
        name: "Home"
    },
    {
        path: ROUTES.LANGUAGES(),
        icon: "/assets/icons/language.svg",
        name: "Línguas"
    },
    // {
    //     path: ROUTES.GAMES(),
    //     icon: "/assets/icons/study.svg",
    //     name: "Games"
    // },
    {
        path: ROUTES.PROFILE(),
        icon: "/assets/icons/profile.svg",
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
        icon: string;
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
                icon: "/assets/icons/video.svg",
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
                paths.map(({ path: url, icon, name }, index) => <li
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
                <Svg
                    height={20}
                    width={20}
                    svg={"/assets/icons/logout.svg"}
                    className={styles.icon}
                />
                <span>
                    Logout
                </span>
            </Link>
        </div>
    </nav>
}