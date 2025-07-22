// components/aiChat/PromptCards.jsx
import { motion } from 'framer-motion';

const prompts = [
  {
    title: 'Creative Ideas',
    description: 'Help me brainstorm ideas for a new project',
    emoji: '💡',
  },
  {
    title: 'Coding Help',
    description: 'Explain how to use React hooks',
    emoji: '👨‍💻',
  },
  {
    title: 'Fun Fact',
    description: 'Tell me something interesting',
    emoji: '✨',
  },
  {
    title: 'Productivity',
    description: 'Suggest ways to stay focused',
    emoji: '⏱️',
  },
];

const PromptCard = ({ title, description, emoji, onClick }) => (
  <motion.button
    whileHover={{ y: -2, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-left transition-all duration-200 hover:border-blue-200 dark:hover:border-blue-800"
  >
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-xl">
        {emoji}
      </div>
      <div>
        <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {description}
        </p>
      </div>
    </div>
  </motion.button>
);

export default function PromptCards({ onSelectPrompt }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mx-auto">
      {prompts.map((prompt, index) => (
        <PromptCard
          key={index}
          title={prompt.title}
          description={prompt.description}
          emoji={prompt.emoji}
          onClick={() => onSelectPrompt(prompt.description)}
        />
      ))}
    </div>
  );
}