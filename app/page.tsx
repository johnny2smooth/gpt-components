import styles from './page.module.css';
import CanvasDrawer from './canvas-drawer';
import { supabase } from './supabase';
import Image from 'next/image';

// export const revalidate = 0;
export default async function Home() {
  const { data } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET!)
    .list();

  return (
    <main
      className={`${styles.main} font-mono`}
      style={{ background: 'black' }}
    >
      <CanvasDrawer />
      <div className="stack w-[90vw] ">
        <div className="flex flex-wrap gap-4 justify-start items-center">
          <p className="text-xl font-mono">The Gallery of Masterpieces</p>
          {data?.map((file) => (
            <Image
              key={file.id}
              src={
                'https://tkcaaymkxvrpewbwspwh.supabase.co/storage/v1/object/public/friend-drawings/' +
                file.name
              }
              alt={file.name}
              width={100}
              height={100}
              className="h-auto w-auto drawn-border"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
