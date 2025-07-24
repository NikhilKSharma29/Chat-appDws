"use client";
import { useState, useEffect, useRef } from "react";
import { FiSend, FiPaperclip, FiMic } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatInput({ onSendMessage, isSending = false }) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = (e) => {
    e?.preventDefault();
    const message = input.trim();
    if (!message) return;

    onSendMessage(message);
    setInput("");
    // Reset textarea height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const handleFileUpload = () => {
    console.log("File upload clicked");
  };

  const handleVoiceInput = () => {
    console.log("Voice input clicked");
  };

  return (
    <form onSubmit={handleSend} className="w-full">
      <div
        className={`relative flex items-end w-full bg-white dark:bg-gray-800 rounded-2xl border transition-all duration-200 ${
          isFocused
            ? "border-blue-400 dark:border-blue-600 ring-2 ring-blue-100 dark:ring-blue-900/50"
            : "border-gray-200 dark:border-gray-600"
        }`}
      >
        <button
          type="button"
          onClick={handleFileUpload}
          className="p-2 text-gray-400 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
          aria-label="Attach file"
        >
          <FiPaperclip className="w-5 h-5" />
        </button>

        {/* Text input */}
        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full px-2 py-3 bg-transparent border-0 focus:ring-0 resize-none overflow-hidden max-h-32 scrollbar-hide"
            style={{ minHeight: "44px" }}
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center pr-2">
          <AnimatePresence>
            {input.trim() ? (
              <motion.button
                type="submit"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="p-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                disabled={isSending}
                aria-label="Send message"
              >
                {isSending ? (
                  <div className="w-5 h-5 border-2 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FiSend className="w-5 h-5" />
                )}
              </motion.button>
            ) : (
              <button
                type="button"
                onClick={handleVoiceInput}
                className="p-2 text-gray-400 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                aria-label="Voice input"
              >
                <FiMic className="w-5 h-5" />
              </button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Character counter */}
      <div className="mt-1 flex justify-end">
        <span
          className={`text-xs ${
            input.length > 500
              ? "text-red-500"
              : "text-gray-400 dark:text-gray-500"
          }`}
        >
          {input.length}/500
        </span>
      </div>
    </form>
  );
}
