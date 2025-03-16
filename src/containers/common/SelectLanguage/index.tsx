"use client";
import useLanguage from "@hooks/useLanguage";
import { fetchClient } from "@services/fetchClient";
import { capitalizeFirstLetter } from "@utils/capitalizeFirstLetter";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useMemo, type JSX } from "react";
import Select, { ActionMeta, StylesConfig } from "react-select";
import { LanguagesGetResponse } from "src/app/api/languages/route";
import { ProfileGetResponse } from "src/app/api/profile/route";
import { UserLanguagePutRequest, UserLanguagePutResponse } from "src/app/api/user/language/route";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

export const SelectLanguage = ({
    onChange = ({ }) => { },
    name,
    disabled = false,
    error,
    onBlur,
    title,
    className,
    notPreload = false,
    dropdownPosition = 'auto',
    placeHolder = "Select Language"
}: {
    onChange?: (value: {
        value: number;
        label: string;
    },
        action: ActionMeta<{ value: number; label: string; }>
    ) => void,
    name?: string,
    disabled?: boolean,
    notPreload?: boolean,
    value?: number | undefined,
    error?: string | undefined,
    onBlur?: (x: any) => void,
    title?: string,
    className?: string,
    dropdownPosition?: 'auto' | 'bottom' | 'top',
    targetLanguage?: boolean,
    placeHolder?: string,
}

): JSX.Element => {
    const { data: { data } = {}, error: apiError } = useSWR<LanguagesGetResponse, Error>(
        '/api/languages', {
        fetcher: fetchClient("GET")
    });
    const { trigger } = useSWRMutation<ProfileGetResponse, Error>('/api/profile', fetchClient("GET"));
    const { trigger: updateLanguage } = useSWRMutation<UserLanguagePutResponse, Error, string, UserLanguagePutRequest>('/api/user/language', fetchClient("PUT"));
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const {
        language,
        select,
        setLanguages
    } = useLanguage();

    useEffect(() => {
        if (data?.languages) setLanguages(data.languages)
    }, [data, setLanguages])

    const getLanguage = useCallback(async () => {
        const response = await trigger()
        if (response?.err) console.log(response.err)
        else select(response?.data?.languageId)
    }, [trigger, select])

    useEffect(() => {
        if (language == -1 && !notPreload)
            getLanguage()
    }, [getLanguage, language, select, notPreload])

    const values = useMemo(
        () => data?.languages?.map((item) => ({ value: item.id, label: capitalizeFirstLetter(`${item.language} - ${item.code}`) })) || [],
        [data]
    );

    // Custom styles using the app's color scheme
    const selectStyles: StylesConfig = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: isDark ? 'rgb(17 24 39 / 0.8)' : 'white',
            borderColor: state.isFocused
                ? (isDark ? '#4f46e5' : '#6366f1')
                : (isDark ? '#374151' : '#e5e7eb'),
            borderRadius: '0.75rem',
            boxShadow: state.isFocused
                ? (isDark ? '0 0 0 2px rgba(79, 70, 229, 0.4)' : '0 0 0 2px rgba(99, 102, 241, 0.4)')
                : 'none',
            padding: '2px',
            '&:hover': {
                borderColor: isDark ? '#4f46e5' : '#6366f1',
            },
            transition: 'all 0.2s ease',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? isDark ? '#4f46e5' : '#6366f1'
                : state.isFocused
                    ? isDark ? 'rgba(79, 70, 229, 0.1)' : 'rgba(99, 102, 241, 0.1)'
                    : 'transparent',
            color: state.isSelected
                ? 'white'
                : isDark ? '#f3f4f6' : '#111827',
            cursor: 'pointer',
            ':active': {
                backgroundColor: isDark ? '#4338ca' : '#4f46e5',
                color: 'white'
            }
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: isDark ? 'rgb(31 41 55 / 0.95)' : 'white',
            borderRadius: '0.75rem',
            boxShadow: isDark
                ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2)'
                : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            zIndex: 9999,
        }),
        menuList: (provided) => ({
            ...provided,
            padding: '6px',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: isDark ? '#f3f4f6' : '#111827',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: isDark ? '#9ca3af' : '#6b7280',
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: isDark ? '#6b7280' : '#9ca3af',
            ':hover': {
                color: isDark ? '#d1d5db' : '#4b5563',
            },
        }),
        indicatorSeparator: () => ({
            display: 'none',
        }),
        input: (provided) => ({
            ...provided,
            color: isDark ? '#f3f4f6' : '#111827',
        }),
    };

    return (
        <div className={clsx(
            "flex flex-col items-start justify-start z-50",
            className
        )}>
            {title && (
                <label
                    htmlFor={name}
                    className="font-medium text-sm mb-1.5 text-gray-700 dark:text-gray-300 max-w-full truncate"
                >
                    {title || name}
                </label>
            )}

            <div className="w-full">
                <Select
                    inputId={name}
                    onBlur={onBlur}
                    options={values}
                    name={name}
                    placeholder={placeHolder}
                    menuPlacement={dropdownPosition}
                    isLoading={!data}
                    maxMenuHeight={195}
                    isDisabled={values.length === 0 || disabled}
                    value={values.find((item) => item.value === language)}
                    onChange={(params: { value: number; label: string }, action: ActionMeta<{ value: number; label: string }>) => {
                        select(params.value)
                        updateLanguage({
                            languageId: params.value
                        })
                        onChange(params, action)
                    }}
                    className="w-full"
                    styles={selectStyles}
                    classNamePrefix="react-select"
                />
            </div>

            {error && (
                <p className="mt-1.5 text-xs font-medium text-rose-500">
                    {error}
                </p>
            )}
        </div>
    )
}