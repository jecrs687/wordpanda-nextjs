import { getUser } from '@actions/User/getUser.action';
import UserProfile from './_container/Profile';

export const dynamic = 'force-dynamic'
export default async function Page() {
  const { errors, user } = await getUser({
    userWords: {
      include: {
        word: true
      }
    }
  });
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
    <UserProfile errors={errors} user={user} metrics={metrics} />
  );
}
