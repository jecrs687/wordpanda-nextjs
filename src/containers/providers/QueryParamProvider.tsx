"use client";
import useQueryParams from "@hooks/useQueryParams";
import { useEffect } from "react";

export const QueryParamProvider = () => {
    const {
        setQueryParamsFromUrl
    } = useQueryParams();
    useEffect(() => {
        setQueryParamsFromUrl();
    }, [setQueryParamsFromUrl])
    return null;
}
