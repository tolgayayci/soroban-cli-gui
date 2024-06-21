"use client";

import { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";

import { Avatar, AvatarImage } from "components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "components/ui/alert";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";

import { LucidePersonStanding } from "lucide-react";
import IdentityModal from "components/identities/identity-modal";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area";
import NoIdentities from "components/identities/no-identities";

import { FundIdentityModal } from "components/identities/fund-identity-modal";
import { RemoveIdentityModal } from "components/identities/remove-identity-modal";

const IdentityCard = ({
  identity,
  activeIdentityName,
}: {
  identity: {
    name: string;
  };
  activeIdentityName: string;
}) => {
  const [showFundIdentityDialog, setShowFundIdentityDialog] = useState(false);
  const [showRemoveIdentityDialog, setShowRemoveIdentityDialog] =
    useState(false);

  return (
    <Card className="col-span-1" key={identity.name}>
      <CardHeader>
        <div className="flex items-center">
          <Avatar className="mr-4 h-10 w-10">
            <AvatarImage
              src={`https://avatar.vercel.sh/${identity.name}.png`}
              alt={identity.name}
            />
          </Avatar>
          <div className="flex flex-col space-y-1">
            <CardTitle className="text-medium">{identity.name}</CardTitle>
            <CardDescription>Local Identity</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowFundIdentityDialog(true)}
          >
            Fund
          </Button>
          {showFundIdentityDialog && (
            <FundIdentityModal
              identity={identity}
              isOpen={showFundIdentityDialog}
              onClose={() => setShowFundIdentityDialog(false)}
            />
          )}
        </div>
        <div>
          <Button
            className="w-full"
            onClick={() => setShowRemoveIdentityDialog(true)}
          >
            Remove
          </Button>
          {showRemoveIdentityDialog && (
            <RemoveIdentityModal
              identity={identity}
              isOpen={showRemoveIdentityDialog}
              onClose={() => setShowRemoveIdentityDialog(false)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function IdentitiesComponent() {
  const [showCreateIdentityDialog, setShowCreateIdentityDialog] =
    useState(false);
  const [identities, setIdentities] = useState<any>();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIdentityName, setActiveIdentityName] = useState("");

  async function checkIdentities() {
    try {
      const identities = await window.sorobanApi.manageIdentities("list", "");

      setIdentities(identities);
    } catch (error) {
      console.log("Error invoking remote method:", error);
    }
  }

  const handleSearchChange = (e: any) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  // Call checkIdentities when the component mounts
  useEffect(() => {
    checkIdentities();
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-106px)]">
      <div className="flex items-center justify-between">
        <Alert className="flex items-center justify-between py-6">
          <div className="flex items-center">
            <LucidePersonStanding className="h-5 w-5 mr-4" />
            <div>
              <AlertTitle>
                You have {identities?.length ? identities?.length : "0"}{" "}
                identities
              </AlertTitle>
              <AlertDescription>
                You can add, remove, or edit your identities on this page.
              </AlertDescription>
            </div>
          </div>
          <Button onClick={() => setShowCreateIdentityDialog(true)}>
            Create New Identity
          </Button>
        </Alert>
        <IdentityModal
          showCreateIdentityDialog={showCreateIdentityDialog}
          setShowCreateIdentityDialog={setShowCreateIdentityDialog}
        />
      </div>

      {identities ? (
        <div className="flex-grow">
          <div className="my-6">
            <Input
              type="search"
              placeholder={`Search for an identity between ${identities.length} identities`}
              onChange={handleSearchChange}
              value={searchQuery}
            />
          </div>
          <ScrollArea className="h-[calc(100vh-300px)] overflow-y-auto">
            <div className="grid grid-cols-3 gap-8">
              {identities
                .filter((identity) =>
                  identity.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((identity) => (
                  <IdentityCard
                    key={identity.name}
                    identity={identity}
                    activeIdentityName={activeIdentityName}
                  />
                ))}
            </div>
            <ScrollBar />
          </ScrollArea>
        </div>
      ) : (
        <NoIdentities />
      )}
    </div>
  );
}
