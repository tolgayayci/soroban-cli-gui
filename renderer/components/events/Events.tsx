import { useEffect, useState } from "react";
import { useContractEvents } from "hooks/useContractEvents";
import { createContractEventsColumns } from "components/events/events-columns";
import { EventsDataTable } from "components/events/events-data-table";
import Loading from "components/common/loading";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import ContractEventModal from "components/events/event-modal";
import { BellIcon } from "lucide-react";

export default function EventsComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateContractEventsDialog, setShowCreateContractEventsDialog] = useState(false);
  const contractEvents = useContractEvents();

  const columns = createContractEventsColumns();

  useEffect(() => {
    if (contractEvents !== null) {
      setIsLoading(false);
    }
  }, [contractEvents]);

  if (isLoading) {
    return <Loading />;
  }

  const filteredEvents = contractEvents?.filter((event) =>
    Object.values(event).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  ) || [];

  const handleAddNewEvent = () => {
    setShowCreateContractEventsDialog(true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-106px)]">
      {filteredEvents.length > 0 ? (
        <>
          <div className="flex flex-col space-y-4 mt-3 mb-6">
            <div className="flex items-center justify-between">
              <Input
                placeholder="Search Between Events"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full"
              />
              <Button onClick={handleAddNewEvent} className="ml-4 whitespace-nowrap">
                Add New Event
              </Button>
            </div>
          </div>
          <EventsDataTable 
            columns={columns} 
            data={filteredEvents} 
            onAddNewEvent={handleAddNewEvent}
          />
        </>
      ) : (
        <div className="h-full w-full rounded-md border flex flex-col items-center justify-center space-y-4">
          <BellIcon className="h-12 w-12" />
          <p className="text-lg">No Events Found</p>
          <p className="text-sm text-gray-600 text-center max-w-sm leading-relaxed">
            There are no contract events to display.
          </p>
          <Button onClick={handleAddNewEvent}>
            Add New Event
          </Button>
        </div>
      )}
      <ContractEventModal
        showCreateContractEventDialog={showCreateContractEventsDialog}
        setShowCreateContractEventialog={setShowCreateContractEventsDialog}
      />
    </div>
  );
}
