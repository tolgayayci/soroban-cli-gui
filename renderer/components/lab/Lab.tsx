"use client";

import { useState } from "react";

import LabCommandSelector from "components/lab/lab-command";
import LabCommandOutput from "components/lab/lab-output";

export default function LabComponent() {
  const [commandOutput, setCommandOutput] = useState();
  const [commandError, setCommandError] = useState();

  return (
    <div className="flex flex-row w-full">
      <div className="w-3/5 pr-4">
        <LabCommandSelector
          path="/lab"
          setCommandError={setCommandError}
          setCommandOutput={setCommandOutput}
        />
      </div>
      <div className="w-2/5 pr-4">
        <LabCommandOutput
          canister="{project}"
          projectPath="{projectPath}"
          commandOutput={commandOutput}
          commandError={commandError}
        />
      </div>
    </div>
  );
}
