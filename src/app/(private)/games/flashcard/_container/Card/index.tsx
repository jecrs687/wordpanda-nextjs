import clsx from "clsx";
import { useState } from "react";
import styles from './Card.module.scss';
export default function Card({ front, back }) {
    const [side, setSide] = useState<boolean>();

    function handleClick() {
        setSide((side) => !side);
    }
    return (
        <div className={clsx(styles.card, {
            [styles.flipped]: !side,
        })} onClick={handleClick}>
            <div className={styles.front}>vaila</div>
            <div className={styles.back}>teste</div>
        </div>
    );
}
