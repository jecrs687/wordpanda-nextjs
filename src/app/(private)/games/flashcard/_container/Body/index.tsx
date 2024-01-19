'use client';
import useEvents from '@hooks/useEvents';
import { useDrag } from 'react-dnd';
import Card from '../Card';
import styles from './Body.module.scss';
export const FlashBody = () => {
    const { events: { words } } = useEvents();
    const slice = words.words.slice(0, 1);
    const [
        { isDragging },
        drag
    ] = useDrag(() => ({
        type: 'card',
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }))
    return (
        <div className={styles.body}>
            {
                slice.map((word, index) => (
                    <div key={index} className={styles.card} ref={
                        index === 0 ? drag : undefined
                    }>
                        <Card
                            back={word.word}
                            front={word.count}
                            key={index}
                        />
                    </div>
                ))
            }
        </div>
    )
};