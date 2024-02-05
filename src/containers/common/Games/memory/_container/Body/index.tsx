'use client';
import { fetchClient } from '@services/fetchClient';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { GamesMemoryPostRequest, GamesMemoryPostResponse } from 'src/app/api/games/memory/route';
import { WordsPostRequest, WordsPostResponse } from 'src/app/api/words/route';
import Loading from 'src/app/loading';
import useSWRMutation from 'swr/mutation';
import styles from './Body.module.scss';
type WordMemory = {
    word: string;
    trans?: string[];
    id: number;
    position?: number | undefined;
    translatePosition?: number | undefined;
    isUsed?: boolean;
    wrong?: boolean;
    wrongTranslate?: boolean;
    correct?: boolean;
    wasWrong?: boolean;
}
const QUANT = 5;
export const Body = ({ words, lang }: { words: { word: string }[], lang: string }) => {
    const [firstSelected, setFirstSelected] = useState<number>()
    const [secondSelected, setSecondSelected] = useState<number>()
    const [wordsFiltered, setWordsFiltered] = useState<Array<WordMemory>>([])
    const [wordsShowed, setWordsShowed] = useState<WordMemory[]>([])

    const { data: { data: wordsList, err: wordsListErr, msg: wordsListMsg } = {},
        error: wordsListError,
        isMutating: wordsListIsMutating,
        trigger: wordsListTrigger
    } = useSWRMutation<
        WordsPostResponse,
        Error,
        string,
        WordsPostRequest
    >('/api/words', fetchClient("POST"))
    const {
        trigger: memoryTrigger
    } = useSWRMutation<
        GamesMemoryPostResponse,
        Error,
        string,
        GamesMemoryPostRequest
    >('/api/games/memory', fetchClient("POST"))

    useEffect(() => {
        wordsListTrigger({
            words: words,
            language: lang,
        })
    }, [words, wordsListTrigger, lang])

    useEffect(() => {
        if (!wordsFiltered.length && wordsList?.words) {
            const words = wordsList?.words?.filter(({ translations }) => translations?.[0]?.translations?.length)

            const wordsWithoutRepetitions = [];
            const allTranslations: string[] = []
            words?.forEach(({ translations }, index) => {
                const word = words[index]
                const translation = translations[0].translations
                if (wordsWithoutRepetitions.includes(word.word.toLowerCase())) return;
                const trans = translation.map(({ word }) => word)
                if (allTranslations.some(x => trans.includes(x))) return;
                wordsWithoutRepetitions.push(word.word.toLowerCase());
                allTranslations.push(...trans)
            })
            setWordsFiltered(
                words.filter(({ word }) => wordsWithoutRepetitions.includes(word.toLowerCase()))
                    ?.sort(
                        ({ userWords }, { userWords: userWords2 }) => {
                            if (userWords.length > userWords2.length) return -1
                            if (userWords?.[0]?.errors / userWords?.[0]?.attempts > userWords2?.[0]?.errors / userWords2?.[0]?.attempts) return -1
                            return 1
                        }
                    )?.map(({ word, translations, id }) => ({
                        word,
                        trans: translations[0].translations.map(({ word }) => word),
                        id,
                    }))
            )
        }
    }, [wordsList, wordsFiltered])

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
        if (wordsFiltered.length && !wordsShowed.length)
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
        if (isNaN(firstSelected) || isNaN(secondSelected)) return;
        setFirstSelected(undefined)
        setSecondSelected(undefined)
        const [first, second] = [firstSelected, secondSelected]
        memoryTrigger({
            wordId: first,
            hard: first !== second,
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
        memoryTrigger
    ])

    if (wordsListIsMutating || !wordsList || !wordsFiltered) return <Loading />


    return (
        <div className={styles.body}>
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