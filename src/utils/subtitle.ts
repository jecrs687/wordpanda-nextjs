
import { JSDOM } from "jsdom";
export async function getText(ttml2Url) {
    const values = await fetch(ttml2Url)
    const text = await values.text()
    return text;
}

export function ttml2ToJson(ttml2Text) {
    const parser = new JSDOM(ttml2Text, {
        contentType: "application/xml",
        runScripts: 'dangerously'
    })
    const ttml2Xml = parser.window.document;
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
        lang: ttml2Xml.querySelector("tt").getAttribute("xml:lang"),
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
        [word: string]: {
            count: number,
            moments: {
                begin: string,
                end: string,
                text: string
            }[]
        }
    } = {}
    let count = 0;
    for (let i = 0; i < json.length; i++) {
        const word = json[i].word;
        if (!new RegExp(/^[a-zA-Z][a-zA-Z'\-]+[a-zA-Z]$/).test(word)) continue;
        if (!words[word]) {
            words[word] = { count: 0, moments: [] }
        }
        words[word].count += 1;
        count += 1;
        words[word].moments.push({ ...json[i].moment, text: json[i].text })
    }
    let sortedWords = Object.entries(words).sort((a, b) => b[1].count - a[1].count)
    let result = sortedWords.map(([word, values], index) => ({
        word,
        ...values,
        position: index,
        percentage: (values.count / count) * 100
    }))
    return result
}
