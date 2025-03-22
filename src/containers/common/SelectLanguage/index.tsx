"use client";
import { getLanguages, setUserLanguage } from "@/src/backend/domain/actions/Languages/getLanguages.action";
import { getUser } from "@/src/backend/domain/actions/User/getUser.action";
import useLanguage from "@hooks/useLanguage";
import { capitalizeFirstLetter } from "@utils/capitalizeFirstLetter";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useCallback, useEffect, type JSX } from "react";
import { ActionMeta } from "react-select";
import { SelectInput } from "./components/SelectInput";

export type SelectLanguageProps = {
    onChange?: (
        value: {
            value: number;
            label: string;
        },
        action: ActionMeta<{ value: number; label: string }>
    ) => void;
    name?: string;
    disabled?: boolean;
    notPreload?: boolean;
    value?: number | undefined;
    error?: string | undefined;
    onBlur?: (x: any) => void;
    title?: string;
    className?: string;
    dropdownPosition?: "auto" | "bottom" | "top";
    targetLanguage?: boolean;
    placeHolder?: string;
    size?: "sm" | "md" | "lg";
    variant?: "default" | "ghost" | "elevated";
};

export const SelectLanguage = ({
    onChange = ({ }) => { },
    name,
    disabled = false,
    error,
    onBlur,
    title,
    className,
    notPreload = false,
    dropdownPosition = "auto",
    placeHolder = "Select Language",
    size = "md",
    variant = "default",
}: SelectLanguageProps): JSX.Element => {


    const { theme } = useTheme();
    const isDark = theme === "dark";
    const { language, select, setLanguages, languages } = useLanguage();

    useEffect(() => {
        getLanguages().then((data) => {
            setLanguages(data?.languages || [])
        })
    }, []);

    const getLanguage = useCallback(async () => {
        const response = await getUser();
        if (response?.errors) console.log(response.errors);
        else select(response?.user?.languageId);
    }, [select]);

    useEffect(() => {
        if (language == -1 && !notPreload) getLanguage();
    }, [getLanguage, language, select, notPreload]);

    const values = languages?.map((item) => ({
        value: item.id,
        label: capitalizeFirstLetter(`${item.language} - ${item.code}`),
    }))
    const handleChange = (
        params: { value: number; label: string },
        action: ActionMeta<{ value: number; label: string }>
    ) => {
        select(params.value);
        setUserLanguage({
            id: params.value,
        });
        onChange(params, action);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 5 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        },
    };

    // Create the portal container for modals if it doesn't exist
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Add CSS to document head to ensure portal container has highest z-index
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                #select-dropdown-portal {
                    position: absolute;
                    z-index: 999999999 !important;
                    top: 0;
                    left: 0;
                    width: 100%;
                    pointer-events: none;
                }
                #select-dropdown-portal * {
                    pointer-events: auto;
                }
                .panda-select__menu {
                    z-index: 999999999 !important;
                }
            `;
            document.head.appendChild(styleElement);

            return () => {
                document.head.removeChild(styleElement);
            };
        }
    }, []);

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className={`${className} relative z-[100]`}
        >
            <SelectInput
                title={title}
                name={name}
                onBlur={onBlur}
                options={values}
                placeholder={placeHolder}
                menuPlacement={dropdownPosition}
                isLoading={!languages}
                isDisabled={values.length === 0 || disabled}
                value={values.find((item) => item.value === language)}
                onChange={handleChange}
                error={error}
                isDark={isDark}
                size={size}
                variant={variant}
            />
        </motion.div>
    );
};