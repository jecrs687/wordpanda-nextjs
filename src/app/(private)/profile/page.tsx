import { getUser } from '@actions/User/getUser.action';
import UserProfile from './_container/Profile';

export const dynamic = 'force-dynamic'
export default async function Page() {
  const { errors, user } = await getUser();

  return (
    <UserProfile errors={errors} user={user} />
  );
}
