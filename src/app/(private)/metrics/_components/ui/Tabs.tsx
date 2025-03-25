"use client";

import React, { createContext, useContext, useState } from "react";

type TabsContextType = {
    activeTab: string;
    setActiveTab: (id: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function Tabs({
    defaultValue,
    className,
    children,
}: {
    defaultValue: string;
    className?: string;
    children: React.ReactNode;
}) {
    const [activeTab, setActiveTab] = useState(defaultValue);

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    );
}

export function TabsList({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div
            role="tablist"
            className={`flex space-x-1 rounded-md ${className}`}
        >
            {children}
        </div>
    );
}

export function TabsTrigger({
    value,
    children,
    className,
}: {
    value: string;
    children: React.ReactNode;
    className?: string;
}) {
    const context = useContext(TabsContext);

    if (!context) {
        throw new Error("TabsTrigger must be used within a Tabs component");
    }

    const { activeTab, setActiveTab } = context;
    const isActive = activeTab === value;

    return (
        <button
            role="tab"
            aria-selected={isActive}
            data-state={isActive ? "active" : "inactive"}
            onClick={() => setActiveTab(value)}
            className={`
        relative px-3 py-1.5 text-sm font-medium transition-all
        ${isActive
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                }
        rounded-md ${className}`
            }
        >
            {children}
        </button>
    );
}

export function TabsContent({
    value,
    children,
    className,
}: {
    value: string;
    children: React.ReactNode;
    className?: string;
}) {
    const context = useContext(TabsContext);

    if (!context) {
        throw new Error("TabsContent must be used within a Tabs component");
    }

    const { activeTab } = context;
    const isActive = activeTab === value;

    return isActive ? (
        <div
            role="tabpanel"
            data-state={isActive ? "active" : "inactive"}
            className={className}
        >
            {children}
        </div>
    ) : null;
}
