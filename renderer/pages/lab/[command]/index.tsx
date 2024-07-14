import React from "react";
import Head from "next/head";
import LabComponent from "components/lab/Lab";
import { trackEvent } from "@aptabase/electron/renderer";

function Lab() {
  trackEvent("lab-page-viewed");

  return (
    <React.Fragment>
      <Head>
        <title>Lab - Soroban</title>
      </Head>
      <LabComponent />
    </React.Fragment>
  );
}

export default Lab;
