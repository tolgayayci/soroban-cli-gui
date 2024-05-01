import React from "react";
import Head from "next/head";
import AboutComponent from "components/about/About";
import { trackEvent } from "@aptabase/electron/renderer";

function About() {
  trackEvent("about-page-viewed");

  return (
    <React.Fragment>
      <Head>
        <title>About - Soroban</title>
      </Head>
      <AboutComponent />
    </React.Fragment>
  );
}

export default About;
