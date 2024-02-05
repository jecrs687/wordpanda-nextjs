'use client';
import { useChannels } from '@hooks/useChannels';
import useEvents from '@hooks/useEvents';
import { useCallback, useEffect } from 'react';

function EventProvider() {
    const {
        insert
    } = useEvents();
    const {
        web
    } = useChannels();
    const handleEvent = useCallback((event) => {
        insert(event.data.name, event.data.content)
    }, [insert])

    useEffect(() => {
        window.addEventListener('message', handleEvent)
        return () => window.removeEventListener('message', handleEvent)
    }, [handleEvent])

    useEffect(() => {

    }, [])
    return <div className='eventProvider' />
}
export default EventProvider;