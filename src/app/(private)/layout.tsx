"use client";

import { ROUTES } from '@constants/ROUTES';
import { AuthenticationProvider } from '@providers/AuthenticationProvider';
import { SwrCacheProvider } from '@providers/SwrCacheProvider';
import { motion } from 'framer-motion';
import { Suspense, useState } from 'react';
import Navbar from '../../components/common/NavBar';
import Loading from '../loading';

export default function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        // Any additional search handling logic
    };

    return (
        <div className="min-h-screen flex flex-col">
            <SwrCacheProvider />
            <AuthenticationProvider redirect={ROUTES.LOGIN()} />
            <Navbar onSearch={handleSearch} />

            <motion.main
                className="flex-grow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Suspense fallback={<Loading />}>
                    {children}
                </Suspense>
            </motion.main>
        </div>
    );
}
