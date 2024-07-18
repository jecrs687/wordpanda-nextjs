
import { readFileSync, writeFileSync } from "fs";
import { JSDOM } from "jsdom";
export async function getText(ttml2Url) {
    const values = await fetch(ttml2Url)
    const text = await values.text()
    return text;
}

export function ttml2ToJson(ttml2Text) {
    const parser = typeof window == "undefined" ? new JSDOM(ttml2Text, {
        contentType: "application/xml",
        runScripts: "dangerously",
    }).window.document : new window.DOMParser().parseFromString(ttml2Text, "text/xml")
    const ttml2Xml = parser;
    const json: {
        lang: string,
        version: string,
        subtitles: {
            moment: {
                begin: string,
                end: string
            },
            text: string,
            word: string
        }[]
    } = {
        lang: ttml2Xml.querySelector("tt").getAttribute("xml:lang")?.toLowerCase(),
        version: ttml2Xml.querySelector("tt").getAttribute("ttp:version"),
        subtitles: []
    };

    ttml2Xml.querySelectorAll("p").forEach(p => {
        p.textContent.split(" ").forEach(word => {
            json.subtitles.push({
                moment: {
                    begin: p.getAttribute("begin"),
                    end: p.getAttribute("end"),
                },
                text: p.textContent,
                word: word.toLowerCase()
            });
        });
    });

    return json;
}

export async function orderWords(json) {
    let words: {
        word: string
        count: number,
        moments: {
            begin: string,
            end: string,
            text: string
        }[]
    }[] = [];
    let count = 0;
    for (let i = 0; i < json.length; i++) {
        const word = json[i].word;
        if (!new RegExp(/^[a-zA-Z][a-zA-Z'\-]+[a-zA-Z]$/).test(word)) continue;
        if (!words.some(w => w.word === word))
            words.push({ word, count: 0, moments: [] })
        let index = words.findIndex(w => w.word === word)
        words[index].count += 1;
        count += 1;
        words[index].moments.push({ ...json[i].moment, text: json[i].text })
    }
    let sortedWords = words.sort((a, b) => b.count - a.count)
    let result = sortedWords.map((words, index) => ({
        ...words,
        position: index,
        percentage: (words.count / count) * 100
    }))
    return result
}


export const processSubtitlePrime = async (ttml2Url) => {
    try {
        let cache;
        const convert = ttml2Url.split("/").pop()
        try {
            cache = readFileSync(`./src/utils/subtitles/${convert}`, 'utf-8')
        } catch (e) { }
        const something = cache || await getText(ttml2Url)
        if (!cache)
            writeFileSync(`./src/utils/subtitles/${convert}`, something)
        const jsonFromTTML = ttml2ToJson(something)
        const json = jsonFromTTML.subtitles
        const words = await orderWords(json)
        return { words, jsonFromTTML }
    } catch (e) {
        const errors = readFileSync(`./src/utils/errors.json`, 'utf-8')
        const errorsJson = JSON.parse(errors)
        errorsJson.push(e)
        writeFileSync(`./src/utils/errors.json`, JSON.stringify(errorsJson, null, 2))
        console.log("Error processing subtitle")
    }
}