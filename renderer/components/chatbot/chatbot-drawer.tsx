import * as React from "react";
import { Button } from "components/ui/button";
import { Textarea } from "components/ui/textarea";
import { Sheet, SheetContent } from "components/ui/sheet";
import { ScrollArea } from "components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import {
  MaximizeIcon,
  SendIcon,
  XIcon,
  MinimizeIcon,
  Loader,
  TrashIcon,
  UserCircle,
  Bot,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "components/ui/dialog";
import { Input } from "components/ui/input";

interface Message {
  role: "user" | "assistant";
  content: {
    type: string;
    text: {
      value: string;
      annotations: any[];
    };
  }[];
}

function renderMessageContent(content: Message["content"]): React.ReactNode {
  return (
    <ReactMarkdown
      className="prose dark:prose-invert max-w-none"
      components={{
        p: ({ node, ...props }) => <p className="mb-0" {...props} />,
        ul: ({ node, ...props }) => (
          <ul className="list-disc pl-4 mb-2" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal pl-4 mb-2" {...props} />
        ),
      }}
    >
      {content[0].text.value}
    </ReactMarkdown>
  );
}

export function ChatbotDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputText, setInputText] = React.useState("");
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [assistantId, setAssistantId] = React.useState("");
  const [threadId, setThreadId] = React.useState("");

  const [apiKeyModalOpen, setApiKeyModalOpen] = React.useState(false);
  const [apiKey, setApiKey] = React.useState("");
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(scrollToBottom, [messages]);

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      console.log("Initializing chat...");

      const existingConversation = await window.sorobanApi.getConversation(
        "general"
      );
      console.log("Existing conversation:", existingConversation);

      if (
        existingConversation &&
        existingConversation.threadId &&
        existingConversation.assistantId
      ) {
        setThreadId(existingConversation.threadId);
        setAssistantId(existingConversation.assistantId);
        try {
          const existingMessages = await window.sorobanApi.getMessages(
            existingConversation.threadId
          );
          console.log("Existing messages:", existingMessages);
          if (existingMessages && existingMessages.length > 0) {
            setMessages(existingMessages);
          } else {
            setDefaultMessage();
          }
        } catch (error) {
          console.error("Error fetching existing messages:", error);
          await createNewConversation();
        }
      } else {
        console.log(
          "No valid existing conversation found. Creating a new one."
        );
        await createNewConversation();
      }
    } catch (error) {
      console.error("Error initializing chat:", error);
      setError("Failed to initialize chat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const createNewConversation = async () => {
    console.log("Creating new conversation...");
    const assistant = await window.sorobanApi.createGeneralAssistant();
    console.log("Created assistant:", assistant);
    setAssistantId(assistant.id);
    const thread = await window.sorobanApi.createThread();
    console.log("Created thread:", thread);
    setThreadId(thread.id);

    setDefaultMessage();

    await window.sorobanApi.saveConversation(
      thread.id,
      assistant.id,
      "general"
    );
  };

  const checkApiKey = async () => {
    const savedApiKey = await window.sorobanApi.getApiKey();
    if (savedApiKey) {
      setIsSheetOpen(true);
      initializeChat();
    } else {
      setApiKeyModalOpen(true);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      checkApiKey();
    } else {
      setIsSheetOpen(false);
      setApiKeyModalOpen(false);
    }
  }, [isOpen]);

  const setDefaultMessage = () => {
    setMessages([
      {
        role: "assistant",
        content: [
          {
            type: "text",
            text: {
              value:
                "Hello! How can I help you with Soroban development or Stellar?",
              annotations: [],
            },
          },
        ],
      },
    ]);
  };

  const sendMessage = async () => {
    if (inputText.trim() === "" || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log("Sending message:", inputText);
      const newUserMessage: Message = {
        role: "user",
        content: [
          {
            type: "text",
            text: {
              value: inputText,
              annotations: [],
            },
          },
        ],
      };
      setMessages((prevMessages) => [newUserMessage, ...prevMessages]);
      setInputText("");

      const newMessage = await window.sorobanApi.sendMessage(
        threadId,
        inputText
      );
      console.log("New message sent:", newMessage);

      console.log("Running assistant...");
      const run = await window.sorobanApi.runAssistant(threadId, assistantId);
      console.log("Run created:", run);

      let runStatus = await window.sorobanApi.getRunStatus(threadId, run.id);
      console.log("Initial run status:", runStatus);

      while (runStatus !== "completed" && runStatus !== "failed") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        runStatus = await window.sorobanApi.getRunStatus(threadId, run.id);
        console.log("Updated run status:", runStatus);
      }

      if (runStatus === "completed") {
        console.log("Run completed. Fetching updated messages...");
        const updatedMessages = await window.sorobanApi.getMessages(threadId);
        console.log("Updated messages:", updatedMessages);
        setMessages(updatedMessages);
      } else {
        throw new Error("Assistant run failed");
      }

      await window.sorobanApi.saveConversation(
        threadId,
        assistantId,
        "general"
      );
    } catch (err) {
      setError("An error occurred while processing the message.");
      console.error("Error in sendMessage:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen((prevState) => !prevState);
  };

  const clearChatHistory = async () => {
    setDefaultMessage();
    await window.sorobanApi.clearConversation("general");
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) return;

    try {
      await window.sorobanApi.saveApiKey(apiKey);
      setApiKeyModalOpen(false);
      setIsSheetOpen(true);
      await initializeChat();
    } catch (err) {
      setError("Failed to save API key");
      console.error(err);
    }
  };

  const handleCancelApiKey = () => {
    setApiKeyModalOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog open={apiKeyModalOpen} onOpenChange={setApiKeyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>OpenAI API Key Required</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-4">
              <DialogDescription>
                Please enter your OpenAI API key to use the chatbot
              </DialogDescription>
              <Input
                type="password"
                placeholder="sk-xxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelApiKey}>
              Cancel
            </Button>
            <Button onClick={handleSaveApiKey}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className={`p-0 ${
            isFullScreen ? "w-screen" : "w-[500px] max-w-[100vw]"
          }`}
          style={{
            transition: "width 0.3s ease-in-out",
          }}
        >
          <div className="flex flex-col h-full bg-background shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-card">
              <div className="flex items-center gap-3">
                <div className="font-medium">SOR.AI</div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-muted/50"
                  onClick={clearChatHistory}
                >
                  <TrashIcon className="w-5 h-5" />
                </Button>
                {/* <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-muted/50"
                  onClick={toggleFullScreen}
                >
                  {isFullScreen ? (
                    <MinimizeIcon className="w-5 h-5" />
                  ) : (
                    <MaximizeIcon className="w-5 h-5" />
                  )}
                </Button> */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-muted/50"
                  onClick={onClose}
                >
                  <XIcon className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-grow h-[calc(100vh-10rem)]">
              <div className="space-y-4 py-4 px-4">
                {messages
                  .slice()
                  .reverse()
                  .map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-4 ${
                        message.role === "user" ? "justify-end" : ""
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <Bot className="w-5 h-5 text-primary-foreground" />
                        </div>
                      )}
                      <div
                        className={`px-4 py-3 rounded-lg max-w-[75%] ${
                          message.role === "assistant"
                            ? "bg-muted"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {renderMessageContent(message.content)}
                      </div>
                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                          <UserCircle className="w-5 h-5 text-secondary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="bg-card px-4 py-3 flex items-center gap-2">
              <Textarea
                placeholder="Type your message..."
                className="flex-1 rounded-xl border-2 border-black focus:border-transparent focus:ring-0 resize-none"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading}
              />
              <Button
                size="icon"
                className="rounded-full"
                onClick={sendMessage}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-spin">
                    <Loader className="w-5 h-5" />
                  </span>
                ) : (
                  <SendIcon className="w-5 h-5" />
                )}
                <span className="sr-only">
                  {isLoading ? "Sending" : "Send"}
                </span>
              </Button>
            </div>
            {error && (
              <div className="bg-red-100 text-red-900 px-4 py-2">{error}</div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
