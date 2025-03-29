'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import {
    Clock,
    Film,
    Gamepad2,
    Heart,
    TrendingUp
} from 'lucide-react';
import { useTheme } from 'next-themes';

type FeatureCardProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
    gradient: string;
    delay: number;
    animate?: boolean;
};

function FeatureCard({ icon, title, description, gradient, delay, animate = false }: FeatureCardProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <motion.div
            className={cn(
                "rounded-2xl p-6 h-full",
                "border",
                isDark
                    ? "bg-gray-900/60 border-gray-800 backdrop-blur-xl"
                    : "bg-white/80 border-gray-200 backdrop-blur-xl",
                "flex flex-col items-start"
            )}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay }}
        >
            <motion.div
                className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center mb-4",
                    "bg-gradient-to-br",
                    gradient
                )}
                animate={animate ? {
                    scale: [1, 1.1, 1],
                } : {}}
                transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 2,
                    repeatDelay: 1
                }}
            >
                {icon}
            </motion.div>

            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className={cn(
                "text-sm",
                isDark ? "text-zinc-400" : "text-zinc-600"
            )}>{description}</p>
        </motion.div>
    );
}

export default function FeatureShowcase() {
    const features = [
        {
            icon: <Film className="h-6 w-6 text-white" />,
            title: "Subtítulos Inteligentes",
            description: "Aprenda palavras importantes de filmes e séries com nossa tecnologia de extração de legendas.",
            gradient: "from-indigo-500 to-blue-700",
            animate: false
        },
        {
            icon: <Gamepad2 className="h-6 w-6 text-white" />,
            title: "Aprendizado Gamificado",
            description: "Transforme seu estudo em uma experiência divertida com jogos interativos e desafios.",
            gradient: "from-emerald-500 to-green-700",
            animate: true
        },
        {
            icon: <Clock className="h-6 w-6 text-white" />,
            title: "Repetição Espaçada",
            description: "Nosso algoritmo inteligente apresenta palavras no momento ideal para maximizar sua memorização.",
            gradient: "from-amber-500 to-orange-700",
            animate: false
        },
        {
            icon: <TrendingUp className="h-6 w-6 text-white" />,
            title: "Progresso Visível",
            description: "Acompanhe sua evolução com estatísticas detalhadas e visualização clara do seu avanço.",
            gradient: "from-rose-500 to-red-700",
            animate: false
        },
    ];

    return (
        <section className="py-10">
            <div className="text-center mb-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500"
                >
                    <Heart className="h-4 w-4" />
                    <span className="text-sm font-medium">Recursos Exclusivos</span>
                </motion.div>

                <motion.h2
                    className="text-3xl font-bold mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Por que você vai <span className="text-emerald-500">amar</span> o WordPanda
                </motion.h2>

                <motion.p
                    className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    Combinamos ciência da aprendizagem com entretenimento para criar a maneira mais eficaz e divertida de aprender idiomas.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                    <FeatureCard
                        key={index}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                        gradient={feature.gradient}
                        delay={index * 0.1}
                        animate={feature.animate}
                    />
                ))}
            </div>
        </section>
    );
}
