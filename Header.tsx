import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSelector from './LanguageSelector';
import { useAuth } from '../hooks/useAuth';
import { LogoutIcon } from './icons/LogoutIcon';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
            {t('headerTitle')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t('headerSubtitle')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {currentUser && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                {t('welcomeUser', { username: currentUser.username })}
              </span>
              <button
                onClick={logout}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-violet-500 transition-colors"
                aria-label={t('logout')}
                title={t('logout')}
              >
                <LogoutIcon className="w-6 h-6" />
              </button>
            </div>
          )}
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;