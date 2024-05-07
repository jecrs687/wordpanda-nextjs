import { ShowIf } from '@common/ShowIf/ShowIf'
import { ROUTES } from '@constants/ROUTES'
import Image from 'next/image'
import Link from 'next/link'
import styles from './CardMovieSmall.module.scss'

export default function CardMovieSmall({
    id, name, language, code, logoUrl, platform, languages
}: {
    id: string,
    name: string,
    language?: string,
    code?: string,
    logoUrl: string,
    platform: string,
    languages?: string

}) {

    return <div className={styles.wrapper}>
        <Link className={styles.container} href={
            ROUTES.MOVIE(id)
        }>
            <div className={styles.content}>

                <span className={styles.title}>

                    {name}</span>
                <span
                    className={styles.language}
                >
                    <ShowIf condition={!!language}>
                        {
                            language
                        } -
                        {
                            code
                        }
                    </ShowIf>
                    <ShowIf condition={!!languages}>
                        {
                            languages
                        }
                    </ShowIf>
                </span>
                <span
                    className={styles.platform}
                >
                    {platform}
                </span>
            </div>
            <Image
                width={150}
                height={150}
                src={logoUrl || "https://picsum.photos/200/300"}
                alt={name}
                className={styles.logo}
                loading='lazy'
                quality={50}
                placeholder='blur'
                blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAOXRFWHRTb2Z0d2FyZQBNYXRwbG90bGliIHZlcnNpb24zLjQuMywgaHR0cHM6Ly9tYXRwbG90bGliLm9yZy/MnkTPAAAACXBIWXMAAB7CAAAewgFu0HU+AAEAAElEQVR4nOzdd3gU5f7H8e9'

            />
        </Link>
    </div>
}