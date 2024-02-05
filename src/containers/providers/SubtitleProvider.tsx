"use client";
import useEvents from "@hooks/useEvents";
import { getText, orderWords, ttml2ToJson } from "@utils/subtitle";
import { useCallback, useEffect } from "react";


export default function SubtitleProvider() {
    const { insertLanguage, events } = useEvents();
    const captureSubtitles = useCallback(async () => {
        console.log({ events })
        if (events.subtitles_urls && !Object.keys(events.words).length) {
            for (const link of events?.subtitles_urls?.links) {
                const something = await getText(link)
                const jsonFromTTML = ttml2ToJson(something)
                const json = jsonFromTTML.subtitles
                const words = await orderWords(json)
                insertLanguage(jsonFromTTML.lang, { words, jsonFromTTML })
            }
        }
    }, [events, insertLanguage])
    useEffect(() => {
        captureSubtitles()
    }, [captureSubtitles, events])
    return <></>
}