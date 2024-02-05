"use client";
import { useChannels } from '@hooks/useChannels';
import styles from './page.module.scss';

export default function Page() {
  const { web } = useChannels();
  localStorage.setItem('wordPand_token', "true");
  return (
    <div className={styles.main}>
      <button
        onClick={() => {

          const broad = new BroadcastChannel('iframe');
          broad.postMessage('teste');
          parent.postMessage('teste', '*');

        }}
      >
        {localStorage.getItem('wordPand_token')}
      </button>
    </div>
  )
}
