import { ROUTES } from '@constants/ROUTES';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function LoginRegisterStep({ router, windowWidth, windowHeight }) {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
        exit: { opacity: 0 }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    // Navigate to pages
    const handleRegister = () => router.push(ROUTES.REGISTER());
    const handleLogin = () => router.push(ROUTES.LOGIN());

    return (
        <motion.div
            className="flex flex-col items-center justify-center h-full w-full px-4 relative overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
        >

            {/* Dynamic background */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-pink-100 to-yellow-100 z-1" />

            {/* Language bubbles */}
            {['🇺🇸', '🇪🇸', '🇫🇷', '🇩🇪', '🇮🇹', '🇯🇵', '🇰🇷', '🇨🇳'].map((flag, index) => (
                <motion.div
                    key={index}
                    className="absolute text-2xl"
                    style={{
                        left: `${Math.random() * 90 + 5}%`,
                        top: `${Math.random() * 90 + 5}%`,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                        scale: [0, 1.2, 1],
                        opacity: 1,
                    }}
                    transition={{
                        delay: index * 0.2 + 0.5,
                        duration: 0.6,
                    }}
                >
                    {flag}
                </motion.div>
            ))}

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-br from-purple-300/20 to-pink-300/20 backdrop-blur-xl"
                        style={{
                            width: Math.random() * 200 + 100,
                            height: Math.random() * 200 + 100,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            x: [0, Math.random() * 40 - 20],
                            y: [0, Math.random() * 40 - 20],
                        }}
                        transition={{
                            repeat: Infinity,
                            repeatType: "reverse",
                            duration: Math.random() * 5 + 5,
                        }}
                    />
                ))}
            </div>

            {/* Content container */}
            <motion.div
                className="relative z-15 max-w-md bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden"
                variants={itemVariants}
            >
                {/* Header with panda image */}
                <div className="relative">
                    <div className="h-32 bg-gradient-to-r from-purple-600 to-pink-500"></div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
                        <div className="w-32 h-32 rounded-full bg-white p-2 shadow-lg">
                            <Image
                                src="/assets/panda-logo.png"
                                alt="WordPanda"
                                width={128}
                                height={128}
                                className="rounded-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-8 pt-20 pb-8 text-center">
                    <motion.h2
                        className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-3"
                        variants={itemVariants}
                    >
                        Junte-se à comunidade!
                    </motion.h2>

                    <motion.p
                        className="text-gray-600 mb-8"
                        variants={itemVariants}
                    >
                        Crie uma conta ou faça login para começar sua jornada de aprendizado de idiomas.
                    </motion.p>

                    <div className="flex flex-col space-y-4">
                        <motion.button
                            className="py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-xl shadow-lg cursor-pointer"
                            onClick={handleRegister}
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.4)" }}
                            whileTap={{ scale: 0.98 }}
                            variants={itemVariants}
                        >
                            Criar uma conta
                        </motion.button>

                        <motion.button
                            className="py-3 px-6 bg-white border-2 border-purple-500 text-purple-600 font-medium rounded-xl shadow-md cursor-pointer"
                            onClick={handleLogin}
                            whileHover={{ scale: 1.05, boxShadow: "0 5px 15px -5px rgba(168, 85, 247, 0.2)" }}
                            whileTap={{ scale: 0.98 }}
                            variants={itemVariants}
                        >
                            Já tenho uma conta
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Animated elements */}
            <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center">
                <motion.p
                    className="text-sm text-gray-600 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                >
                    Comece grátis e aprenda idiomas de forma divertida!
                </motion.p>
            </div>


        </motion.div>
    );
}