import UserForm from '../UserForm';
import styles from './Profile.module.scss';

export const dynamic = 'force-dynamic'
export default function UserProfile({ errors, user, metrics }) {
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
                    {lang.language.language} - {lang.language.code}
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
