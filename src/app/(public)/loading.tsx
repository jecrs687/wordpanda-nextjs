"use client";

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Loading() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === 'dark' : false;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center 
      bg-gradient-to-br from-white via-zinc-50 to-sky-50
      dark:from-gray-950 dark:via-gray-900 dark:to-gray-900
      dark:bg-blend-overlay dark:bg-opacity-90">

      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8 w-32 h-32"
        >
          <Image
            src={isDark ? "/assets/logo_white.png" : "/assets/logo.png"}
            alt="WordPanda"
            fill
            className="object-contain"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="relative h-2 w-48 mb-6 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-indigo-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut"
              }}
            />
          </div>

          <motion.p
            className="text-zinc-600 dark:text-zinc-300 text-lg font-medium"
            animate={{
              opacity: [0.5, 1, 0.5],
              y: [0, -5, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Carregando...
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
