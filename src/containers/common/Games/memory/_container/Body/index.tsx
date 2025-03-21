'use client';
import { memoryGameAction } from '@backend/domain/actions/Games/memory.action';
import { getWords } from '@backend/domain/actions/Word/getWords.action';
import LoaderSpinner from '@core/LoaderSpinner';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { WordsPostResponse } from 'src/app/api/words/route';
import Loading from 'src/app/loading';
import styles from './Body.module.scss';
type WordMemory = {
    word: string;
    trans?: string[];
    id: string;
    position?: number | undefined;
    translatePosition?: number | undefined;
    isUsed?: boolean;
    wrong?: boolean;
    wrongTranslate?: boolean;
    correct?: boolean;
    wasWrong?: boolean;
}
const QUANT = 5;
export const Body = ({ words, lang, mediaId }: { words: { word: string }[], lang: string, mediaId?: string }) => {
    const [firstSelected, setFirstSelected] = useState<string>()
    const [secondSelected, setSecondSelected] = useState<string>()
    const [wordsFiltered, setWordsFiltered] = useState<Array<WordMemory>>([])
    const [wordsShowed, setWordsShowed] = useState<WordMemory[]>([])
    const [index, setIndex] = useState(0)
    const [{ data: wordsList, err: wordsListErr, msg: wordsListMsg }, setWordsList] = useState<WordsPostResponse>({})
    const [loading, setLoading] = useState(false)

    const updateList = useCallback(async () => {
        setLoading(true)
        const wordsResponse = await getWords({
            ...(mediaId ? { mediaId } : { words: words.slice(index, index + 20).map(x => x.word) }),
            limit: 20,
            language: lang,
        })
        setWordsList(wordsResponse)
        setIndex(index + 20)
        const wordsResponseFiltered = wordsResponse?.data?.words?.filter(({ translations }) => translations?.[0]?.translations?.length)

        const wordsWithoutRepetitions = [];
        const allTranslations: string[] = []
        wordsResponseFiltered?.forEach(({ translations }, index) => {
            const word = wordsResponseFiltered[index]
            const translation = translations[0].translations
            if (wordsWithoutRepetitions.includes(word.word.toLowerCase())) return;
            const trans = translation.map(({ word }) => word)
            if (allTranslations.some(x => trans.includes(x))) return;
            wordsWithoutRepetitions.push(word.word.toLowerCase());
            allTranslations.push(...trans)
        })

        setWordsFiltered(
            prev =>
                wordsResponseFiltered.filter(({ word }) => wordsWithoutRepetitions.includes(word.toLowerCase()))
                    .map(({ word, translations, id }) => ({
                        word,
                        trans: translations[0].translations.map(({ word }) => word),
                        id,
                    }))
        )
        setLoading(false)
    }, [mediaId, words, index, lang])
    useEffect(() => {
        if (!wordsFiltered.length) {
            updateList()
        } else {
            const allUsed = wordsFiltered?.filter(({ isUsed }) => isUsed).length
            const allShowedUsed = wordsShowed?.filter(({ isUsed }) => isUsed).length
            const needUpdate = wordsFiltered?.length - allUsed

            if (allShowedUsed == QUANT && needUpdate < QUANT) updateList()
        }
    }, [
        wordsFiltered,
        updateList,
        wordsShowed
    ])



    const generateList = (items: WordMemory[]) => {
        const list: WordMemory[] = [];
        const used: number[] = Array.from({ length: QUANT }).map((_, index) => index
            + 1)
        const usedTranslate: number[] = Array.from({ length: QUANT }).map((_, index) => index + 1)
        items.forEach((item) => {
            if (item.position) {
                const index = used.indexOf(item.position)
                if (index !== -1) used.splice(index, 1)
                list.push(item)
            }
            if (item.translatePosition) {
                const index = usedTranslate.indexOf(item.translatePosition)
                if (index !== -1) usedTranslate.splice(index, 1)
            }
        })

        items = items.filter(({ isUsed, position }) => !isUsed && !position)

        while (used.length) {
            const index = Math.floor(Math.random() * used.length)
            const index2 = Math.floor(Math.random() * usedTranslate.length)
            const item = items.pop()
            item.position = used[index]
            item.translatePosition = usedTranslate[index2]
            used.splice(index, 1)
            usedTranslate.splice(index2, 1)
            list.push(item)
        }
        return list.sort((a, b) => a.position - b.position)
    }
    const generate = useCallback((wordsDto: WordMemory[]) => {
        wordsDto = wordsDto.map((word) =>
            !word.isUsed ? word : { ...word, position: undefined, translatePosition: undefined }
        )
        const list = generateList(wordsDto)
        setWordsShowed(list)
        setWordsFiltered(prev => prev.map(word => {
            const value = list.find(({ id }) => id === word.id)
            if (word.isUsed) {
                return {
                    ...word,
                    position: undefined,
                    translatePosition: undefined,
                }
            }
            if (value) return { ...word, ...value }
            return word
        }))
    }, []
    )
    useEffect(() => {
        if (!wordsFiltered.length) return
        if (wordsFiltered?.filter(({ isUsed }) => !isUsed).length < QUANT) return

        if (!wordsShowed.length)
            return generate(wordsFiltered)
        if (wordsShowed?.filter(({ isUsed }) => isUsed).length > QUANT / 2)
            setTimeout(() => {
                generate(wordsFiltered)
            }, 1000)

    }, [wordsFiltered, wordsShowed, generate])

    const check = useCallback((word, first, second) => {
        if (first === second) {
            if (word.id === first) return { ...word, isUsed: true, correct: true }
        }
        else {
            if (word.id === first) return { ...word, wrong: true, wasWrong: true }
            if (word.id === second) return { ...word, wrongTranslate: true, wasWrong: true }
        }
        return word
    }, [])
    const removeWrong = useCallback((word, first, second) => {
        if (first === second) {
            if (word.id === first) return { ...word, wrong: false }
        }
        else {
            if (word.id === first || word.id === second) return { ...word, wrong: false, wrongTranslate: false }
        }
        return word
    }, [])
    useEffect(() => {
        if (!wordsShowed.length) return;
        if (!firstSelected || !secondSelected) return;
        setFirstSelected(undefined)
        setSecondSelected(undefined)
        const [first, second] = [firstSelected, secondSelected]
        memoryGameAction({
            wordId: first,
            hard: first !== second,
            mediaId
        })
        setWordsShowed(prev =>
            prev.map(word => check(word, first, second))
        )
        setWordsFiltered(prev =>
            prev.map(word => check(word, first, second))
        )
        setTimeout(() => {
            setWordsShowed(prev =>
                prev.map(word => removeWrong(word, first, second))
            )
            setWordsFiltered(prev =>
                prev.map(word => removeWrong(word, first, second))
            )
        }, 400)

    }, [
        firstSelected,
        secondSelected,
        wordsShowed,
        check,
        removeWrong,
        mediaId
    ])

    if (!wordsList || !wordsFiltered) return <Loading />


    return (
        <div className={styles.memory_container}>
            {
                loading && <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 100
                    }}>
                    <LoaderSpinner />
                </div>
            }
            <div className={styles.sides}>
                <div className={styles.side}>
                    {
                        wordsShowed?.sort(
                            (a, b) => a.position - b.position
                        ).map(({ id, word, trans, position, wrong, correct, wasWrong }, index) => {
                            return (
                                <div
                                    key={index}
                                    className={clsx({
                                        [styles.card]: true,
                                        [styles.fadeIn]: !wasWrong,
                                        [styles.wrong]: wrong,
                                        [styles.correct]: correct,
                                        [styles.selected]: firstSelected === id
                                    })}
                                    onClick={() => {
                                        if (!correct)

                                            setFirstSelected(id)
                                    }}
                                >
                                    <div className={styles.word}>
                                        <p>{word}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className={styles.side}>
                    {
                        wordsShowed?.sort(
                            (a, b) => a.translatePosition - b.translatePosition
                        )?.map(({ id, word, trans, position, wrong, correct, wrongTranslate, wasWrong }, index) => {
                            return (
                                <div
                                    key={index}
                                    className={
                                        clsx({
                                            [styles.card]: true,
                                            [styles.fadeIn]: !wasWrong,
                                            [styles.wrong]: wrongTranslate,
                                            [styles.correct]: correct,
                                            [styles.selected]: secondSelected === id
                                        })
                                    }
                                    onClick={() => {
                                        if (!correct)
                                            setSecondSelected(id)
                                    }}
                                >
                                    <div className={styles.word}>
                                        <p>{trans.join(', ')}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

        </div>
    )
};