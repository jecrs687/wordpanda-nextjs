'use client';
import { getWords } from '@backend/domain/actions/Word/getWords.action';
import { fetchClient } from '@services/fetchClient';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';
import { GamesFlashcardPostRequest, GamesFlashcardPostResponse } from 'src/app/api/games/flashcard/route';
import { WordWithTranslationsAndUserWords, WordsPostResponse } from 'src/app/api/words/route';
import Loading from 'src/app/loading';
import useSWRMutation from 'swr/mutation';
import Card from '../Card';
import DropSide from '../DropSide';
import styles from './Body.module.scss';
type apiRequest = {
    words: { word: string }[],
    lang: string
}
export const FlashBody = ({ words, lang, mediaId }: {
    words: { word: string }[],
    lang: string,
    mediaId?: string
}) => {
    const [{ data: wordsList, err: wordsListErr, msg: wordsListMsg }, setWordsList] = useState<WordsPostResponse>({})
    const [isLoading, setIsLoading] = useState(false)
    const [wordsCards, setWordsCards] = useState<WordWithTranslationsAndUserWords[]>([])
    const { data:
        {
            data: flashcard,
            err: flashcardErr,
            msg: flashcardMsg
        } = {},
        error: flashcardError,
        isMutating: flashcardIsMutating,
        trigger: flashcardTrigger
    } = useSWRMutation<
        GamesFlashcardPostResponse,
        Error,
        string,
        GamesFlashcardPostRequest
    >('https://lanboost-04a196880f88.herokuapp.com/api/games/flashcard', fetchClient("POST"))
    const [index, setIndex] = useState(0)
    const updateList = useCallback(async () => {
        const response = await getWords({
            ...(mediaId ? { mediaId } : { words: words.slice(index, index + 20).map(x => x.word) }),
            limit: 20,
            language: lang,
        })
        setIndex(index + 20)
        setWordsCards(response?.data?.words)
        setWordsList(response)
    }, [index, lang, mediaId, words])
    useEffect(() => {
        if (!wordsCards.length) updateList()
    }, [wordsCards, updateList])
    useEffect(() => {
    }, [wordsList, wordsCards])


    const slice = wordsCards?.slice(0, 20) || [];
    const [
        { isDragging },
        drag
    ] = useDrag(() => ({
        type: 'card',
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
            test: monitor.didDrop()
        }),
    }))
    if (!wordsList) return <Loading />
    const current = slice[0];

    const moveToEndItem = () => {
        setWordsCards(rest => ([
            ...rest?.slice(1),
            rest[0]
        ]))
    }
    const removeItem = () => {
        setWordsCards(rest => ([
            ...rest?.slice(1),
        ]))
    }
    const handleCorrect = async () => {
        const item = current;
        removeItem()

        const { data } = await flashcardTrigger({
            wordId: current.id,
            hard: false,
            mediaId
        })
        const { userWords } = data
        if (wordsCards.length) {
            if (userWords.errors / userWords.attempts > 0.5)
                setWordsCards((rest) => [
                    ...rest,
                    item
                ])
        }
    }
    const handleWrong = () => {
        if (wordsCards.length)
            moveToEndItem()
        else
            removeItem()
        flashcardTrigger({
            wordId: current.id,
            hard: true,
            mediaId
        })


    }
    return (
        <div className={styles.flashcard_container}>
            <div className={styles.sides}>
                <div className={styles.side}>
                    <DropSide
                        className={
                            clsx(styles.side, styles.wrong)
                        }
                        onDrop={handleWrong}
                        styleOnDragOver={{
                            backgroundColor: 'red',
                        }}
                    />
                    <div className={styles.side} />

                </div>
                <div className={styles.side} >
                    <div className={styles.side} />
                    <DropSide
                        className={clsx(
                            styles.side,
                            styles.correct
                        )}
                        onDrop={handleCorrect}
                        styleOnDragOver={{
                            backgroundColor: 'green',
                        }}
                    />
                </div>
            </div>
            <div className={styles.cards}>
                {
                    slice.map((word, index) => (
                        <div key={index}
                            className={
                                clsx(
                                    styles.card, styles[`card-key-${index}`],
                                )
                            }
                            style={isDragging && index === 0 ?
                                {
                                    opacity: 0.01,
                                    cursor: 'move',
                                    filter: 'blur(2px)',
                                } : undefined

                            }
                            ref={
                                index === 0 ? drag : undefined
                            }>
                            <Card
                                word={word}
                                key={index}
                            />
                        </div>
                    ))
                }
            </div>

        </div>
    )
};