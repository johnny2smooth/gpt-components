import { Inter } from 'next/font/google';
import styles from './page.module.css';
import CanvasDrawer from './canvas-drawer';
import { createClient } from '@supabase/supabase-js';

const inter = Inter({ subsets: ['latin'] });

export default async function Home() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let { data: testing, error } = await supabase.from('testing').select('title');

  return (
    <main className={styles.main} style={{ background: 'black' }}>
      <pre>{JSON.stringify(error, null, 2)}</pre>
      <CanvasDrawer />
    </main>
  );
}
