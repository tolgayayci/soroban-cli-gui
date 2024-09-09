import { useEffect, useState } from "react";

import { Label } from "components/ui/label";
import { Input } from "components/ui/input";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "components/ui/card";

import { Button } from "components/ui/button";

export default function EnvironmentVariables() {
  const [soraAppVersion, setSoraAppVersion] = useState("Loading...");
  const [cliType, setCliType] = useState("Loading...");
  const [cliVersion, setCliVersion] = useState("Loading...");
  const [sorobanEnvVersion, setSorobanEnvVersion] = useState("Loading...");
  const [sorobanEnvInterfaceVersion, setSorobanEnvInterfaceVersion] =
    useState("Loading...");
  const [stellarXdrVersion, setStellarXdrVersion] = useState("Loading...");
  const [xdrCurrVersion, setXdrCurrVersion] = useState("Loading...");

  useEffect(() => {
    async function fetchVersionData() {
      try {
        const installationInfo = await window.sorobanApi.isSorobanInstalled();
        const versionData = await window.sorobanApi.getSorobanVersion();

        if (typeof installationInfo === "object") {
          setCliType(installationInfo.type || "Unknown");
          setCliVersion(installationInfo.version || "Unknown");
        } else {
          setCliType("Unknown");
          setCliVersion("Unknown");
        }

        setSorobanEnvVersion(versionData.sorobanEnvVersion);
        setSorobanEnvInterfaceVersion(versionData.sorobanEnvInterfaceVersion);
        setStellarXdrVersion(versionData.stellarXdrVersion);
        setXdrCurrVersion(versionData.xdrCurrVersion);
      } catch (error) {
        console.error("Error fetching version data:", error);
        setCliType("Error");
        setCliVersion("Error fetching data");
      }
    }

    fetchVersionData();
  }, []);

  useEffect(() => {
    async function fetchAppVersion() {
      const versionOutput = await window.sorobanApi.getAppVersion();
      setSoraAppVersion(versionOutput);
    }

    fetchAppVersion();
  }, []);

  async function openExternalLink(url: string) {
    try {
      await window.sorobanApi.openExternalLink(url);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-90px)]">
      <div className="flex flex-row space-x-7">
        <div className="w-3/5">
          <ScrollArea className="h-[calc(100vh-100px)] overflow-y-auto">
            <div className="space-y-6 mt-3">
              <div className="flex flex-col justify-between space-y-3">
                <Label className="w-full">Sora App Version</Label>
                <Input value={soraAppVersion} placeholder="0.2.0" disabled />
              </div>
              <div className="flex flex-col justify-between space-y-3">
                <Label className="w-full">Stellar/Soroban Version</Label>
                <Input value={cliVersion} placeholder="Not Defined" disabled />
              </div>
              <div className="flex flex-col justify-between space-y-3">
                <Label className="w-full">Soroban-Env Version</Label>
                <Input
                  value={sorobanEnvVersion}
                  placeholder="Not Defined"
                  disabled
                />
              </div>
              <div className="flex flex-col justify-between space-y-3">
                <Label className="w-full">Soroban-Env Interface Version</Label>
                <Input
                  value={sorobanEnvInterfaceVersion}
                  placeholder="Not Defined"
                  disabled
                />
              </div>
              <div className="flex flex-col justify-between space-y-3">
                <Label className="w-full">Stellar-XDR Version</Label>
                <Input
                  value={stellarXdrVersion}
                  placeholder="Not Defined"
                  disabled
                />
              </div>
              <div className="flex flex-col justify-between space-y-3">
                <Label className="w-full">XDR Curr Version</Label>
                <Input
                  value={xdrCurrVersion}
                  placeholder="Not Defined"
                  disabled
                />
              </div>
              <ScrollBar />
            </div>
          </ScrollArea>
        </div>
        <div className="w-2/5 space-y-3">
          <div className="w-full">
            <Card x-chunk="dashboard-07-chunk-5">
              <CardHeader>
                <CardTitle className="text-xl">
                  Make a Feature Request
                </CardTitle>
                <CardDescription>
                  You can request a feature by creating an issue on Github.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div></div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    openExternalLink(
                      "https://github.com/tolgayayci/sora/issues/new?assignees=tolgayayci&labels=enhancement&projects=&template=feature_request.md&title=%5BFEAT%5D"
                    ) as any
                  }
                >
                  Visit Github
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="w-full">
            <Card x-chunk="dashboard-07-chunk-5">
              <CardHeader>
                <CardTitle className="text-xl">Report a Bug</CardTitle>
                <CardDescription>
                  You can report a bug by creating an issue on Github.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div></div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    openExternalLink(
                      "https://github.com/tolgayayci/sora/issues/new?assignees=tolgayayci&labels=bug&projects=&template=bug_report.md&title=%5BBUG%5D"
                    ) as any
                  }
                >
                  Visit Github
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="w-full">
            <Card x-chunk="dashboard-07-chunk-5">
              <CardHeader>
                <CardTitle className="text-xl">Review Release Notes</CardTitle>
                <CardDescription>
                  You can review the release notes on Github for this version.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div></div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    openExternalLink(
                      `https://github.com/tolgayayci/sora/releases/tag/v${soraAppVersion}`
                    ) as any
                  }
                >
                  Visit Github
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
