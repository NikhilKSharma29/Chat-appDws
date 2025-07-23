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
      id: 'loading-' + Date.now(),
      text: 'Thinking...',
      sender: 'ai',
      timestamp: new Date(),
      isLoading: true
    };
    
    setMessages(prev => [...prev, loadingMessage]);

    try {
      // Prepare messages array in the format expected by the API
      const chatMessages = [
        ...messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
        { role: 'user', content: message }
      ];

      console.log('Sending request to API with messages:', chatMessages);
      
      let response;
      let responseData;
      
      try {
        response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: chatMessages }),
        });
        
        console.log('API response status:', response.status);
        
        // First, get the response as text to handle potential non-JSON responses
        const responseText = await response.text();
        
        // Try to parse as JSON, but handle cases where it's not valid JSON
        try {
          responseData = responseText ? JSON.parse(responseText) : {};
        } catch (jsonError) {
          console.error('Failed to parse API response as JSON:', jsonError);
          throw new Error(`Invalid response from server: ${response.status} ${response.statusText}`);
        }
        
        console.log('API response data:', responseData);

        if (!response.ok) {
          throw new Error(
            responseData.error || 
            responseData.message || 
            `Request failed with status ${response.status}`
          );
        }
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        
        // Handle quota exceeded error specifically
        if (fetchError.message.includes('quota') || fetchError.message.includes('billing')) {
          throw new Error(
            '⚠️ ' + fetchError.message + '\n\n' +
            'To continue using the chat, you can:\n' +
            '1. Check your OpenAI account billing status\n' +
            '2. Update your payment method if needed\n' +
            '3. Or wait for your quota to reset'
          );
        }
        
        throw new Error(fetchError.message || 'Failed to connect to the server');
      }
      
      // Remove loading message and add AI response
      setMessages(prev => {
        const newMessages = prev.filter(msg => !msg.isLoading);
        return [
          ...newMessages,
          {
            id: responseData.id || Date.now() + 1,
            text: responseData.content,
            sender: 'ai',
            timestamp: new Date(responseData.timestamp || Date.now()),
          }
        ];
      });
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove loading message and show error
      setMessages(prev => {
        const newMessages = prev.filter(msg => !msg.isLoading);
        const fallbackResponses = [
          `I'm having trouble connecting to the AI service. (${error.message})`,
          `Sorry, I encountered an error: ${error.message}`,
          `I'm unable to process your request: ${error.message}`
        ];
        
        return [
          ...newMessages,
          {
            id: Date.now() + 1,
            text: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
            sender: 'ai',
            timestamp: new Date(),
            isError: true
          }
        ];
      });
    }
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
