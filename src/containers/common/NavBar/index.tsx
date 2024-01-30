"use client";
import { SelectLanguage } from "@common/SelectLanguage";
import { ROUTES } from "@constants/ROUTES";
import { Svg } from "@core/Svg";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./NavBar.module.scss";
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

]
export function NavBar() {
    const [path, setPath] = useState<string>('')
    const route = usePathname()
    const updatePath = () => {
        setPath(window?.location.pathname)
    }
    useEffect(() => {
        updatePath();
    }, [route])
    return <nav className={styles.nav}>
        <Image
            src="/assets/icons/menu.svg"
            alt="logo"
            width={20}
            height={20}
            className={styles.menu}
        />
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
                title="Select language"
                className={styles.selectLanguage}
            />
        </div>
        <div
            className={clsx(
                styles.item,
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