import React from "react";
import Head from "next/head";
import ProjectsComponent from "components/projects/Projects";
import { trackEvent } from "@aptabase/electron/renderer";

function Projects() {
  trackEvent("projects-page-viewed");

  return (
    <React.Fragment>
      <Head>
        <title>Projects - Soroban</title>
      </Head>
      <ProjectsComponent />
    </React.Fragment>
  );
}

export default Projects;
