import { envs } from '@utils/envs';
import { useState, useEffect } from 'react'

function useEvent<T>(eventName: string): undefined | T {

    const [message, setMessage] = useState<undefined | T>(envs[eventName] as T);
    useEffect(() => {
        if (message)
            envs[eventName] = message;
    }, [message, eventName])
    useEffect(() => {
        const handleEvent = (event) => {
            console.log({ event: event.data })
            if (event.data.name == eventName)
                setMessage(event.data.content as T)
        }
        window?.addEventListener('message', handleEvent, false)
        return window?.removeEventListener('message', handleEvent)
    }, [eventName])
    return message
}
export { useEvent }