"use client";
import useEvents from "@hooks/useEvents";
import useWords from "@hooks/useWords";
import { MediaType } from "@prisma/client";
import { fetchClient } from "@services/fetchClient";
import { processSubtitlePrime } from "@utils/subtitle";
import { useCallback, useEffect, useState } from "react";
import { ExtensionPrimeSubtitlePostRequest, ExtensionPrimeSubtitlePostResponse } from "src/app/api/extension/prime/subtitle/route";
import useSWRMutation from "swr/mutation";


export default function SubtitleProvider() {
    const { events } = useEvents();

    const { insert } = useWords();
    const [processed, setProcessed] = useState<Set<number>>(new Set());
    const {
        trigger: subtitleTrigger,
    } = useSWRMutation<
        ExtensionPrimeSubtitlePostResponse,
        Error,
        string,
        ExtensionPrimeSubtitlePostRequest
    >('/api/extension/prime/subtitle', fetchClient("POST"))
    const captureSubtitlesPrime = useCallback(async () => {
        if (!events.PRIME.length) return;
        const notProcessedEvents = events.PRIME.filter(x => !processed.has(x.timestamp));
        if (!notProcessedEvents.length) return;
        for (const event of notProcessedEvents) {
            processed.add(event.timestamp);
            const { responseBody } = event;
            console.log({ responseBody })

            const { subtitleUrls } = responseBody;
            const TYPE = {
                "TV SHOW": MediaType.SERIE,
                "MOVIE": MediaType.MOVIE,
                "SEASON": MediaType.SERIE,
            }

            for (const subtitle of subtitleUrls) {
                const { languageCode, url } = subtitle;
                const words = await processSubtitlePrime(url);
                if (words.words.length < 20) return;
                insert(words.words, languageCode);

                subtitleTrigger(
                    {
                        links: event.responseBody?.subtitleUrls?.map(subtitle => ({
                            url: subtitle.url,
                            languageCode: subtitle.languageCode
                        })),
                        platformLink: document.referrer,
                        name: event.responseBody?.catalogMetadata?.catalog?.title,
                        title: event.responseBody?.catalogMetadata?.family?.tvAncestors?.find(x => x.catalog.type === "SHOW")?.catalog?.title,
                        platform: "PRIME",
                        episode: event.responseBody?.catalogMetadata?.catalog?.episodeNumber,
                        season: event.responseBody?.catalogMetadata?.family?.tvAncestors?.find(x => x.catalog.type === "SEASON")?.catalog?.seasonNumber,
                        image: event.responseBody?.catalogMetadata?.images?.imageUrls?.title,
                        type: TYPE[event.responseBody?.catalogMetadata?.catalog?.type] || MediaType.VIDEO,
                        mediaId: event.responseBody?.catalogMetadata?.catalog?.id,
                        seasonId: event.responseBody?.catalogMetadata?.family?.tvAncestors?.find(x => x.catalog.type === "SEASON")?.catalog?.id,
                        serieId: event.responseBody?.catalogMetadata?.family?.tvAncestors?.find(x => x.catalog.type === "SHOW")?.catalog?.id,
                    }
                );
                setProcessed(new Set([...processed, event.timestamp]));
            }

        }
    }, [events.PRIME, insert, processed, subtitleTrigger])
    useEffect(() => {
        captureSubtitlesPrime()
    }, [captureSubtitlesPrime, events.PRIME])
    return <></>
}