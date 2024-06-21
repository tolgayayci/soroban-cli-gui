import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import ContractEventDetail from "components/events/event-detail";

function ContractEventsDetailPage() {
  const router = useRouter();
  const { path } = router.query;

  return (
    <React.Fragment>
      <Head>
        <title>Contract Events - Soroban</title>
      </Head>
      <ContractEventDetail eventDetail={path as string} />
    </React.Fragment>
  );
}

export default ContractEventsDetailPage;
