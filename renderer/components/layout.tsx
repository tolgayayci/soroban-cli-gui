// Import necessary components and hooks
import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";

import { SideNav } from "components/sidebar-nav";
import { Button } from "components/ui/button";
import { ModeToggle } from "components/toggle-mode";
import { ReloadToggle } from "components/toggle-reload";
import IdentitySwitcher from "components/identities/identity-switcher";
import { Toaster } from "components/ui/toaster";
import { cn } from "lib/utils";
import { TooltipProvider } from "components/ui/tooltip";
import { Separator } from "components/ui/separator";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "components/ui/resizable";
import { ChatbotButton } from "components/chatbot/chatbot-button";

import {
  FolderIcon,
  UserIcon,
  FileTextIcon,
  BellIcon,
  BeakerIcon,
  NetworkIcon,
  ScrollTextIcon,
  InfoIcon,
  BookOpenIcon,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Set initial layout and collapsed state
  const defaultLayout = [15, 85];
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const navCollapsedSize = 4;

  const handleCollapse = React.useCallback(() => {
    setIsCollapsed((prevState) => !prevState); // Toggle the collapsed state
    document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
      isCollapsed
    )}`;
  }, []);

  return (
    <>
      <div className="flex flex-col h-screen w-full">
        {" "}
        <header className="flex flex-row items-center space-x-4 py-4 w-full justify-between border-b pl-1 pr-4">
          {theme === "dark" ? (
            <Image
              key={theme}
              src="/images/sora-light.svg"
              width={120}
              height={25}
              alt="sora_logo_dark"
            />
          ) : (
            <Image
              key={theme}
              src="/images/sora-dark.svg"
              width={120}
              height={25}
              alt="sora_logo_light"
            />
          )}
          <div className="flex flex-row space-x-2">
            <IdentitySwitcher />
            <Button
              variant="outline"
              onClick={() => window.sorobanApi.openExternalLink("https://thesora.app/getting-started/quick-start")}
              className="h-10"
            >
              <BookOpenIcon className="h-4 w-4 mr-2" />
              Docs
            </Button>
            {/* <ReloadToggle /> */}
            <ModeToggle />
          </div>
        </header>
        <TooltipProvider delayDuration={0}>
          <ResizablePanelGroup
            direction="horizontal"
            onLayout={(sizes: number[]) => {
              document.cookie = `react-resizable-panels:layout=${JSON.stringify(
                sizes
              )}`;
            }}
            className="h-full items-stretch"
          >
            <ResizablePanel
              defaultSize={defaultLayout[0]}
              collapsedSize={navCollapsedSize}
              collapsible={false}
              minSize={10}
              maxSize={15}
              onCollapse={handleCollapse}
              className={cn(
                isCollapsed &&
                  "min-w-[50px] transition-all duration-300 ease-in-out"
              )}
            >
              <div className="flex flex-col h-full">
                <div className="flex-grow">
                  <SideNav
                    isCollapsed={isCollapsed}
                    links={[
                      {
                        title: "Projects",
                        label: "",
                        href: "/projects",
                        icon: FolderIcon,
                        variant: router.pathname.startsWith("/projects")
                          ? "default"
                          : "ghost",
                      },
                      {
                        title: "Identities",
                        label: "",
                        href: "/identities",
                        icon: UserIcon,
                        variant: router.pathname.startsWith("/identities")
                          ? "default"
                          : "ghost",
                      },

                      {
                        title: "Contracts",
                        label: "",
                        href: "/contracts",
                        icon: FileTextIcon,
                        variant: router.pathname.startsWith("/contracts")
                          ? "default"
                          : "ghost",
                      },
                      {
                        title: "Events",
                        label: "",
                        href: "/events",
                        icon: BellIcon,
                        variant: router.pathname.startsWith("/events")
                          ? "default"
                          : "ghost",
                      },
                      {
                        title: "Lab",
                        label: "",
                        href: "/lab",
                        icon: BeakerIcon,
                        variant: router.pathname.startsWith("/lab")
                          ? "default"
                          : "ghost",
                      },

                      {
                        title: "Network",
                        label: "",
                        href: "/settings",
                        icon: NetworkIcon,
                        variant: router.pathname.startsWith("/settings")
                          ? "default"
                          : "ghost",
                      },
                      {
                        title: "Logs",
                        label: "",
                        href: "/logs",
                        icon: ScrollTextIcon,
                        variant: router.pathname.startsWith("/logs")
                          ? "default"
                          : "ghost",
                      },
                      {
                        title: "About",
                        label: "",
                        href: "/about",
                        icon: InfoIcon,
                        variant: router.pathname.startsWith("/about")
                          ? "default"
                          : "ghost",
                      },
                    ]}
                  />
                  <Separator />
                  
                </div>
                
                <div className="p-2">
               
                  <ChatbotButton />
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={defaultLayout[1]} className="p-4 ">
              <main>{children}</main>
            </ResizablePanel>
          </ResizablePanelGroup>
        </TooltipProvider>
      </div>
      <Toaster />
    </>
  );
}
