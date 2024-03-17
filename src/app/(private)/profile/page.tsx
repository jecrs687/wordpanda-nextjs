import { getUserWithWords } from '@backend/domain/actions/User/getUserWithWords.action';
import UserProfile from './_container/Profile';

export const dynamic = 'force-dynamic'
export default async function Page() {
  const { errors, user } = await getUserWithWords();


  return (
    <UserProfile user={user} />
  );
}
