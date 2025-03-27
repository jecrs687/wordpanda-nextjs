"use client";

import { ErrorMessage, Field } from 'formik';

interface UserFormFieldProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
}

export default function UserFormField({
    label,
    name,
    type = "text",
    placeholder = "",
    disabled = false
}: UserFormFieldProps) {
    // Translation is handled by passing in translated labels and placeholders
    // from the parent component, so we don't need to use translation directly here

    return (
        <div className="mb-4">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}
            </label>
            <Field
                type={type}
                name={name}
                id={name}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 transition-colors"
            />
            <ErrorMessage name={name}>
                {(msg) => (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{msg}</p>
                )}
            </ErrorMessage>
        </div>
    );
}
