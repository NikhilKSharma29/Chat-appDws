
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FiHome, FiMessageSquare, FiSettings, FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';

export default function ChatLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isChatPage = pathname?.includes('ai-chat');

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const navItems = [
    { name: 'Home', path: '/', icon: <FiHome className="w-5 h-5" /> },
    { name: 'Chat', path: '/ai-chat', icon: <FiMessageSquare className="w-5 h-5" /> },
    { name: 'Settings', path: '/settings', icon: <FiSettings className="w-5 h-5" /> },
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Mobile menu */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden ${
          isMenuOpen ? 'block' : 'hidden'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              AI
            </div>
            <span className="text-xl font-bold dark:text-white">AI Chat</span>
          </div>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                router.push(item.path);
                setIsMenuOpen(false);
              }}
              className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                pathname === item.path
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-100'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? (
              <>
                <FiSun className="w-5 h-5 mr-3" />
                Light Mode
              </>
            ) : (
              <>
                <FiMoon className="w-5 h-5 mr-3" />
                Dark Mode
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <header 
          className={`sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300 ${
            scrolled ? 'shadow-sm' : ''
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FiMenu className="w-6 h-6" />
                </button>
                <h1 className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {navItems.find(item => item.path === pathname)?.name || 'AI Chat'}
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button
                    type="button"
                    className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:ring-offset-gray-800"
                  >
                    <span className="sr-only">View notifications</span>
                    <div className="relative">
                      <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
                    </div>
                  </button>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:ring-offset-gray-800"
                    id="user-menu-button"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                      U
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className={`flex-1 ${isChatPage ? 'py-6' : 'flex items-center justify-center p-4'}`}>
          <div className="w-full h-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
