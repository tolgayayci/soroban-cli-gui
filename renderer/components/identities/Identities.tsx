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
import { Label } from "components/ui/label";

import { UserIcon, Trash2, Search } from "lucide-react";
import IdentityModal from "components/identities/identity-modal";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area";

import { FundIdentityModal } from "components/identities/fund-identity-modal";
import { RemoveIdentityModal } from "components/identities/remove-identity-modal";

import { useCopyToClipboard } from "react-use";
import { Info, Copy, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "components/ui/dialog";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";

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
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [identityDetails, setIdentityDetails] = useState({
    show: "",
    address: "",
  });
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [_, copyToClipboard] = useCopyToClipboard();
  const [copiedField, setCopiedField] = useState("");

  const handleShowInfo = async () => {
    setShowInfoDialog(true);
    setIsLoadingDetails(true);
    try {
      const showResult = await window.sorobanApi.runSorobanCommand(
        "keys",
        "show",
        [identity.name],
        []
      );
      const addressResult = await window.sorobanApi.runSorobanCommand(
        "keys",
        "address",
        [identity.name],
        []
      );
      setIdentityDetails({ show: showResult, address: addressResult });
    } catch (error) {
      console.error("Error fetching identity details:", error);
      setIdentityDetails({
        show: "Error fetching details",
        address: "Error fetching details",
      });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleCopyDetails = (field: "show" | "address") => {
    copyToClipboard(identityDetails[field]);
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 2000);
  };

  return (
    <Card className="col-span-1" key={identity.name}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-grow overflow-hidden">
            <Avatar className="mr-3 h-10 w-10">
              <AvatarImage
                src={`https://avatar.vercel.sh/${identity.name}.png`}
                alt={identity.name}
              />
            </Avatar>
            <div className="flex flex-col space-y-1 overflow-hidden">
              <CardTitle className="text-medium truncate">
                {identity.name}
              </CardTitle>
              <CardDescription className="truncate">
                Local Identity
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="hover:bg-secondary ml-2"
            onClick={handleShowInfo}
          >
            <Info className="h-5 w-5" />
          </Button>
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

      {/* Info Dialog */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="mb-1">
              Identity Details: {identity.name}
            </DialogTitle>
            <DialogDescription>
              View the private key and public address for this identity. Use
              caution when sharing this information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            {isLoadingDetails ? (
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="show" className="text-left font-medium">
                    Private Key
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="show"
                      value={identityDetails.show}
                      readOnly
                      className="font-mono text-sm flex-grow"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleCopyDetails("show")}
                      className="px-3"
                    >
                      {copiedField === "show" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-left font-medium">
                    Public Address
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="address"
                      value={identityDetails.address}
                      readOnly
                      className="font-mono text-sm flex-grow"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleCopyDetails("address")}
                      className="px-3"
                    >
                      {copiedField === "address" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
          
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default function IdentitiesComponent() {
  const [showCreateIdentityDialog, setShowCreateIdentityDialog] =
    useState(false);
  const [identities, setIdentities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIdentityName, setActiveIdentityName] = useState("");
  const { theme } = useTheme();

  async function checkIdentities() {
    try {
      const identities = await window.sorobanApi.manageIdentities("list", "");

      setIdentities(identities);
    } catch (error) {
      console.error("Error invoking remote method:", error);
    }
  }

  const refreshIdentities = async () => {
    await window.sorobanApi.reloadApplication();
  };

  const handleSearchChange = (e: any) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    checkIdentities();
  }, []);

  const filteredIdentities = identities.filter((identity) =>
    identity.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-106px)]">
      <div className="flex items-center justify-between">
        <Alert className="flex items-center justify-between py-6">
          <div className="flex items-center">
            <UserIcon className="h-5 w-5 mr-4" />
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
          onIdentityChange={refreshIdentities}
        />
      </div>

      {identities.length > 0 ? (
        <div className="mt-6 space-y-6">
          <Input
            type="search"
            placeholder={`Search for an identity between ${identities.length} identities`}
            onChange={handleSearchChange}
            value={searchQuery}
          />
          <ScrollArea className="h-[calc(100vh-300px)]">
            {filteredIdentities.length > 0 ? (
              <div className="grid grid-cols-3 gap-8">
                {filteredIdentities.map((identity) => (
                  <IdentityCard
                    key={identity.name}
                    identity={identity}
                    activeIdentityName={activeIdentityName}
                  />
                ))}
              </div>
            ) : (
              <div className="h-[calc(100vh-300px)] w-full rounded-md border flex flex-col items-center justify-center">
                <div className="flex items-center justify-center -mt-8">
                  <Image
                    src={
                      theme === "dark"
                        ? "/icons/not_found_light.svg"
                        : "/icons/not_found_dark.svg"
                    }
                    alt="Identities"
                    width={220}
                    height={220}
                  />
                </div>
                <div className="flex flex-col items-center justify-center space-y-4 -mt-3">
                  <p className="text-lg">No Identities Found</p>
                  <p className="text-sm text-gray-600 text-center max-w-md leading-relaxed">
                    No identities match your search query "{searchQuery}".
                    <br />
                    Try adjusting your search or create a new identity.
                  </p>
                  <Button onClick={() => setShowCreateIdentityDialog(true)}>
                    Create New Identity
                  </Button>
                </div>
              </div>
            )}
            <ScrollBar />
          </ScrollArea>
        </div>
      ) : (
        <div className="h-[calc(100vh-10px)] w-full rounded-md border flex flex-col items-center justify-center mt-3">
          <div className="flex items-center justify-center -mt-8">
            <Image
              src={
                theme === "dark"
                  ? "/icons/not_found_light.svg"
                  : "/icons/not_found_dark.svg"
              }
              alt="Identities"
              width={250}
              height={250}
            />
          </div>
          <div className="flex flex-col items-center justify-center space-y-4 -mt-3">
            <p className="text-lg">No Identities Found</p>
            <p className="text-sm text-gray-600 text-center max-w-md leading-relaxed">
              You haven't created any identities yet. <br />
              Start by creating a new identity to begin using the SORA.
            </p>
            <Button onClick={() => setShowCreateIdentityDialog(true)}>
              Create New Identity
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
