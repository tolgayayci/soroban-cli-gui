import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import ContractEventDetail from "components/events/event-detail";

function ContractEventsDetailPage() {
  const router = useRouter();
  const { path, rpcUrl } = router.query;

  return (
    <React.Fragment>
      <Head>
        <title>Contract Events - Soroban</title>
      </Head>
      <ContractEventDetail startLedger={path as string} rpcUrl={rpcUrl as string} />
    </React.Fragment>
  );
}

export default ContractEventsDetailPage;
