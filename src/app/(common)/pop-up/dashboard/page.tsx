"use client";
import { fetchClient } from '@services/fetchClient';
import UserProfile from 'src/app/(private)/profile/_container/Profile';
import Loading from 'src/app/loading';
import useSWR from 'swr';

export default function Page() {

  const { data: {
    errors,
    user
  } = {}, error } = useSWR<any>(
    "/api/user", {
    fetcher: fetchClient("GET")
  }
  );
  console.log({
    errors,
    user
  })
  if (!user) return <Loading />
  return <div>
    <UserProfile user={user} />
  </div>
}
