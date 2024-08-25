import React, { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import Layout from "components/layout";
import SorobanInstallationAlert from "components/common/is-soroban-installed";
import { ThemeProvider } from "components/theme-provider";
import "../styles/globals.css";

interface InstallationInfo {
  installed: boolean;
  type: string | null;
  version: string | null;
  error?: string;
}

function MyApp({ Component, pageProps }: AppProps) {
  const [installationInfo, setInstallationInfo] =
    useState<InstallationInfo | null>(null);

  useEffect(() => {
    async function checkInstallation() {
      if (typeof window !== "undefined" && window.sorobanApi) {
        try {
          const result = await window.sorobanApi.isSorobanInstalled();
          setInstallationInfo(result);
        } catch (error) {
          setInstallationInfo({
            installed: false,
            type: null,
            version: null,
            error:
              error.message || "An error occurred while checking installation",
          });
        }
      }
    }

    checkInstallation();
  }, []);

  if (installationInfo === null) {
    return null;
  }

  if (!installationInfo.installed) {
    return <SorobanInstallationAlert installationInfo={installationInfo} />;
  }

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
}

export default MyApp;
