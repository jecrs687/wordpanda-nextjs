import UserForm from '../UserForm';
import styles from './Profile.module.scss';

export const dynamic = 'force-dynamic'
export default function UserProfile({ errors, user }) {
  return (
    <main className={styles.main}>

      <div className={styles.profile}>
        <h1>Welcome, {user.firstName} {user.lastName}!</h1>
        <div className={styles.container}>
          <UserForm
            user={user}
          />
          <div className={styles.languages}>
            <div className={styles.input}>
              Score: {user.score}
            </div>
            {
              user.userLanguages?.map((userLanguage, index) => {
                const metrics = userLanguage.userWords
                  .reduce(
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

                const listOfMetrics = [
                  {
                    name: 'Em aprendizado',
                    value: userLanguage.userWords.length
                  },
                  {
                    name: 'Total de treinos',
                    value: metrics.attempts
                  },
                  {
                    name: 'Palavra mais vista',
                    value: metrics.mostShowed
                  },
                  {
                    name: 'Palavra mais difícil',
                    value: metrics.mostWrong
                  },
                  {
                    name: 'Total de erros',
                    value: metrics.errors
                  }
                ]
                return <details
                  className={styles.language}
                  key={index}
                >
                  <summary
                    className={styles.title}
                  >
                    {userLanguage.language.language} - {userLanguage.language.code}
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
