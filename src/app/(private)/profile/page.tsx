import { getUserWithWords } from '@backend/domain/actions/User/getUserWithWords.action';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import UserProfile from './_container/Profile';

const LoadingProfile = dynamic(() => import('./_components/LoadingProfile'));

export default async function Page() {
  const { errors, user } = await getUserWithWords();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-zinc-100 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Suspense fallback={<LoadingProfile />}>
          <UserProfile user={user} />
        </Suspense>
      </div>
    </div>
  );
}
