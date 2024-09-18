import * as React from "react";
import { Button } from "components/ui/button";
import { Textarea } from "components/ui/textarea";
import { Sheet, SheetContent } from "components/ui/sheet";
import { ScrollArea } from "components/ui/scroll-area";
import {
  SendIcon,
  XIcon,
  Loader,
  UserCircle,
  Bot,
  Trash2,
  Copy,
  Key,
  Save,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "components/ui/dialog";
import { Input } from "components/ui/input";
import ReactMarkdown from "react-markdown";
import { useToast } from "components/ui/use-toast";
import { useRouter } from "next/router";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "components/ui/alert";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface CommandGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandGenerator({ isOpen, onClose }: CommandGeneratorProps) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputText, setInputText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<{ message: string; details?: string } | null>(null);

  const [assistantId, setAssistantId] = React.useState<string | null>(null);
  const [threadId, setThreadId] = React.useState<string | null>(null);

  const [saveApiKeyModalOpen, setSaveApiKeyModalOpen] = React.useState(false);
  const [editApiKeyModalOpen, setEditApiKeyModalOpen] = React.useState(false);
  const [apiKey, setApiKey] = React.useState("");
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  const currentPath = React.useMemo(() => {
    return (router.query.path as string) || "";
  }, [router.query.path]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(scrollToBottom, [messages]);

  function renderMessageContent(content: string): React.ReactNode {
    return (
      <ReactMarkdown
        className="prose dark:prose-invert max-w-none break-words whitespace-pre-wrap"
        components={{
          p: ({ node, ...props }) => <p className="mb-2" {...props} />,
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-4 mb-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-4 mb-2" {...props} />
          ),
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return  match ? (
              <pre className={`${className} p-2 rounded bg-muted overflow-x-auto`}>
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    );
  }

  const initializeAssistant = async () => {
    try {
      setIsLoading(true);
      console.log("Initializing AI assistant...");
      const conversation = await window.sorobanApi.getConversation("cli");
      if (conversation && conversation.assistantId && conversation.threadId) {
        console.log("Existing conversation found:", conversation);
        setAssistantId(conversation.assistantId);
        setThreadId(conversation.threadId);
        const existingMessages = await window.sorobanApi.getMessages(
          conversation.threadId
        );
        console.log("Fetched existing messages:", existingMessages);
        if (existingMessages && existingMessages.length > 0) {
          setMessages(
            existingMessages
              .map((msg) => ({
                role: msg.role,
                content: msg.content[0].text.value,
              }))
              .reverse()
          );
        } else {
          console.log("No existing messages, setting default message");
          setDefaultMessage();
        }
      } else {
        console.log("Creating new assistant and thread");
        const assistant = await window.sorobanApi.createCliAssistant();
        const thread = await window.sorobanApi.createThread();
        console.log("New assistant created:", assistant);
        console.log("New thread created:", thread);
        setAssistantId(assistant.id);
        setThreadId(thread.id);
        await window.sorobanApi.saveConversation(
          thread.id,
          assistant.id,
          "cli"
        );
        setDefaultMessage();
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
      console.log("Assistant initialization completed");
    }
  };

  const checkApiKey = async () => {
    const savedApiKey = await window.sorobanApi.getApiKey();
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsSheetOpen(true);
      initializeAssistant();
    } else {
      setSaveApiKeyModalOpen(true);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      checkApiKey();
    } else {
      setIsSheetOpen(false);
      setSaveApiKeyModalOpen(false);
      setEditApiKeyModalOpen(false);
    }
  }, [isOpen]);

  const setDefaultMessage = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I'm here to help you generate Stellar CLI commands. What would you like to do?",
      },
    ]);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !assistantId || !threadId || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log("Sending user message:", inputText);
      const userMessage: Message = { role: "user", content: inputText };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputText("");

      console.log("Calling AI assistant...");
      await window.sorobanApi.sendMessage(threadId, inputText);
      const run = await window.sorobanApi.runAssistant(threadId, assistantId);
      console.log("AI run started:", run.id);

      let runStatus = await window.sorobanApi.getRunStatus(threadId, run.id);
      console.log("Initial run status:", runStatus);

      while (runStatus !== "completed" && runStatus !== "failed") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        runStatus = await window.sorobanApi.getRunStatus(threadId, run.id);
        console.log("Updated run status:", runStatus);
      }

      if (runStatus === "completed") {
        console.log("AI run completed, fetching messages");
        const messages = await window.sorobanApi.getMessages(threadId);
        const lastAssistantMessage = messages.find(
          (msg) => msg.role === "assistant"
        );
        if (lastAssistantMessage) {
          const assistantMessage: Message = {
            role: "assistant",
            content: lastAssistantMessage.content[0].text.value,
          };
          console.log("Assistant message:", assistantMessage);
          setMessages((prevMessages) => [...prevMessages, assistantMessage]);
        } else {
          handleApiError(new Error("No response from assistant"));
          console.error("No assistant message found");
        }
      } else {
        handleApiError(new Error("Failed to generate command"));
        console.error("AI run failed");
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
      console.log("AI interaction completed");
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) return;

    try {
      await window.sorobanApi.saveApiKey(apiKey);
      setSaveApiKeyModalOpen(false);
      setEditApiKeyModalOpen(false);
      setIsSheetOpen(true);
      toast({
        title: "API Key Saved",
        description: "Your OpenAI API key has been saved successfully.",
      });
      // Clear existing messages and reset the assistant
      setMessages([]);
      setAssistantId(null);
      setThreadId(null);
      await initializeAssistant();
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleDeleteApiKey = async () => {
    try {
      await window.sorobanApi.deleteApiKey();
      setApiKey("");
      setEditApiKeyModalOpen(false);
      toast({
        title: "API Key Deleted",
        description: "Your OpenAI API key has been deleted. The application will now reload.",
      });
      // Reload the application
      await window.sorobanApi.reloadApplication();
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleShowApiKey = async () => {
    try {
      const savedApiKey = await window.sorobanApi.getApiKey();
      setApiKey(savedApiKey || "");
      setEditApiKeyModalOpen(true);
    } catch (err) {
      handleApiError(err);
    }
  };

  const clearChatHistory = async () => {
    try {
      await window.sorobanApi.clearConversation("cli");
      setMessages([]);
      setDefaultMessage();
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleSaveApiKeyDialogChange = (open: boolean) => {
    setSaveApiKeyModalOpen(open);
    if (!open) {
      if (apiKey) {
        setIsSheetOpen(true);
      } else {
        onClose(); // Close the entire component if no API key is set
      }
    }
  };

  const handleApiError = (err: any) => {
    console.error("API Error:", err);
    let errorMessage = "An error occurred";
    let errorDetails = "";

    if (err.message && err.message.includes("Error invoking remote method")) {
      const match = err.message.match(/Error: (.+)/);
      if (match) {
        errorMessage = match[1];
        // Extract the part after "Error:"
        errorDetails = err.message.split("Error:")[1].trim();
      }
    } else if (err.response) {
      // OpenAI API error
      errorMessage = err.response.data.error.message || "OpenAI API error";
      errorDetails = JSON.stringify(err.response.data.error, null, 2);
    } else if (err.message) {
      // General error with a message
      errorMessage = err.message;
    }

    setError({ message: errorMessage, details: errorDetails });
  };

  return (
    <>
      <Dialog 
        open={saveApiKeyModalOpen} 
        onOpenChange={handleSaveApiKeyDialogChange}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter OpenAI API Key</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-4">
              <DialogDescription>
                Enter your OpenAI API key
              </DialogDescription>
              <Input
                type="text"
                placeholder="sk-xxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSaveApiKey}
              className="flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog 
        open={editApiKeyModalOpen} 
        onOpenChange={setEditApiKeyModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit OpenAI API Key</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-4">
              <DialogDescription>
                Edit your OpenAI API key
              </DialogDescription>
              <Input
                type="text"
                placeholder="sk-xxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={handleDeleteApiKey}>
              <XIcon className="w-4 h-4 mr-2" />
              Remove
            </Button>
            <Button
              onClick={handleSaveApiKey}
              className="flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet 
        open={isSheetOpen} 
        onOpenChange={(open) => {
          setIsSheetOpen(open);
          if (!open) {
            onClose();
          }
        }}
      >
        <SheetContent side="right" className="p-0 w-[600px] max-w-sm">
          <div className="flex flex-col h-full bg-background shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-card">
              <div className="flex items-center gap-3">
                <div className="font-medium">Command Generator</div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-muted/50"
                  onClick={handleShowApiKey}
                >
                  <Key className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-muted/50"
                  onClick={clearChatHistory}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
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
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-4 ${
                      message.role === "user" ? "justify-end" : ""
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={`px-4 py-3 rounded-lg ${
                        message.role === "assistant"
                          ? "bg-muted"
                          : "bg-primary text-primary-foreground"
                      } max-w-[300px]`}
                    >
                      <div className="max-w-full overflow-hidden">
                        {renderMessageContent(message.content)}
                      </div>
                      {message.role === "assistant" &&
                        message.content.includes("stellar") && (
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const commandMatch = message.content.match(
                                  /```(?:plaintext)?\s*(stellar[\s\S]*?)```/
                                );
                                const actualCommand = commandMatch
                                  ? commandMatch[1].trim()
                                  : message.content;
                                navigator.clipboard.writeText(actualCommand);
                                toast({
                                  title: "Command Copied",
                                  description:
                                    "The command has been copied to your clipboard.",
                                });
                              }}
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </Button>
                          </div>
                        )}
                    </div>
                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <UserCircle className="w-5 h-5 text-secondary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {error ? (
              <div className="mx-4 mb-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {error.details && (
                      <ScrollArea className="h-20 mt-2">
                        <pre className="text-xs whitespace-pre-wrap">{error.details}</pre>
                      </ScrollArea>
                    )}
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="bg-card px-4 py-3 flex items-center gap-2">
                <Textarea
                  placeholder="Describe the Stellar CLI command you want..."
                  className="flex-1 rounded-xl border-2 border-black focus:border-transparent focus:ring-0 resize-none"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isLoading}
                />
                <Button
                  size="icon"
                  className="rounded-full"
                  onClick={handleSendMessage}
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
                    {isLoading ? "Generating" : "Generate"}
                  </span>
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
