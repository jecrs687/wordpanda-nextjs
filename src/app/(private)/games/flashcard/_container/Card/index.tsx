import clsx from "clsx";
import { useState } from "react";
import styles from './Card.module.scss';
export default function Card({ front, back, style }: {
    front: string | number,
    back: string | number,
    style?: React.CSSProperties,
}) {
    const [side, setSide] = useState<boolean>(true);

    function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e?.stopPropagation();
        setSide((side) => !side);
    }
    return (
        <div className={clsx(styles.card, {
            [styles.flipped]: !side,
        })} onClick={handleClick}
            style={style}
        >
            <div className={styles.front}>{front}</div>
            <div className={styles.back}>{back}</div>
        </div>
    );
}
