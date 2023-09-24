import style from './TextCard.module.scss'
import clsx from 'clsx'

export const TextCard = ({
    world,
    percentage,
    total
}: {
    world: string,
    percentage: number,
    total: number
}): React.ReactElement => {
    return (
        <div className={style.container}>
            <div className={style.container_body}>
                <h3>{world}</h3>
                <div className={style.container_body_percentage}>
                        <div
                        className={clsx( style.container_body_percentage, style.line)}
                        style={{
                            width: `${percentage}%`
                        }} />
                        <span className={style.container_body_percentage_text}>{percentage}%</span>

                </div>
                <div className={style.container_body_percentage}>
                    <div
                        className={clsx( style.container_body_percentage, style.line)}
                        style={{
                            width: `${total}%`
                        }}
                    />
                    <span className={style.container_body_percentage_text}>{total}%</span>
                </div>

            </div>
        </div>

    )
}