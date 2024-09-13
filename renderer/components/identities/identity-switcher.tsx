"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import { cn } from "lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { Button } from "components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "components/ui/command";
import { Dialog, DialogTrigger } from "components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";

import IdentityModal from "components/identities/identity-modal";

const initialGroups = [
  {
    label: "Active Identity",
    teams: [
      {
        label: "",
        value: "",
      },
    ],
  },
  {
    label: "Identities",
    teams: [
      {
        label: "",
        value: "",
      },
    ],
  },
];

function showFirst3Last4(str) {
  // Ensure the string is long enough
  if (str.length > 10) {
    const first3 = str.substring(0, 4);
    const last4 = str.substring(str.length - 6);
    return `${first3}...${last4}`;
  }
  return str;
}

type Team = (typeof initialGroups)[number]["teams"][number];

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {}

export default function IdentitySwitcher({ className }: TeamSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const [selectedIdentity, setSelectedIdentity] = React.useState<Team>(
    initialGroups[0].teams[0]
  );
  const [updatedGroups, setUpdatedGroups] = useState(initialGroups);

  const router = useRouter();

  async function checkIdentities() {
    try {
      await window.sorobanApi.refreshIdentities();
      const identities = await window.sorobanApi.manageIdentities("list", "");

      const activeIdentity =
        identities.find((identity) => identity.active) || identities[0];

      const identityGroups = [
        {
          label: "Active Identity",
          teams: activeIdentity
            ? [
                {
                  label: showFirst3Last4(activeIdentity.name),
                  value: activeIdentity.name,
                },
              ]
            : [],
        },
        {
          label: "Identities",
          teams: identities.map((identity) => ({
            label: showFirst3Last4(identity.name),
            value: identity.name,
          })),
        },
      ];

      setUpdatedGroups(identityGroups);
      setSelectedIdentity(
        identityGroups[0].teams[0] || initialGroups[0].teams[0]
      );
    } catch (error) {
      console.log("Error invoking remote method:", error);
    }
  }

  async function changeIdentity(identity) {
    try {
      await window.sorobanApi.manageIdentities("setActive", {
        name: identity,
        active: true,
      });
      await window.sorobanApi.reloadApplication();
    } catch (error) {
      console.log("Error invoking remote method:", error);
    }
  }

  const hasIdentities = updatedGroups.some((group) => group.teams.length > 0);

  useEffect(() => {
    checkIdentities();
  }, []);

  return (
    <Dialog
      open={showNewTeamDialog}
      onOpenChange={() => setShowNewTeamDialog(false)}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select an identity"
            className={cn("w-[200px] justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/${selectedIdentity.value}.png`}
                alt={selectedIdentity.label}
              />
              <AvatarFallback>S</AvatarFallback>
            </Avatar>
            {hasIdentities
              ? showFirst3Last4(selectedIdentity.label)
              : "No Identity"}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search identity..." />
              <CommandEmpty>No identity found.</CommandEmpty>
              {hasIdentities &&
                updatedGroups.map((group) => (
                  <CommandGroup key={group.label} heading={group.label}>
                    {group.teams.map((team) => (
                      <CommandItem
                        key={team.value}
                        onSelect={() => {
                          if (selectedIdentity.value !== team.value) {
                            setSelectedIdentity(team);
                            changeIdentity(team.value);
                          }
                          setOpen(false);
                        }}
                        className="text-sm"
                      >
                        <Avatar className="mr-2 h-5 w-5">
                          <AvatarImage
                            src={`https://avatar.vercel.sh/${team.value}.png`}
                            alt={team.label}
                          />
                          <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                        {showFirst3Last4(team.label)}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedIdentity.value === team.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewTeamDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Identity
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    router.push("/identities");
                  }}
                >
                  <UpdateIcon className="mr-2 h-5 w-5" />
                  Edit Identities
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <IdentityModal
        showCreateIdentityDialog={showNewTeamDialog}
        setShowCreateIdentityDialog={setShowNewTeamDialog}
        onIdentityChange={checkIdentities}
      />
    </Dialog>
  );
}
