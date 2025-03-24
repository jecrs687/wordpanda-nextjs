import { motion } from 'framer-motion';
import { BarChart3, Gamepad2, Users } from 'lucide-react';

interface FeatureCardProps {
    feature: {
        id: number;
        title: string;
        description: string;
        icon: string;
        color: string;
    };
    index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index }) => {
    // Card animation variants
    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                delay: 0.3 + (index * 0.2),
                duration: 0.5,
                ease: "easeOut"
            }
        },
        hover: {
            y: -5,
            boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.1)",
            borderColor: "#10b981",
            transition: { duration: 0.2 }
        }
    };

    // Map icon string to Lucide icon components
    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'game-controller':
                return <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" />;
            case 'bar-chart':
                return <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />;
            case 'users':
                return <Users className="w-5 h-5 sm:w-6 sm:h-6" />;
            default:
                return <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" />;
        }
    };

    return (
        <motion.div
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="bg-white dark:bg-zinc-900 backdrop-blur-md rounded-xl p-3 sm:p-4 md:p-5 
                border border-zinc-200 dark:border-zinc-800 shadow-sm
                transition-all duration-300 flex flex-col items-center h-full"
        >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3 md:mb-4 rounded-full flex items-center justify-center text-white dark:text-black ${feature.color}`}>
                {getIcon(feature.icon)}
            </div>

            <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-2 text-black dark:text-white">{feature.title}</h3>

            <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">{feature.description}</p>

            {/* Panda paw print accent at the bottom - hidden on the smallest screens */}
            <motion.div
                className="mt-2 opacity-20 hidden sm:block"
                initial={{ opacity: 0, scale: 0.5 }}
                whileHover={{ opacity: 0.3, scale: 1.1 }}
                transition={{ duration: 0.3 }}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12,1.85c-0.5,0-1,0.15-1.41,0.41C10.18,2.51,10,2.85,10,3.25v0.5C10,4.45,9.55,5,9,5H8.5
                        C8.1,5,7.76,5.18,7.51,5.59C7.25,6,7.1,6.5,7.1,7c0,1.1,0.9,2,2,2h5.8c1.1,0,2-0.9,2-2c0-0.5-0.15-1-0.41-1.41
                        C16.24,5.18,15.9,5,15.5,5H15c-0.55,0-1-0.45-1-1v-0.5c0-0.4-0.18-0.74-0.59-0.99C13,2,12.5,1.85,12,1.85z" />
                    <path d="M7,10c-0.5,0-1,0.15-1.41,0.41C5.18,10.66,5,11,5,11.4v0.5c0,0.55-0.45,1-1,1H3.5c-0.4,0-0.74,0.18-0.99,0.59
                        C2.15,14,2,14.5,2,15c0,1.1,0.9,2,2,2h5.8c1.1,0,2-0.9,2-2c0-0.5-0.15-1-0.41-1.41C11.14,13.18,10.8,13,10.4,13H10
                        c-0.55,0-1-0.45-1-1v-0.5C9,11.1,8.9,10.75,8.59,10.4C8.2,10.15,7.7,10,7,10z" />
                    <path d="M16.6,11.5c-0.4,0-0.74,0.18-0.99,0.59C15.35,12.5,15.2,13,15.2,13.5c0,1.1,0.9,2,2,2h2.8c1.1,0,2-0.9,2-2
                        c0-0.5-0.15-1-0.41-1.41c-0.25-0.41-0.59-0.59-0.99-0.59H20c-0.55,0-1-0.45-1-1v-0.5c0-0.4-0.18-0.74-0.59-0.99
                        C18,9.15,17.5,9,17,9c-0.5,0-1,0.15-1.41,0.41C15.18,9.66,15,10,15,10.4v0.5c0,0.55-0.45,1-1,1H16.6z" />
                    <path d="M12,20c-0.5,0-1,0.15-1.41,0.41C10.18,20.66,10,21,10,21.4v0.5c0,0.55-0.45,1-1,1H8.5
                        c-0.4,0-0.74,0.18-0.99,0.59C7.15,24,7,24.5,7,25c0,1.1,0.9,2,2,2h5.8c1.1,0,2-0.9,2-2c0-0.5-0.15-1-0.41-1.41
                        C16.14,23.18,15.8,23,15.4,23H15c-0.55,0-1-0.45-1-1v-0.5c0-0.4-0.18-0.74-0.59-0.99C13,20.15,12.5,20,12,20z" />
                </svg>
            </motion.div>
        </motion.div>
    );
};

export default FeatureCard;
