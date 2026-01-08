import React from 'react';
import { Menu, X, Github, Languages, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileMenuProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    toggleLanguage: () => void;
    toggleTheme: () => void;
    lang: 'en' | 'cn';
    theme: 'dark' | 'light';
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
    isOpen,
    setIsOpen,
    toggleLanguage,
    toggleTheme,
    lang,
    theme
}) => {
    return (
        <div className="md:hidden">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 -mr-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full transition-colors"
                aria-label="Menu"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Backdrop & Menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 top-[60px] bg-black/60 dark:bg-black/80 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="fixed top-[70px] right-4 left-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="p-2 space-y-1">
                                {/* Github */}
                                <a
                                    href="https://github.com/JaffryGao/notebooklmfix"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                                >
                                    <Github className="w-5 h-5" />
                                    <span className="font-medium">GitHub Repository</span>
                                </a>

                                {/* Theme Toggle */}
                                <button
                                    onClick={() => { toggleTheme(); setIsOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-colors text-left"
                                >
                                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                    <span className="font-medium">{theme === 'dark' ? (lang === 'en' ? 'Light Mode' : '浅色模式') : (lang === 'en' ? 'Dark Mode' : '深色模式')}</span>
                                </button>

                                {/* Language Toggle */}
                                <button
                                    onClick={() => { toggleLanguage(); setIsOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-colors text-left"
                                >
                                    <Languages className="w-5 h-5" />
                                    <span className="font-medium">{lang === 'en' ? '切换中文' : 'Switch to English'}</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
