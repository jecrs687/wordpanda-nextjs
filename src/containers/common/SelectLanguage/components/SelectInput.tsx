"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import Select, { ActionMeta, StylesConfig } from "react-select";
import { GlobeIcon } from "./GlobeIcon";

type SelectInputProps = {
    title?: string;
    name?: string;
    onBlur?: (x: any) => void;
    options: { value: number; label: string }[];
    placeholder?: string;
    menuPlacement?: "auto" | "bottom" | "top";
    isLoading?: boolean;
    isDisabled?: boolean;
    value?: { value: number; label: string } | null;
    onChange: (
        params: { value: number; label: string },
        action: ActionMeta<{ value: number; label: string }>
    ) => void;
    error?: string;
    isDark: boolean;
    size?: "sm" | "md" | "lg";
    variant?: "default" | "ghost" | "elevated";
};

export const SelectInput: React.FC<SelectInputProps> = ({
    title,
    name,
    onBlur,
    options,
    placeholder,
    menuPlacement,
    isLoading,
    isDisabled,
    value,
    onChange,
    error,
    isDark,
    size = "md",
    variant = "default",
}) => {
    // Size configurations
    const sizeConfig = {
        sm: {
            controlHeight: "h-9",
            fontSize: "text-sm",
            padding: "py-1 px-2",
            labelSize: "text-xs"
        },
        md: {
            controlHeight: "h-10",
            fontSize: "text-base",
            padding: "py-2 px-3",
            labelSize: "text-sm"
        },
        lg: {
            controlHeight: "h-12",
            fontSize: "text-lg",
            padding: "py-2.5 px-4",
            labelSize: "text-base"
        }
    };

    // Variant configurations
    const variantConfig = {
        default: {
            bg: isDark ? "bg-gray-950/80" : "bg-white",
            border: isDark ? "border-gray-800" : "border-zinc-200",
            shadow: isDark ? "shadow-md shadow-black/20" : "shadow-sm shadow-gray-200/60"
        },
        ghost: {
            bg: isDark ? "bg-transparent" : "bg-transparent",
            border: isDark ? "border-gray-800" : "border-zinc-200",
            shadow: "shadow-none"
        },
        elevated: {
            bg: isDark ? "bg-gray-900/90 backdrop-blur-md" : "bg-white backdrop-blur-md",
            border: isDark ? "border-indigo-500/20" : "border-indigo-200",
            shadow: isDark
                ? "shadow-lg shadow-indigo-900/20"
                : "shadow-md shadow-indigo-100/60"
        }
    };

    // Setup portal container for dropdown menu
    useEffect(() => {
        // Create a portal container for dropdown if it doesn't exist
        if (typeof document !== 'undefined') {
            let portalContainer = document.getElementById('select-dropdown-portal');

            if (!portalContainer) {
                portalContainer = document.createElement('div');
                portalContainer.id = 'select-dropdown-portal';
                portalContainer.style.position = 'absolute';
                portalContainer.style.zIndex = '999999999'; // Extremely high z-index
                portalContainer.style.top = '0';
                portalContainer.style.left = '0';
                portalContainer.style.width = '100%';
                document.body.appendChild(portalContainer);
            }
        }
    }, []);

    // Custom styles using the app's color scheme
    const selectStyles: StylesConfig<any, false> = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: "transparent",
            borderColor: state.isFocused
                ? isDark ? "rgb(79, 70, 229)" : "rgb(99, 102, 241)"
                : variant === "elevated"
                    ? (isDark ? "rgba(99, 102, 241, 0.2)" : "rgba(99, 102, 241, 0.2)")
                    : (isDark ? "rgb(55, 65, 81)" : "rgb(229, 231, 235)"),
            borderRadius: "0.75rem",
            boxShadow: state.isFocused
                ? isDark
                    ? "0 0 0 2px rgba(79, 70, 229, 0.4), 0 4px 10px rgba(0, 0, 0, 0.1)"
                    : "0 0 0 2px rgba(99, 102, 241, 0.4), 0 4px 10px rgba(0, 0, 0, 0.05)"
                : "none",
            padding: size === "sm" ? "0" : "2px",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            cursor: isDisabled ? "not-allowed" : "pointer",
            opacity: isDisabled ? 0.6 : 1,
            "&:hover": {
                borderColor: !state.isFocused
                    ? (isDark ? "rgb(79, 70, 229)" : "rgb(99, 102, 241)")
                    : (isDark ? "rgb(79, 70, 229)" : "rgb(99, 102, 241)"),
                boxShadow: !state.isFocused && variant === "elevated"
                    ? isDark
                        ? "0 0 0 1px rgba(79, 70, 229, 0.2), 0 4px 10px rgba(0, 0, 0, 0.1)"
                        : "0 0 0 1px rgba(99, 102, 241, 0.2), 0 4px 10px rgba(0, 0, 0, 0.05)"
                    : undefined
            },
            minHeight: size === "sm" ? "36px" : size === "md" ? "40px" : "48px",
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? isDark ? "rgb(79, 70, 229)" : "rgb(99, 102, 241)"
                : state.isFocused
                    ? isDark ? "rgba(79, 70, 229, 0.1)" : "rgba(99, 102, 241, 0.1)"
                    : "transparent",
            color: state.isSelected
                ? "white"
                : isDark ? "rgb(243, 244, 246)" : "rgb(17, 24, 39)",
            cursor: "pointer",
            borderRadius: "0.375rem",
            margin: "2px 0",
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            "&:active": {
                backgroundColor: isDark ? "rgb(67, 56, 202)" : "rgb(79, 70, 229)",
                color: "white"
            }
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: isDark ? "rgb(17, 24, 39, 0.98)" : "rgb(255, 255, 255, 0.98)",
            borderRadius: "0.75rem",
            overflow: "hidden",
            boxShadow: isDark
                ? "0 10px 25px -5px rgba(0, 0, 0, 0.8), 0 10px 10px -5px rgba(0, 0, 0, 0.5)"
                : "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            border: isDark
                ? "1px solid rgba(79, 70, 229, 0.2)"
                : "1px solid rgba(99, 102, 241, 0.2)",
            zIndex: 9999999, // Extremely high z-index
            margin: "4px 0",
        }),
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999999, // Extremely high z-index to appear above modals
        }),
        menuList: (provided) => ({
            ...provided,
            padding: "6px",
        }),
        singleValue: (provided) => ({
            ...provided,
            color: isDark ? "rgb(243, 244, 246)" : "rgb(17, 24, 39)",
        }),
        placeholder: (provided) => ({
            ...provided,
            color: isDark ? "rgb(156, 163, 175)" : "rgb(107, 114, 128)",
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: isDark ? "rgb(156, 163, 175)" : "rgb(107, 114, 128)",
            ":hover": {
                color: isDark ? "rgb(99, 102, 241)" : "rgb(79, 70, 229)",
            },
            padding: size === "sm" ? "4px" : "8px",
        }),
        clearIndicator: (provided) => ({
            ...provided,
            color: isDark ? "rgb(156, 163, 175)" : "rgb(107, 114, 128)",
            ":hover": {
                color: "rgb(239, 68, 68)",
            },
            padding: size === "sm" ? "4px" : "8px",
        }),
        indicatorSeparator: () => ({
            display: "none",
        }),
        input: (provided) => ({
            ...provided,
            color: isDark ? "rgb(243, 244, 246)" : "rgb(17, 24, 39)",
        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: size === "sm" ? "0 8px" : size === "lg" ? "6px 12px" : "2px 10px",
        }),
        loadingIndicator: (provided) => ({
            ...provided,
            color: isDark ? "rgb(99, 102, 241)" : "rgb(79, 70, 229)",
        }),
        loadingMessage: (provided) => ({
            ...provided,
            color: isDark ? "rgb(209, 213, 219)" : "rgb(75, 85, 99)",
            padding: "12px 16px",
        }),
        noOptionsMessage: (provided) => ({
            ...provided,
            color: isDark ? "rgb(209, 213, 219)" : "rgb(75, 85, 99)",
            padding: "12px 16px",
        }),
    };

    const labelVariants = {
        initial: { opacity: 0, y: -5 },
        animate: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.2 }
        },
    };

    const errorVariants = {
        initial: { opacity: 0, height: 0 },
        animate: {
            opacity: 1,
            height: "auto",
            transition: { duration: 0.3, ease: "easeInOut" }
        },
        exit: {
            opacity: 0,
            height: 0,
            transition: { duration: 0.2, ease: "easeInOut" }
        }
    };

    // Format the selected value with icon
    const formatOptionLabel = ({ value: optionValue, label: optionLabel }: { value: number, label: string }) => (
        <div className="flex items-center">
            <GlobeIcon className="w-4 h-4 mr-2 text-emerald-400" />
            <span>{optionLabel}</span>
        </div>
    );

    return (
        <div className="flex flex-col w-full">
            {title && (
                <motion.label
                    htmlFor={name}
                    variants={labelVariants}
                    initial="initial"
                    animate="animate"
                    className={`font-medium ${sizeConfig[size].labelSize} mb-1.5 text-gray-700 dark:text-gray-300 max-w-full truncate`}
                >
                    {title}
                </motion.label>
            )}

            <div className="relative w-full" style={{ zIndex: 100000 }}>
                <div
                    className={`relative w-full ${variantConfig[variant].shadow} ${variantConfig[variant].bg} rounded-xl border ${variantConfig[variant].border} overflow-hidden transition-all duration-300 ${isDisabled ? "opacity-60" : "hover:border-indigo-500 dark:hover:border-indigo-400"
                        }`}
                >
                    {variant === "elevated" && (
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/10 to-emerald-50/5 dark:from-indigo-900/5 dark:to-emerald-900/10 rounded-xl pointer-events-none" />
                    )}

                    <Select
                        inputId={name}
                        onBlur={onBlur}
                        options={options}
                        name={name}
                        placeholder={
                            <div className="flex items-center">
                                <GlobeIcon className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                                <span>{placeholder}</span>
                            </div>
                        }
                        formatOptionLabel={formatOptionLabel}
                        menuPlacement={menuPlacement}
                        isLoading={isLoading}
                        maxMenuHeight={250}
                        isDisabled={isDisabled}
                        value={value}
                        onChange={onChange}
                        styles={selectStyles}
                        className={`${sizeConfig[size].controlHeight}`}
                        classNamePrefix="panda-select"
                        menuPortalTarget={typeof document !== 'undefined' ? document.getElementById('select-dropdown-portal') || document.body : null}
                        menuPosition="fixed"
                        menuShouldBlockScroll={true}
                        menuShouldScrollIntoView={false}
                        blurInputOnSelect={true}
                    />
                </div>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.p
                        variants={errorVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="mt-1.5 text-xs font-medium text-rose-500 overflow-hidden"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};
