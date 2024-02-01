"use client";
import { fetchClient } from "@services/fetchClient";
import { capitalizeFirstLetter } from "@utils/capitalizeFirstLetter";
import { getCookie, setCookie } from "@utils/cookie";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import Select, { ActionMeta } from "react-select";
import { LanguagesGetResponse } from "src/app/api/languages/route";
import { ProfileGetResponse } from "src/app/api/profile/route";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import styles from './SelectLanguage.module.scss';
export function SelectLanguage({
    onChange = ({ }) => { },
    name,
    disabled = false,
    value,
    error,
    onBlur,
    title,
    className,
    dropdownPosition = 'auto',
}: {
    onChange?: (value: {
        value: number;
        label: string;
    },
        action: ActionMeta<{ value: number; label: string; }>
    ) => void,
    name?: string,
    disabled?: boolean,
    value?: number | undefined,
    error?: string | undefined,
    onBlur?: (x: any) => void,
    title?: string,
    className?: string,
    dropdownPosition?: 'auto' | 'bottom' | 'top'

}

): JSX.Element {

    const { data: { data } = {} } = useSWR<LanguagesGetResponse, Error>('/api/languages', {
        fetcher: fetchClient("GET")
    });
    const { trigger } = useSWRMutation<ProfileGetResponse, Error>('/api/profile', fetchClient("GET"));
    const [language, setLanguage] = useState<number | undefined>(value);

    const getLanguage = useCallback(async () => {
        const response = await trigger()
        localStorage.setItem('language', String(response?.data?.languageId))
        setCookie('language', String(response?.data?.languageId))
        setLanguage(response?.data?.languageId)
    }, [trigger])

    useEffect(() => {
        const storageLanguage = localStorage.getItem('language')
        const cookiesLanguage = getCookie('language')
        if (language) {
            if (!storageLanguage)
                localStorage.setItem('language', String(language))
            if (!cookiesLanguage)
                setCookie('language', String(language))
            return;
        }
        if (storageLanguage) {
            if (!cookiesLanguage)
                setCookie('language', String(storageLanguage))
            setLanguage(Number(storageLanguage))
        }
        else if (cookiesLanguage) {
            if (!storageLanguage)
                localStorage.setItem('language', String(cookiesLanguage))
            setLanguage(Number(cookiesLanguage))
        }
        else
            getLanguage()
    }, [getLanguage, language])

    const values = useMemo(
        () => data?.languages?.map((item) => ({ value: item.id, label: capitalizeFirstLetter(item.language) })) || [],
        [data])

    return (<div className={
        clsx(styles.container, className)
    }>
        <label htmlFor={name} className={styles.label}>{
            title || name
        }</label>
        <Select
            onBlur={onBlur}
            options={values}
            name={name}
            menuPlacement={dropdownPosition}
            isLoading={!data}
            isDisabled={values.length === 0 || disabled}
            value={values.find((item) => item.value === language)}
            onChange={(...params) => {
                setLanguage(params[0].value)
                onChange(...params)
            }}
            className={clsx(styles.select)}
            classNames={{
                input: props => styles.input,
                menu: props => styles.menu,

                option: props => styles.option,
                valueContainer: props => styles.valueContainer,
                control: props => styles.control,
                singleValue: props => styles.singleValue,
                indicatorSeparator: props => styles.indicatorSeparator,
            }}
        />
        <span className={styles.error}>{error}</span>
    </div>

    )
}