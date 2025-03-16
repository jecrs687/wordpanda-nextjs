import { getUserWithWords } from '@backend/domain/actions/User/getUserWithWords.action';
import { Suspense } from 'react';
import LoadingProfile from './_components/LoadingProfile';
import UserProfile from './_container/Profile';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const { errors, user } = await getUserWithWords();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-zinc-50 to-sky-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Suspense fallback={<LoadingProfile />}>
        <UserProfile user={user} />
      </Suspense>
    </div>
  );
}
