import React from "react";
import Head from "next/head";
import LabComponent from "components/lab/Lab";

function Lab() {
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
