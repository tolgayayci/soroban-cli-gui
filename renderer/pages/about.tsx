import React from "react";
import Head from "next/head";
import AboutComponent from "components/about/About";

function About() {
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
