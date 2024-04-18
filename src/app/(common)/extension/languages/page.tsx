"use client";
import { SelectLanguage } from "@common/SelectLanguage";
import { ShowIf } from "@common/ShowIf/ShowIf";
import TextSearch from "@common/TextSearch";
import { ROUTES } from "@constants/ROUTES";
import useEvents from "@hooks/useEvents";
import useWords from "@hooks/useWords";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from './page.module.scss';
export default function Page() {
    const { events } = useEvents();
    const { words, setLanguage } = useWords();

    const [search, setSearch] = useState('');
    const [subtitles, setSubtitles] = useState([]);
    const router = useRouter();
    const { PRIME } = events;
    useEffect(() => {
        setSubtitles(PRIME?.[0]?.responseBody?.subtitleUrls?.filter(subtitle => subtitle.displayName.toLowerCase().includes(search.toLowerCase()) || !search));
    }, [search, PRIME])
    if (!events) return null;
    const current = PRIME?.[0]?.responseBody
    const { catalog, images, family } = current?.catalogMetadata || {}
    const tvAncestors = family?.tvAncestors
    const season = tvAncestors?.find(tvAncestor => tvAncestor.catalog.type === 'SEASON')?.catalog?.seasonNumber
    const episode = catalog?.episodeNumber
    return <div className={styles.container}>
        <div className={styles.title}>
            <ShowIf condition={!!season}>
                {` ${season}`}
                {`.${episode} - `}
            </ShowIf>
            {current?.catalogMetadata?.catalog?.title}
        </div>
        <Image src={current?.catalogMetadata?.images.imageUrls.title} alt={current?.catalogMetadata?.catalog?.title} width={1000} height={1000} className={styles.image} />
        <div className={styles.search}>
            <TextSearch
                onChange={(e) => { setSearch(e.target.value) }}
                name="Busque por idioma"
                placeholder="Pesquise por idioma"
                title=""
            />
        </div>
        <div className={styles.subtitles}>
            {subtitles?.map((subtitle) => (
                <div key={subtitle.url} className={styles.subtitle} onClick={() => {
                    setLanguage(subtitle.languageCode);
                    router.push(ROUTES.EXTENSION_GAMES());
                }}>
                    {subtitle.displayName}
                </div>))
            }
        </div>
        <SelectLanguage className={styles.language} />
    </div>
}