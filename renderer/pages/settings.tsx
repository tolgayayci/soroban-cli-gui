import React from "react";
import Head from "next/head";
import SettingsComponent from "components/settings/Settings";
import { trackEvent } from "@aptabase/electron/renderer";

function Settings() {
  trackEvent("config-page-viewed");

  return (
    <React.Fragment>
      <Head>
        <title>Config - Soroban</title>
      </Head>
      <SettingsComponent />
    </React.Fragment>
  );
}

export default Settings;
