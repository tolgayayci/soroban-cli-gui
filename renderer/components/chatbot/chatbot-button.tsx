import { useState } from "react";
import { Button } from "components/ui/button";
import { ChatbotDrawer } from "components/chatbot/chatbot-drawer";
import { MessageSquareIcon } from "lucide-react";

export function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="default"
        onClick={() => setIsOpen(true)}
        className="w-full"
      >
        <MessageSquareIcon className="mr-2 h-4 w-4" />
        Ask SOR.AI
      </Button>
      <ChatbotDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
