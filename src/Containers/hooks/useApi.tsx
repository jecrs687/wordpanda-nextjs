import { envs } from "@utils/envs";
import { type } from "os";
import { useCallback, useEffect, useState } from "react";
const responsesRequest: { [key: string]: any } = {}


interface ApiProps {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: any,
    url: string,
    cache?: boolean,
    initialFetch: boolean,
    expire?: number
}
interface ApiResponse {
    response: any,
    loading: boolean,
    refetch: () => void
}

export function useApi({
    method,
    body,
    url,
    cache,
    initialFetch = true,
    expire = 1000
}: ApiProps): ApiResponse {
    const [response, setResponse] = useState();
    const [loading, setLoading] = useState(false);

    const getData = useCallback(() => {
        if (loading) return;
        setLoading(true)
        fetch('/api/' + url, {
            method,
            ...(body && { body: JSON.stringify(body) }),
        })
            .then(res => res.json())
            .then(res => {
                setResponse(res)
                setLoading(false);
                if (method === 'GET') {
                    responsesRequest[JSON.stringify({ body, url })] = res
                    if (expire)
                        setTimeout(() => {
                            delete responsesRequest[JSON.stringify({ body, url })]
                        }, expire)
                }
            }).catch(err => {
                setLoading(false);
                console.log({ err })
            })
    }, [body, loading, method, url, expire]);

    useEffect(() => {
        if (initialFetch) {
            getData();
        }
    }, [initialFetch, getData]);
    const params = JSON.stringify({ method, body, url })
    if (cache && !responsesRequest[params] && !response && method !== 'GET')
        return {
            response,
            loading,
            refetch: getData
        }
    return {
        response,
        loading,
        refetch: responsesRequest[params]
    }
}