import { useState } from "react";
import { Button } from "components/ui/button";
import { ChatbotDrawer } from "components/chatbot/chatbot-drawer";
import { MessageSquareIcon } from "lucide-react";
import { useToast } from "components/ui/use-toast";

export function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <Button
        variant="default"
        onClick={handleToggle}
        className="w-full"
      >
        <MessageSquareIcon className="mr-2 h-4 w-4" />
        Ask SOR.AI
      </Button>
      <ChatbotDrawer isOpen={isOpen} onClose={handleToggle} />
    </>
  );
}
