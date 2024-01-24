import COLOR from '@styles/modules/colors.module.scss';
import { Cell, Pie, PieChart } from 'recharts';
import style from './TextCard.module.scss';
const COLORS = [COLOR.fourth, COLOR.sixth, COLOR.ninth].reverse();

export const TextCard = ({
    world,
    percentage,
    total
}: {
    world: string,
    percentage: number,
    total: number
}): React.ReactElement => {
    const data = [
        { name: 'Total', value: total },
        { name: 'Percentage', value: percentage },
        { name: 'Rest', value: 100 - total - percentage }
    ]
    return (
        <div className={style.container}>
            <div className={style.container_body}>
                <div className={style.container_body_title}>
                    <h3>{world}</h3>
                </div>
                <div className={style.container_body_chart}>
                    <PieChart width={100} height={50} >
                        <Pie
                            data={data}
                            cx={50}
                            cy={40}
                            startAngle={180}
                            endAngle={0}
                            innerRadius={25}
                            outerRadius={40}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </div>
                {/* <div className={style.container_body_percentage}>
                    <div
                        className={clsx(style.container_body_percentage, style.line)}
                        style={{
                            width: `${percentage}%`
                        }} />
                    <span className={style.container_body_percentage_text}>{percentage}%</span>

                </div>
                <div className={style.container_body_percentage}>
                    <div
                        className={clsx(style.container_body_percentage, style.line)}
                        style={{
                            width: `${total}%`
                        }}
                    />
                    <span className={style.container_body_percentage_text}>{total}%</span>
                </div> */}

            </div>
        </div>

    )
}