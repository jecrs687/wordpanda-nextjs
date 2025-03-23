'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type ConfettiPiece = {
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    rotation: number;
};

type ConfettiEffectProps = {
    active?: boolean;
    pieces?: number;
    duration?: number;
};

const COLORS = [
    '#10b981', // emerald-500
    '#6366f1', // indigo-500
    '#f59e0b', // amber-500
    '#3b82f6', // blue-500
    '#ec4899', // pink-500
    '#8b5cf6', // violet-500
];

const ConfettiEffect = ({
    active = true,
    pieces = 100,
    duration = 3000
}: ConfettiEffectProps) => {
    const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

    useEffect(() => {
        if (!active) {
            setConfetti([]);
            return;
        }

        // Generate confetti pieces
        const newConfetti: ConfettiPiece[] = [];
        for (let i = 0; i < pieces; i++) {
            newConfetti.push({
                id: i,
                x: Math.random() * 100, // random x position (0-100%)
                y: -10 - Math.random() * 10, // start slightly above the viewport
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                size: 7 + Math.random() * 10, // random size between 7px and 17px
                rotation: Math.random() * 360, // random rotation
            });
        }

        setConfetti(newConfetti);

        // Clear confetti after duration
        const timeout = setTimeout(() => {
            setConfetti([]);
        }, duration);

        return () => clearTimeout(timeout);
    }, [active, pieces, duration]);

    if (confetti.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            {confetti.map((piece) => (
                <motion.div
                    key={piece.id}
                    className="absolute"
                    style={{
                        left: `${piece.x}%`,
                        top: `${piece.y}%`,
                        width: `${piece.size}px`,
                        height: `${piece.size}px`,
                        backgroundColor: piece.color,
                        borderRadius: piece.size > 12 ? '50%' : '2px',
                        transform: `rotate(${piece.rotation}deg)`,
                    }}
                    initial={{ y: piece.y + '%', opacity: 1 }}
                    animate={{
                        y: '120%',
                        opacity: [1, 1, 0],
                        rotate: piece.rotation + (Math.random() * 360 - 180),
                        x: piece.x + (Math.random() * 10 - 5) + '%',
                    }}
                    transition={{
                        duration: 2 + Math.random() * 2,
                        ease: "easeOut",
                        delay: Math.random() * 0.5,
                    }}
                />
            ))}
        </div>
    );
};

export default ConfettiEffect;
