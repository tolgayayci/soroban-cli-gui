import React from "react";
import Head from "next/head";
import IdentitiesComponent from "components/identities/Identities";
import { trackEvent } from "@aptabase/electron/renderer";

function Settings() {
  trackEvent("identities-page-viewed");

  return (
    <React.Fragment>
      <Head>
        <title>Identities - Soroban</title>
      </Head>
      <IdentitiesComponent />
    </React.Fragment>
  );
}

export default Settings;
