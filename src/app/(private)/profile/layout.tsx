"use client";

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export default function ProfileLayout({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="min-h-screen">
                {children}
            </div>
        </ThemeProvider>
    );
}
