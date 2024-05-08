import { TOKEN_KEY } from "@constants/CONFIGS"
import prisma from "@infra/config/database"
import { validateToken } from "@utils/token"
import { cookies } from "next/headers"
import styles from './Metrics.module.scss'
import LinearChart from "./container/LinearChart"
export default async function Metrics() {
    const { decoded } = validateToken(cookies().get(TOKEN_KEY).value)
    const userWords = await prisma.userWords.findMany({
        where: {
            userId: decoded.id
        },
        include: {
            word: true,
            userLanguage: {
                include: {
                    language: true
                }
            }
        }
    })
    const wordsByDay = userWords.reduce((acc, curr) => {
        const date = Intl.DateTimeFormat('it-IT').format(new Date(curr.createdAt))

        if (!acc[date]) {
            acc[date] = {}
        }
        if (!acc[date][curr.userLanguage.language.language]) {
            acc[date][curr.userLanguage.language.language] = {}
        }
        acc[date][curr.userLanguage.language.language][curr.word.word] = curr
        return acc
    }, {})

    const languages = await prisma.userLanguage.findMany({
        where: {
            userId: decoded.id
        },
        include: {
            language: true
        }
    })

    const linearGraph = Object.entries(wordsByDay).map((day) => {
        return {
            name: day[0],
            ...languages.reduce((acc, { language }) => {
                return {
                    ...acc,
                    [language.language]: Object.keys(day[1][language.language] || {})?.length
                }
            }, {})
        }
    })

    return (
        <div className={styles.container}>
            <h1>Métricas</h1>
            <h4>
                Palavras por dia
            </h4>
            <LinearChart languages={languages} data={linearGraph} />

        </div>
    )
}