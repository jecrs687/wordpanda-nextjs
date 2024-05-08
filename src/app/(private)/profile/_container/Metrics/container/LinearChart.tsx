"use client";
import dynamic from "next/dynamic";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function LinearChart({
    languages,
    data
}: {
    languages: any,
    data: any

}) {
    return <ResponsiveContainer width="100%" height="100%">
        <LineChart
            width={500}
            height={300}
            data={data}
            title="Palavras por dia"
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {
                languages.map((language) => {
                    return (
                        <Line key={language.language.language}
                            type="monotone"
                            dataKey={
                                language.language.language
                            }
                            stroke={
                                `#${Math.floor(Math.random() * 16777215).toString(16)}`
                            }
                        />
                    )
                })
            }
        </LineChart>
    </ResponsiveContainer>
}

export default dynamic(() => Promise.resolve(LinearChart), {
    ssr: false
})