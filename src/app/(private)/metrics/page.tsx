import { getUserWithWords } from '@backend/domain/actions/User/getUserWithWords.action';
import Metrics from './_container/Metrics';

export const dynamic = 'force-dynamic'
export default async function Page() {
  const { errors, user } = await getUserWithWords();


  return (
    <Metrics user={user} />
  );
}
