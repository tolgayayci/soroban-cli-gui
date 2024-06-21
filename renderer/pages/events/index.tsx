import React from "react";
import Head from "next/head";
import EventsComponent from "components/events/Events";

function Events() {
  return (
    <React.Fragment>
      <Head>
        <title>Events - Soroban</title>
      </Head>
      <EventsComponent />
    </React.Fragment>
  );
}

export default Events;
