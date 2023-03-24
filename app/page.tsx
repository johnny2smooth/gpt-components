import { Inter } from "next/font/google";
import styles from "./page.module.css";
import CanvasDrawer from "./canvas-drawer";
import { supabase } from "./supabase";
import Image from "next/image";
import TypingEffect from "./TypingEffect";

export const revalidate = 0;
export default async function Home() {
  const { data } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET!)
    .list();

  return (
    <main className={styles.main} style={{ background: "black" }}>
      <TypingEffect
        textContent="hello my friend! Am I gradually rendered? Or not so much???"
        typingSpeed={50}
      />
      <CanvasDrawer />
      <div className="stack px-4 ">
        <div className="flex flex-wrap gap-4 justify-start items-center">
          {data?.map((file) => (
            <Image
              key={file.id}
              src={
                "https://tkcaaymkxvrpewbwspwh.supabase.co/storage/v1/object/public/friend-drawings/" +
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
