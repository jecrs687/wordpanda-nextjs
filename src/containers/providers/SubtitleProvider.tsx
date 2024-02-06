"use client";
import useEvents from "@hooks/useEvents";
import { fetchClient } from "@services/fetchClient";
import { getText, orderWords, ttml2ToJson } from "@utils/subtitle";
import { useCallback, useEffect } from "react";
import { ExtensionPrimeSubtitlePostRequest, ExtensionPrimeSubtitlePostResponse } from "src/app/api/extension/prime/subtitle/route";
import useSWRMutation from "swr/mutation";


export default function SubtitleProvider() {
    const { insertLanguage, events } = useEvents();
    const {
        trigger: subtitleTrigger,
    } = useSWRMutation<
        ExtensionPrimeSubtitlePostResponse,
        Error,
        string,
        ExtensionPrimeSubtitlePostRequest
    >('/api/extension/prime/subtitle', fetchClient("POST"))
    const captureSubtitles = useCallback(async () => {
        console.log({ events })
        if (events.subtitles_urls && !Object.keys(events.words).length) {
            const { name, image, links } = events.subtitles_urls
            if (links) {
                if (links[0].includes("https://cf-timedtext.aux.pv-cdn.net"))
                    subtitleTrigger({ links, name, image, platform: "Prime Video" })
            }
            for (const link of events?.subtitles_urls?.links) {
                const something = await getText(link)
                const jsonFromTTML = ttml2ToJson(something)
                const json = jsonFromTTML.subtitles
                const words = await orderWords(json)
                console.log({ words, jsonFromTTML })

                insertLanguage(jsonFromTTML.lang, { words, jsonFromTTML })
            }
        }
    }, [events, insertLanguage])
    useEffect(() => {
        captureSubtitles()
    }, [captureSubtitles, events])
    return <></>
}