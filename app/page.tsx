"use client";
import { useEffect } from "react";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
// import { useQuickAuth } from "@coinbase/onchainkit/minikit";
import styles from "./page.module.css";
import DCAForm from "./components/DCAForm";

export default function Home() {
  const { setMiniAppReady, isMiniAppReady } = useMiniKit();

  useEffect(() => {
    if (!isMiniAppReady) {
      setMiniAppReady();
    }
  }, [setMiniAppReady, isMiniAppReady]);

  return (
    <div className={styles.container}>
      <header className={styles.headerWrapper}>
        <meta name="base:app_id" content="696af6c4c0ab25addaaaf1b9" />
        <Wallet />
      </header>

      <div className={styles.content}>
        <DCAForm />
        
        {/* Optional: Keep useful links or footer if needed later */}
      </div>
    </div>
  );
}
