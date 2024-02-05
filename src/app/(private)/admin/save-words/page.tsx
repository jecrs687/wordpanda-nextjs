"use client";
import useEvents from "@hooks/useEvents";


export default function Page() {
    const { events } = useEvents()

    return <main style={{
        color: 'black'
    }}>

        {JSON.stringify(events)}
    </main>
}