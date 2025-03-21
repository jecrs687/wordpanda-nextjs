
'use client';
import colors from "@styles/modules/colors.module.scss";
import dynamic from 'next/dynamic';
const Ring = dynamic<any>(
    () => import('@ant-design/plots').then(({ Tiny }) => Tiny.Ring),
    {
        ssr: false,
    },
)
export const RingChart = ({
    percent, color, size = 120, annotations
}: {
    percent: number,
    color?: string[],
    size?: number,
    annotations?: any[]

}
) => {
    const config = {
        percent,
        width: size,
        height: size,
        color: [colors.initial, colors.fifth],
        annotations: [
            {
                type: 'text',
                style: {
                    text: `${+(percent.toFixed(2)) * 100}%`,
                    x: '50%',
                    y: '50%',
                    textAlign: 'center',
                    fontSize: Math.min(size / 5, 18),
                    fontStyle: 'bold',
                },
                colorField: '#ffffff',
            },
        ],
    };

    return <></>;
};