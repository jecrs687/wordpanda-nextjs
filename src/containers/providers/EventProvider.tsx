'use client';
import { useEffect } from 'react';
import useEvents from 'src/containers/hooks/useEvents';

function EventProvider() {
    const {
        insert
    } = useEvents();

    useEffect(() => {
        const handleEvent = (event) => {
            console.log({ event: event.data })
            insert(event.data.name, event.data.content)
        }
        window?.addEventListener('message', handleEvent, false)
        return window?.removeEventListener('message', handleEvent)
    }, [insert])

    return <></>
}
export default EventProvider;