import { envs } from "@/utils/envs";
import { type } from "os";
import { useCallback, useEffect, useState } from "react";
const responsesRequest:{[key: string]: any} = {}


interface ApiProps {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: any,
    url: string,
    cache?: boolean,
    initialFetch: boolean
}
interface ApiResponse {
    response: any,
    loading: boolean,
    refetch: ()=>void
}

export function useApi({
    method,
    body,
    url,
    cache,
    initialFetch = true
}:ApiProps): ApiResponse { 
    const [response, setResponse] = useState();
    const [loading, setLoading] =  useState(false);
    
    const getData = useCallback(() =>{
        if(loading) return ;
        setLoading(true)
        fetch(url, {
            method,
            ...(body && {body: JSON.stringify(body)}),
        })
        .then(res=>res.json())
        .then(res=>{
            setResponse(res)
            setLoading(false);
            responsesRequest[JSON.stringify({method, body, url})] = res
        }).catch(err=>{
            setLoading(false);
            console.log({err})
        })
    }, [body, loading, method, url]);

    useEffect(() => {
        if (initialFetch) {
            // getData();
        }
    }, [initialFetch, getData]);
    const params = JSON.stringify({method, body, url})
    if(cache && !responsesRequest[params] && !response)
        return {
            response,
            loading,
            refetch: getData
        }
    return {
        response,
        loading,
        refetch: getData
    }
}