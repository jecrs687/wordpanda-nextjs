import { getUserWithWords } from '@backend/domain/actions/User/getUserWithWords.action';
import styles from './Metrics.module.scss';

export const dynamic = 'force-dynamic'
export default function Metrics({ errors, user }: {
  errors?: any,
  user: Awaited<ReturnType<typeof getUserWithWords>>['user']
}) {
  const metrics = user.userLanguages?.map((lang) =>
  ({
    ...lang,
    metric: lang.userWords?.reduce(
      (acc, curr) => {
        return {
          errors: acc.errors + curr.errors,
          attempts: acc.attempts + curr.attempts,
          mostShowed: acc?.mostShowedAttempts < curr.attempts ? curr?.word.word : acc.mostShowed,
          mostShowedAttempts: acc?.mostShowedAttempts < curr.attempts ? curr?.attempts : acc.mostShowedAttempts,
          mostWrong: acc?.mostWrongAttempts < curr.errors ? curr?.word.word : acc.mostWrong,
          mostWrongAttempts: acc?.mostWrongAttempts < curr.errors ? curr?.errors : acc.mostWrongAttempts,
        }
      }, {
      errors: 0,
      attempts: 0,
      mostShowed: '',
      mostShowedAttempts: 0,
      mostWrongAttempts: 0,
      mostWrong: '',
    })
  })
  )
  return (
    <main className={styles.main}>

      <div className={styles.profile}>
        <h1>Olá, {user.firstName} {user.lastName}!</h1>
        <div className={styles.container}>
          <div className={styles.languages}>
            {/* <div className={styles.input}>
              Score: {user.score}
            </div> */}
            {
              metrics?.map(({ metric, ...lang }, index) => {

                const listOfMetrics = [
                  {
                    name: 'Em aprendizado',
                    value: lang._count.userWords
                  },
                  {
                    name: 'Total de treinos',
                    value: metric.attempts
                  },
                  {
                    name: 'Palavra mais vista',
                    value: metric.mostShowed
                  },
                  {
                    name: 'Palavra mais difícil',
                    value: metric.mostWrong
                  },
                  {
                    name: 'Total de erros',
                    value: metric.errors
                  }
                ]
                return <details
                  className={styles.language}
                  key={index}
                >
                  <summary
                    className={styles.title}
                  >
                    {lang.language.language} - {lang.language.code?.split('-')[0]}
                  </summary>
                  <div className={styles.metrics}>
                    {
                      listOfMetrics.map((metric, index) => {
                        return <div className={styles.metric} key={index}>
                          <div className={styles.name}>{metric.name}</div>
                          <div className={styles.value}>{metric.value}</div>
                        </div>
                      })
                    }
                  </div>
                </details>
              })
            }

          </div>
        </div>

      </div>
    </main >
  );
}
