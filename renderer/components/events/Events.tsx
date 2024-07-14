import { useEffect, useState } from "react";
import { useContractEvents } from "hooks/useContractEvents";

import { createContractEventsColumns } from "components/events/events-columns";
import { EventsDataTable } from "components/events/events-data-table";
import ContractEventModal from "components/events/event-modal";
import NoEvents from "components/events/no-events";
import Loading from "components/common/loading";

import { Alert, AlertDescription, AlertTitle } from "components/ui/alert";
import { Button } from "components/ui/button";
import { LucidePersonStanding } from "lucide-react";

export default function EventsComponent() {
  const [allContractEvents, setAllContractEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const contractEvents = useContractEvents();

  useEffect(() => {
    if (contractEvents) {
      setAllContractEvents(contractEvents);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [contractEvents]);

  const columns = createContractEventsColumns();

  return (
    <div className="flex flex-col h-[calc(100vh-106px)]">
      {isLoading ? (
        <Loading />
      ) : allContractEvents.length >= 0 ? (
        <EventsDataTable columns={columns} data={allContractEvents} />
      ) : (
        <NoEvents />
      )}
    </div>
  );
}
