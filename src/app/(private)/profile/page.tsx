import { getUser } from '@actions/User/getUser.action';
import { validateToken } from '@utils/token';
import { cookies } from 'next/headers';
import styles from './page.module.scss';

export default async function Page() {
  const { value: token } = cookies().get('token');
  const { decoded } = validateToken(token);
  const { errors, user } = await getUser(decoded.id);

  return (
    <main className={styles.main}>
      <div className={styles.profile}>
        <h1>Welcome, {user.firstName} {user.lastName}!</h1>
        <p>Email: {user.email}</p>
        <p>Level: {user.score}</p>
        <p>Phone: {user.phone}</p>

      </div>
    </main>
  );
}
