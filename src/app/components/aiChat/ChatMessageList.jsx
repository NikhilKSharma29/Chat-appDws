
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { FaUser, FaRobot } from 'react-icons/fa';

const MessageBubble = ({ message, isUser }) => {
  // Determine if this is a loading or error message
  const isLoading = message.isLoading;
  const isError = message.isError;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start max-w-[90%]`}>
        <div 
          className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
            isUser 
              ? 'ml-3 bg-blue-500 text-white' 
              : isError 
                ? 'mr-3 bg-red-500 text-white'
                : 'mr-3 bg-gray-200 text-gray-600'
          }`}
        >
          {isUser ? <FaUser size={14} /> : <FaRobot size={16} />}
        </div>
        <div className="min-w-0">
          <div
            className={`px-4 py-3 rounded-2xl ${
              isUser
                ? 'bg-blue-500 text-white rounded-tr-none'
                : isError
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-tl-none'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-none'
            } shadow-sm`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              <div className="whitespace-pre-wrap break-words text-sm md:text-base">
                {message.text}
              </div>
            )}
            <div
              className={`text-xs mt-1.5 flex items-center ${
                isUser 
                  ? 'text-blue-100' 
                  : isError 
                    ? 'text-red-700 dark:text-red-300'
                    : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <span>{format(new Date(message.timestamp), 'h:mm a')}</span>
              {isUser && (
                <span className="ml-1.5">
                  {message.status === 'sending' && '🔄'}
                  {message.status === 'delivered' && '✓'}
                  {message.status === 'error' && '⚠️'}
                </span>
              )}
            </div>
          </div>
          {isError && (
            <div className="text-xs text-red-500 dark:text-red-400 mt-1 px-1">
              {message.text.includes('try again') ? 'Please try again later' : 'An error occurred'}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function ChatMessageList({ messages }) {
  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 p-6 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <FaRobot size={24} className="text-gray-300 dark:text-gray-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">No messages yet</h3>
        <p className="mt-1 text-sm max-w-xs">
          Start a conversation by sending a message or selecting a prompt below
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-1">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isUser={message.sender === 'user'}
        />
      ))}
    </div>
  );
}
