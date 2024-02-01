'use client';
import useEvents from '@hooks/useEvents';
import { useEffect } from 'react';

function EventProvider() {
    const {
        insert
    } = useEvents();
    useEffect(() => {
        const handleEvent = (event) => {
            console.log("teste")
            console.log({ event: event.data })
            insert(event.data.name, event.data.content)
        }
        window?.addEventListener('message', handleEvent, false)
        return window?.removeEventListener('message', handleEvent)
    }, [insert])

    return <></>
}
export default EventProvider;