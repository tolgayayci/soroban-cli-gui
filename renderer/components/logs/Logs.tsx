import CommandHistory from "components/logs/command-history/command-history";
import ApplicationLogs from "components/logs/application-logs/application-logs";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";

export default function LogsComponent() {
  async function openExternalLink(url: string) {
    try {
      await window.sorobanApi.openExternalLink(url);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-90px)]">
      <Tabs defaultValue="command-history" className="w-full -mt-1">
        <TabsList className="flex">
          <TabsTrigger value="command-history" className="flex-1 text-center">
            Command History
          </TabsTrigger>
          <TabsTrigger value="application-logs" className="flex-1 text-center">
            Application Logs
          </TabsTrigger>
        </TabsList>
        <TabsContent value="command-history">
          <CommandHistory />
        </TabsContent>
        <TabsContent value="application-logs">
          <ApplicationLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
}
