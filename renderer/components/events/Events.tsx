import { useEffect, useState } from "react";
import { useContractEvents } from "hooks/useContractEvents";
import { useTheme } from "next-themes";
import Image from "next/image";
import { createContractEventsColumns } from "components/events/events-columns";
import { EventsDataTable } from "components/events/events-data-table";
import Loading from "components/common/loading";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import ContractEventModal from "components/events/event-modal";
import { X } from "lucide-react";

export default function EventsComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateContractEventsDialog, setShowCreateContractEventsDialog] = useState(false);
  const contractEvents = useContractEvents();
  const { theme } = useTheme();

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

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-106px)]">
      {contractEvents && contractEvents.length > 0 && (
        <div className="flex flex-col space-y-4 mt-3 mb-6">
          <div className="flex items-center justify-between">
            <div className="relative w-full mr-4">
              <Input
                placeholder="Search Between Events"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full pr-8"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button onClick={handleAddNewEvent} className="whitespace-nowrap">
              Add New Event
            </Button>
          </div>
        </div>
      )}
      
      {contractEvents && contractEvents.length > 0 ? (
        filteredEvents.length > 0 ? (
          <EventsDataTable 
            columns={columns} 
            data={filteredEvents} 
            onAddNewEvent={handleAddNewEvent}
          />
        ) : (
          <div className="h-[calc(100vh-190px)] w-full rounded-md border flex flex-col items-center justify-center">
            <div className="flex items-center justify-center -mt-8">
              <Image
                src={theme === "dark" ? "/icons/not_found_light.svg" : "/icons/not_found_dark.svg"}
                alt="Events"
                width={220}
                height={220}
              />
            </div>
            <div className="flex flex-col items-center justify-center space-y-4 -mt-3">
              <p className="text-lg">No Events Found</p>
              <p className="text-sm text-gray-600 text-center max-w-md leading-relaxed">
                No events match your search criteria: "{searchQuery}"
              </p>
              <Button onClick={handleClearSearch}>Clear Search</Button>
            </div>
          </div>
        )
      ) : (
        <div className="h-[calc(100vh-10px)] w-full rounded-md border flex flex-col items-center justify-center mt-3">
          <div className="flex items-center justify-center -mt-8">
            <Image
              src={theme === "dark" ? "/icons/not_found_light.svg" : "/icons/not_found_dark.svg"}
              alt="Events"
              width={250}
              height={250}
            />
          </div>
          <div className="flex flex-col items-center justify-center space-y-4 -mt-3">
            <p className="text-lg">No Events Found</p>
            <p className="text-sm text-gray-600 text-center max-w-md leading-relaxed">
              There are no contract events to display.
              <br />
              Start by adding a new event to begin tracking contract activities.
            </p>
            <Button onClick={handleAddNewEvent}>Add New Event</Button>
          </div>
        </div>
      )}
      <ContractEventModal
        showCreateContractEventDialog={showCreateContractEventsDialog}
        setShowCreateContractEventialog={setShowCreateContractEventsDialog}
      />
    </div>
  );
}
