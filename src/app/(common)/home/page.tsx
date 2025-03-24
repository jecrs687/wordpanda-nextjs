"use client";
import dynamic from 'next/dynamic';

// Import Dashboard component dynamically with SSR disabled
const Dashboard = dynamic(
    () => import('./_container/Dashboard').then((mod) => mod.Dashboard),
    { ssr: false } // This ensures the component only loads on the client side
);

export default function Page() {
    return (
        <Dashboard />
    );
}
