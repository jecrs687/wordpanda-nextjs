import clsx from "clsx";
import { useState } from "react";
import { WordWithTranslations } from "src/app/api/words/route";
import styles from './Card.module.scss';
export default function Card({ word, style }: {
    word: WordWithTranslations
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
            style={{
                background:
                    word.userWords.length == 0 ? 'blue' :
                        word.userWords?.[0]?.errors / word.userWords?.[0]?.attempts > 0.3 ? 'red' :
                            'green'

            }}
        >
            <div className={styles.front}>
                <h3>
                    {
                        word.word
                    }
                </h3>
                <p>
                    {
                        word?.translations?.[0]?.meaning
                    }
                </p>
            </div>
            <div className={styles.back}>
                <div className={styles.translations}>

                    {
                        word?.translations?.[0]?.translations
                            .map(({ word }, index) => <h3 key={index}>
                                {word}
                            </h3>

                            )
                    }
                </div>

                {
                    word?.translations?.[0]?.meaningTranslated
                }
            </div>
        </div>
    );
}
