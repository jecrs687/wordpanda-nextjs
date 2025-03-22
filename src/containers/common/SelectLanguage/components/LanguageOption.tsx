"use client";
import { motion } from "framer-motion";
import { components, OptionProps } from "react-select";
import { GlobeIcon } from "./GlobeIcon";

export const LanguageOption = (props: OptionProps<any>) => {
    const { isSelected, isFocused } = props;
    const isDark = document.documentElement.classList.contains("dark");

    return (
        <components.Option {...props}>
            <div className="flex items-center">
                <div className="mr-3">
                    <GlobeIcon
                        className={`w-5 h-5 
                ${isSelected
                                ? "text-white"
                                : "text-emerald-400 dark:text-emerald-300"}`}
                    />
                </div>
                <span className="font-medium">{props.label}</span>

                {isSelected && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </motion.div>
                )}
            </div>
        </components.Option>
    );
};
