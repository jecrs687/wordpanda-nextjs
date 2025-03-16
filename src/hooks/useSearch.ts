"use client";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export interface UseSearchProps {
    defaultValue?: string;
    searchParam?: string;
}

export default function useSearch({
    defaultValue = '',
    searchParam = 'search',
}: UseSearchProps = {}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Get initial value from URL if available
    const initialValue = searchParams?.get(searchParam) || defaultValue;
    const [search, setSearchState] = useState(initialValue);

    // Initialize from URL on mount
    useEffect(() => {
        const urlValue = searchParams?.get(searchParam);
        if (urlValue) {
            setSearchState(urlValue);
        }
    }, [searchParam, searchParams]);

    // Update URL when search changes
    const setSearch = useCallback((value: string) => {
        setSearchState(value);

        // Update URL with search parameter
        const params = new URLSearchParams(searchParams?.toString());

        if (value) {
            params.set(searchParam, value);
        } else {
            params.delete(searchParam);
        }

        const newQuery = params.toString();
        const query = newQuery ? `?${newQuery}` : '';

        router.replace(`${pathname}${query}`);
    }, [pathname, router, searchParam, searchParams]);

    // Clear search
    const clearSearch = useCallback(() => {
        setSearch('');
    }, [setSearch]);

    return {
        search,
        setSearch,
        clearSearch,
    };
}
