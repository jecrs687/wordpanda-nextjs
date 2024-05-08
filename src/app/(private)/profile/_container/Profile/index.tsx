import { getUserWithWords } from '@backend/domain/actions/User/getUserWithWords.action';
import { SelectLanguage } from '@common/SelectLanguage';
import Metrics from '../Metrics';
import UserForm from '../UserForm';
import styles from './Profile.module.scss';

export const dynamic = 'force-dynamic'
export default async function UserProfile({ errors, user }: {
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
      <div className={styles.content}>
        <div className={styles.profile}>
          <h1>Olá, {user.firstName} {user.lastName}!</h1>
          <div className={styles.container}>
            <UserForm
              user={user}
            />
            <SelectLanguage
              title="Idioma do sistema"
              name='languageId'
              className={styles.select}
            />
          </div>

        </div>
        <Metrics />
      </div>
    </main >
  );
}
