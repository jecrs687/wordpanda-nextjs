"use client";
import useLanguage from "@hooks/useLanguage";
import { fetchClient } from "@services/fetchClient";
import { capitalizeFirstLetter } from "@utils/capitalizeFirstLetter";
import clsx from "clsx";
import { useCallback, useEffect, useMemo } from "react";
import Select, { ActionMeta } from "react-select";
import { LanguagesGetResponse } from "src/app/api/languages/route";
import { ProfileGetResponse } from "src/app/api/profile/route";
import { UserLanguagePutRequest, UserLanguagePutResponse } from "src/app/api/user/language/route";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import styles from './SelectLanguage.module.scss';

export const SelectLanguage = ({
    onChange = ({ }) => { },
    name,
    disabled = false,
    error,
    onBlur,
    title,
    className,
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

    const { data: { data } = {}, error: apiError } = useSWR<LanguagesGetResponse, Error>('/api/languages', {
        fetcher: fetchClient("GET")
    });
    const { trigger } = useSWRMutation<ProfileGetResponse, Error>('/api/profile', fetchClient("GET"));
    const { trigger: updateLanguage } = useSWRMutation<UserLanguagePutResponse, Error, string, UserLanguagePutRequest>('/api/user/language', fetchClient("PUT"));

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
        if (language == -1)
            getLanguage()
    }, [getLanguage, language, select])

    const values = useMemo(
        () => data?.languages?.map((item) => ({ value: item.id, label: capitalizeFirstLetter(`${item.language} - ${item.code}`) })) || [],
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
            placeholder={placeHolder}
            menuPlacement={dropdownPosition}
            isLoading={!data}
            maxMenuHeight={195}
            isDisabled={values.length === 0 || disabled}
            value={values.find((item) => item.value === language)}
            onChange={(...params) => {
                select(params[0].value)
                updateLanguage({
                    languageId: params[0].value
                })
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