"use client";

import ChatLayout from "@/app/components/aiChat/ChatLayout";
import React, { useState, useRef, useEffect } from "react";
import PromptCards from "@/app/components/aiChat/PromptCards";
import ChatInput from "@/app/components/aiChat/ChatInput";
import ChatMessageList from "@/app/components/aiChat/ChatMessageList";

const AIChatPage = () => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert string timestamps back to Date objects
        const messagesWithDates = parsedMessages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error("Failed to parse saved messages:", error);
        setDefaultMessage();
      }
    } else {
      setDefaultMessage();
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  const setDefaultMessage = () => {
    setMessages([
      {
        id: 1,
        text: "Hi there! I'm your AI assistant. How can I help you today?",
        sender: "ai",
        timestamp: new Date(),
      },
    ]);
  };

  const handleNewChat = () => {
    localStorage.removeItem("chatHistory");
    setDefaultMessage();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Show loading state
    const loadingMessage = {
      id: "loading-" + Date.now(),
      text: "Thinking...",
      sender: "ai",
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, loadingMessage]);

    try {
      // Prepare messages array in the format expected by the API
      const chatMessages = [
        ...messages.map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        })),
        { role: "user", content: message },
      ];

      console.log("Sending request to API with messages:", chatMessages);

      let response;
      let responseData;

      try {
        response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: chatMessages }),
        });

        console.log("API response status:", response.status);

        // First, get the response as text to handle potential non-JSON responses
        const responseText = await response.text();

        // Try to parse as JSON, but handle cases where it's not valid JSON
        try {
          responseData = responseText ? JSON.parse(responseText) : {};
        } catch (jsonError) {
          console.error("Failed to parse API response as JSON:", jsonError);
          throw new Error(
            `Invalid response from server: ${response.status} ${response.statusText}`
          );
        }

        console.log("API response data:", responseData);

        if (!response.ok) {
          throw new Error(
            responseData.error ||
              responseData.message ||
              `Request failed with status ${response.status}`
          );
        }
      } catch (fetchError) {
        console.error("Fetch error:", fetchError);
        throw new Error(
          fetchError.message || "Failed to connect to the server"
        );
      }

      // Remove loading message and add AI response
      setMessages((prev) => {
        const newMessages = prev.filter((msg) => !msg.isLoading);
        return [
          ...newMessages,
          {
            id: responseData.id || Date.now() + 1,
            text: responseData.content,
            sender: "ai",
            timestamp: new Date(responseData.timestamp || Date.now()),
          },
        ];
      });
    } catch (error) {
      console.error("Error sending message:", error);

      // Remove loading message and show error
      setMessages((prev) => {
        const newMessages = prev.filter((msg) => !msg.isLoading);
        const fallbackResponses = [
          `I'm having trouble connecting to the AI service. (${error.message})`,
          `Sorry, I encountered an error: ${error.message}`,
          `I'm unable to process your request: ${error.message}`,
        ];

        return [
          ...newMessages,
          {
            id: Date.now() + 1,
            text: fallbackResponses[
              Math.floor(Math.random() * fallbackResponses.length)
            ],
            sender: "ai",
            timestamp: new Date(),
            isError: true,
          },
        ];
      });
    }
  };

  const handleQuickPrompt = (prompt) => {
    handleSendMessage(prompt);
  };

  return (
    <ChatLayout>
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            AI Chat
          </h1>
          <button
            onClick={handleNewChat}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {messages.length <= 1 ? (
            <div className="h-full flex flex-col">
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
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full p-4 space-y-4">
              <ChatMessageList messages={messages} />
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto w-full">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </ChatLayout>
  );
};

export default AIChatPage;
