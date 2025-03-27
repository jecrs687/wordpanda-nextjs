'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useState } from 'react';

const languages = [
    { name: "Espanhol", code: "es", flag: "🇪🇸", popularity: "Popular", color: "from-amber-500 to-red-500" },
    { name: "Inglês", code: "en", flag: "🇬🇧", popularity: "Mais Popular", color: "from-blue-500 to-indigo-500" },
    { name: "Francês", code: "fr", flag: "🇫🇷", popularity: "Popular", color: "from-blue-500 to-red-500" },
    { name: "Alemão", code: "de", flag: "🇩🇪", popularity: "Tendência", color: "from-red-500 to-yellow-500" },
    { name: "Italiano", code: "it", flag: "🇮🇹", popularity: "Popular", color: "from-green-500 to-red-500" },
    { name: "Japonês", code: "ja", flag: "🇯🇵", popularity: "Em alta", color: "from-red-500 to-white" },
    { name: "Mandarim", code: "zh", flag: "🇨🇳", popularity: "Em alta", color: "from-red-500 to-yellow-500" },
    { name: "Coreano", code: "ko", flag: "🇰🇷", popularity: "Tendência", color: "from-blue-500 to-red-500" },
    { name: "Russo", code: "ru", flag: "🇷🇺", popularity: "Popular", color: "from-blue-500 to-red-500" },
    { name: "Português", code: "pt", flag: "🇵🇹", popularity: "Popular", color: "from-green-500 to-red-500" },
    { name: "Árabe", code: "ar", flag: "🇸🇦", popularity: "Em alta", color: "from-green-500 to-white" },
    { name: "Hindi", code: "hi", flag: "🇮🇳", popularity: "Em alta", color: "from-orange-500 to-green-500" },
];

export const Step1LanguageSelection = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredLanguages = languages.filter(lang =>
        lang.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Qual idioma você deseja aprender?</h2>

                <div className="mb-8">
                    <div className={cn(
                        "relative mb-8",
                    )}>
                        <input
                            type="text"
                            placeholder="Buscar idioma..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={cn(
                                "w-full px-5 py-4 rounded-xl text-lg",
                                isDark
                                    ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                                    : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-cyan-500/50 focus:ring-cyan-500/20",
                                "border focus:outline-none focus:ring-4 transition-all duration-300"
                            )}
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isDark ? "text-gray-400" : "text-gray-500"}>
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredLanguages.map((language) => (
                            <motion.div
                                key={language.code}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -5, scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => setSelectedLanguage(language.code)}
                                className={cn(
                                    "rounded-xl p-4 border cursor-pointer transition-all duration-300",
                                    selectedLanguage === language.code
                                        ? (isDark ? "bg-cyan-900/50 border-cyan-700" : "bg-cyan-50 border-cyan-200")
                                        : (isDark ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800" : "bg-white border-gray-200 hover:bg-gray-50")
                                )}
                            >
                                <div className="flex items-center mb-3">
                                    <span className="text-3xl mr-3">{language.flag}</span>
                                    <div>
                                        <h3 className="font-medium">{language.name}</h3>
                                        <div className={cn(
                                            "text-xs px-2 py-0.5 rounded-full inline-block",
                                            isDark ? "bg-cyan-500/20 text-cyan-300" : "bg-cyan-100 text-cyan-700"
                                        )}>
                                            {language.popularity}
                                        </div>
                                    </div>
                                </div>

                                {selectedLanguage === language.code && (
                                    <div className={cn(
                                        "flex items-center justify-center text-xs gap-1 rounded-lg py-1",
                                        isDark ? "bg-cyan-500/20 text-cyan-300" : "bg-cyan-100 text-cyan-700"
                                    )}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 6 9 17l-5-5" />
                                        </svg>
                                        <span>Selecionado</span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-500/20 text-sm flex items-start gap-3">
                    <div className="text-cyan-500 shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4" />
                            <path d="M12 8h.01" />
                        </svg>
                    </div>
                    <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                        O WordPanda oferece suporte a mais de 30 idiomas, cada um com conteúdo culturalmente relevante e adaptado às necessidades específicas dos falantes de português. Você pode estudar quantos idiomas quiser simultaneamente.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
