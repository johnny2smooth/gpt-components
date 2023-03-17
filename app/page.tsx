import { Inter } from "next/font/google";
import styles from "./page.module.css";
import CanvasDrawer from "./canvas-drawer";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={styles.main}>
      <CanvasDrawer />
    </main>
  );
}
