"use client";

import ChatLayout from "@/app/components/aiChat/ChatLayout";
import React, { useState, useRef, useEffect } from "react";
import PromptCards from "@/app/components/aiChat/PromptCards";
import ChatInput from "@/app/components/aiChat/ChatInput";
import ChatMessageList from "@/app/components/aiChat/ChatMessageList";

const AIChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm your AI assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef(null);

  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (message) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const aiResponses = [
        "I understand you said: " + message,
        "That's an interesting point about " + message,
        "Thanks for sharing that with me!",
        "I'll look into that for you.",
        "Could you tell me more about that?",
      ];
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const handleQuickPrompt = (prompt) => {
    handleSendMessage(prompt);
  };

  return (
    <ChatLayout>
      <div className="w-full max-w-4xl mx-auto flex flex-col h-[calc(100vh-200px)]">
        {messages.length <= 1 ? (
          <div className="text-center space-y-6 my-auto">
            <div>
              <h2 className="text-lg">Hello 👋</h2>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                What would you like to know?
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Use one of the most common prompts below or type your own.
              </p>
            </div>
            <PromptCards onSelectPrompt={handleQuickPrompt} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <ChatMessageList messages={messages} />
            <div ref={messagesEndRef} />
          </div>
        )}
        
        <div className="mt-4 p-4 border-t">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </ChatLayout>
  );
};

export default AIChatPage;
