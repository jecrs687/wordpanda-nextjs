'use client';
import { useCallback, useEffect, useState } from 'react';
import { WordWithTranslationsAndUserWords } from 'src/app/api/words/route';

import { memoryGameAction } from '@backend/domain/actions/Games/memory.action';
import { quizGameAction } from '@backend/domain/actions/Games/quiz.action';
import { getWords } from '@backend/domain/actions/Word/getWords.action';
import { WordGameQuiz } from '@prisma/client';
import clsx from 'clsx';
import Loading from 'src/app/loading';
import styles from './Body.module.scss';

export const Body = ({ words, lang, mediaId }: { words: { word: string }[], lang: string, mediaId?: string }) => {
    const [quizList, setQuizList] = useState<WordGameQuiz[]>([])
    const [index, setIndex] = useState<number>(0)
    const [option, setOption] = useState<WordGameQuiz & { options: { value: string, correct: boolean }[] }>()
    const [selected, setSelected] = useState<number>(undefined)
    const [allWords, setAllWords] = useState<WordWithTranslationsAndUserWords[]>([])

    const updateWords = useCallback(async () => {
        const response = await getWords({
            language: lang,
            ...(mediaId ? { mediaId } : { words: words.slice(index, index + 20).map(x => x.word) }),
            limit: 20
        })
        setAllWords(prev => [...prev, ...response.data.words])
    }, [mediaId, words, index, lang])

    useEffect(() => {
        if (index === allWords.length) updateWords();
    }, [
        index,
        allWords,
        updateWords
    ])
    const getNewQuiz = useCallback(async () => {
        const response = await quizGameAction({
            words: allWords.map(word => word.id).slice(
                quizList.length,
                quizList.length + 4
            ),
        })

        const quiz = response.data.words.map(({ wordGameQuiz }) => wordGameQuiz).flat()
        setQuizList(prev => [...prev, ...quiz])

    }, [allWords, quizList])
    useEffect(() => {
        if (!allWords.length) return;
        if (index === allWords.length) return;
        if (index + 4 > quizList.length) getNewQuiz();
    }, [allWords, index, getNewQuiz, quizList])

    useEffect(() => {
        if (!quizList.length) return;
        if (!quizList[index]) return
        const current = quizList[index]
        const options: any = current.options?.map((value, index) => ({
            value,
            correct: current.answer === value
        }))
        const findCorrect = options.find((option: { correct: boolean }) => option.correct)
        if (!findCorrect) {
            options.pop();
            options.push({ value: current.answer, correct: true })
        }
        setOption({ ...current, options: options?.sort(() => Math.random() - 0.5) })
    }, [index, quizList])
    if (!allWords?.length || !quizList.length) return <Loading />


    return (
        <div className={styles.quiz_container}>
            <div className={styles.quiz}>
                <div className={styles.quiz__word}>
                    {
                        allWords?.find(word => word.id === quizList[index]?.wordId)?.word
                    }
                </div>
                <div className={styles.quiz__question}>
                    {quizList[index]?.phrase}
                </div>
                <div className={styles.quiz__answers}>
                    {option?.options?.map((answer: {
                        value: string,
                        correct: boolean
                    }, i) => (
                        <button
                            key={i}

                            onClick={() => {
                                memoryGameAction({
                                    wordId: quizList[index].wordId,
                                    hard: !answer.correct,
                                    mediaId
                                })
                                setSelected(i)
                                setTimeout(() => {
                                    setSelected(undefined)
                                    if (answer.correct)
                                        setIndex(prev => prev + 1)
                                }, 1000)

                            }}
                            className={clsx(
                                styles.quiz__answer,
                                {
                                    [styles.quiz__answer__correct]: selected === i && answer.correct,
                                    [styles.quiz__answer__wrong]: selected === i && !answer.correct,
                                    [styles.quiz__answer__selected]: selected === i
                                }
                            )}
                        >
                            {answer.value}
                        </button>
                    ))}

                </div>
            </div>
        </div>
    )
};