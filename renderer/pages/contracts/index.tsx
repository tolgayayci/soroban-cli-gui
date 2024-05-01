import React from "react";
import Head from "next/head";
import ContractsComponent from "components/contracts/Contracts";
import { trackEvent } from "@aptabase/electron/renderer";

function Contracts() {
  trackEvent("contracts-page-viewed");

  return (
    <React.Fragment>
      <Head>
        <title>Contracts - Soroban</title>
      </Head>
      <ContractsComponent />
    </React.Fragment>
  );
}

export default Contracts;
