import { JSX } from 'react';

/**
 * Get an appropriate emoji for each media category
 */
export function getCategoryEmoji(category: string): string {
    const categoryMap: Record<string, string> = {
        'Ação': '💥',
        'Aventura': '🏞️',
        'Comédia': '😂',
        'Drama': '😢',
        'Ficção Científica': '🚀',
        'Terror': '👻',
        'Romance': '❤️',
        'Fantasia': '🧙',
        'Animação': '🎬',
        'Documentário': '📚',
        'Crime': '🕵️',
        'Histórico': '📜',
        'Musical': '🎵',
        'Mistério': '🔍',
        'Thriller': '😱',
        'Guerra': '⚔️',
        'Faroeste': '🤠',
    };

    return categoryMap[category] || '🎭'; // Default emoji
}

/**
 * Get appropriate badge component for each category
 */
export function getCategoryBadge(category: string, isDark: boolean): JSX.Element {
    const categoryColorMap: Record<string, string> = {
        'Ação': 'from-red-500 to-orange-500',
        'Aventura': 'from-emerald-500 to-green-500',
        'Comédia': 'from-yellow-500 to-amber-500',
        'Drama': 'from-blue-500 to-indigo-500',
        'Ficção Científica': 'from-purple-500 to-violet-500',
        'Terror': 'from-gray-600 to-gray-800',
        'Romance': 'from-pink-500 to-red-500',
        'Fantasia': 'from-indigo-500 to-purple-500',
        'Animação': 'from-blue-400 to-cyan-500',
        'Documentário': 'from-amber-500 to-yellow-500',
        'Crime': 'from-gray-500 to-gray-700',
        'Histórico': 'from-amber-700 to-yellow-700',
        'Musical': 'from-pink-500 to-purple-500',
        'Mistério': 'from-indigo-600 to-purple-800',
        'Thriller': 'from-red-600 to-red-800',
        'Guerra': 'from-slate-600 to-slate-800',
        'Faroeste': 'from-amber-700 to-brown-700',
    };

    const gradientClass = categoryColorMap[category] || 'from-gray-500 to-gray-700';

    return (
        <span className={`bg-gradient-to-r ${gradientClass} text-white text-xs px-2 py-0.5 rounded-full font-medium`}>
            {category}
        </span>
    );
}
