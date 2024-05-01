import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import ContractDetail from "components/contracts/contract-detail";
import { trackEvent } from "@aptabase/electron/renderer";

function ContractDetailPage() {
  const router = useRouter();
  const { path } = router.query;

  trackEvent("contract-detail-page-viewed");

  return (
    <React.Fragment>
      <Head>
        <title>Contract Actions - Soroban</title>
      </Head>
      <ContractDetail projectPath={path as string} />
    </React.Fragment>
  );
}

export default ContractDetailPage;
