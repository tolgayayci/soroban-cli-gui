import React, { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import Layout from "components/layout";
import SorobanNotInstalled from "components/common/is-soroban-installed";
import { ThemeProvider } from "components/theme-provider";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const [isSorobanInstalled, setIsSorobanInstalled] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    async function checkIsSorobanInstalled() {
      try {
        const result = await window.sorobanApi.isSorobanInstalled();
        setIsSorobanInstalled(result);
      } catch (error) {
        setIsSorobanInstalled(false);
      }
    }

    if (typeof window !== "undefined") {
      checkIsSorobanInstalled();
    }
  }, []);

  if (isSorobanInstalled === null) {
    return null;
  } else if (isSorobanInstalled) {
    return (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    );
  } else {
    return <SorobanNotInstalled />;
  }
}

export default MyApp;
