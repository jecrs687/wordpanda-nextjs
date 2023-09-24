import {useState, useEffect} from 'react'

 function useEvent<T>(eventName:string): undefined | T{
    
    const [message, setMessage] = useState<undefined | T>(undefined);
    useEffect(() => {
        window?.addEventListener('message', (event) =>{
            console.log({eventIframe: event.data})
            if(event.data.name == eventName)
                setMessage(event.data.content as T)
        })
    }, [eventName])    
    return message
}
export {useEvent}