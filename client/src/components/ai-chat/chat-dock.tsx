import { useState } from "react";
import { Bot, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/hooks/use-app-state";
import { mockChatPrompts } from "@/lib/mock-data";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  message: string;
  timestamp: Date;
}

export default function ChatDock() {
  const { state, setChatOpen } = useAppState();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "assistant",
      message: "Hello! I can help you with procurement workflows, spend forecasting, and navigation. Try one of the quick actions below or ask me anything.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const addMessage = (sender: "user" | "assistant", message: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender,
      message,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    addMessage("user", inputValue);
    const userMessage = inputValue.toLowerCase();
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      let response = "I can help you navigate the procurement system, analyze spending patterns, check workflows, and provide guidance. What specific area would you like assistance with?";

      if (userMessage.includes("workflow") && userMessage.includes("req-")) {
        const reqMatch = userMessage.match(/req-\d+/i);
        if (reqMatch) {
          const reqId = reqMatch[0].toUpperCase();
          response = `I found the workflow for ${reqId}. It's currently pending manager approval. Would you like me to show the detailed workflow view?`;
        }
      } else if (userMessage.includes("forecast") || userMessage.includes("spend")) {
        response = "Based on historical data, I can see spending patterns. For detailed forecasting, please visit the Analytics section where you can drill down by SKU, department, and time windows.";
      } else if (userMessage.includes("blanket") && userMessage.includes("po")) {
        response = "For blanket PO creation, I recommend reviewing the top spending SKUs in your department. Based on current data, your R&D team shows consistent usage patterns that would benefit from blanket POs.";
      } else if (userMessage.includes("budget") || userMessage.includes("funds")) {
        response = "Current budget alerts: PO-24568 (TechSupply Inc) is at 87% utilization with 3 months remaining. I recommend reviewing the budget allocation in the Analytics section.";
      }

      addMessage("assistant", response);
    }, 1000);
  };

  const handlePromptClick = (prompt: typeof mockChatPrompts[0]) => {
    addMessage("user", prompt.text);
    setTimeout(() => {
      addMessage("assistant", prompt.response);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      <button
        className="ai-chat-toggle"
        onClick={() => setChatOpen(true)}
        style={{ display: state.chatOpen ? "none" : "flex" }}
      >
        <Bot className="h-6 w-6" />
      </button>

      <div className={`ai-chat-dock ${state.chatOpen ? "open" : ""}`}>
        <div className="bg-primary text-primary-foreground p-4 rounded-t-xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <span className="font-medium">PPO Assistant</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setChatOpen(false)}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex flex-wrap gap-2 mb-4">
            {mockChatPrompts.map((prompt) => (
              <button
                key={prompt.id}
                className="prompt-chip"
                onClick={() => handlePromptClick(prompt)}
              >
                {prompt.text}
              </button>
            ))}
          </div>

          <div className="flex-1 max-h-48 overflow-y-auto mb-4 space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg text-sm ${
                  message.sender === "user"
                    ? "bg-accent text-accent-foreground ml-2"
                    : "bg-muted mr-2"
                }`}
              >
                <div className="font-medium text-xs mb-1">
                  {message.sender === "user" ? "You" : "PPO Assistant"}:
                </div>
                {message.message}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about workflows, forecasts, or guidance..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
