'use client';

import { PawPrint } from 'lucide-react';

type MemoryCardProps = {
    text: string;
    isFlipped: boolean;
    isMatched: boolean;
    language: 'word' | 'meaning';
};

const MemoryCard = ({
    text,
    isFlipped,
    isMatched,
    language,
}: MemoryCardProps) => {
    // Card front variants (back of card - face down)
    const getCardFront = () => {
        const baseClasses = "absolute inset-0 backface-hidden rounded-xl p-3 flex flex-col items-center justify-center shadow-md transform-gpu";

        if (isMatched) {
            return `${baseClasses} bg-emerald-100/90 dark:bg-emerald-900/90 border border-emerald-200 dark:border-emerald-800`;
        }

        return `${baseClasses} bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50`;
    };

    // Card back variants (front of card - face up)
    const getCardBack = () => {
        if (language === 'word') {
            return "bg-indigo-100/90 dark:bg-indigo-900/90 border-indigo-200 dark:border-indigo-700 text-indigo-800 dark:text-indigo-200";
        }
        return "bg-blue-100/90 dark:bg-blue-900/90 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200";
    };

    return (
        <div className="relative w-full h-full transform-style-3d transition-all duration-500" style={{
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'
        }}>
            {/* Card back (face down) */}
            <div className={getCardFront()}>
                <PawPrint className="w-10 h-10 text-gray-300 dark:text-gray-600" />
            </div>

            {/* Card front (face up) */}
            <div className={`absolute inset-0 backface-hidden rounded-xl border p-4 flex flex-col items-center justify-center text-center shadow-lg ${getCardBack()}`} style={{
                transform: 'rotateY(180deg)'
            }}>
                <div className="overflow-hidden max-h-full w-full flex flex-col justify-center items-center">
                    <p className="font-medium text-lg mb-1">{text}</p>
                    <span className="text-xs opacity-70 mt-2">
                        {language === 'word' ? 'word' : 'meaning'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MemoryCard;
