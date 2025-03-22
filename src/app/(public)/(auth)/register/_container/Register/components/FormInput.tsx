import { useId, useState } from 'react';

type FormInputProps = {
    name: string;
    type: string;
    label: string;
    placeholder?: string;
    value?: string;
    defaultValue?: string;
    error?: string;
    required?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    autoComplete?: string;
    icon?: React.ReactNode;
    hint?: string;
    maxLength?: number;
    pattern?: string;
    inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
};

export function FormInput({
    name,
    type,
    label,
    placeholder,
    value,
    defaultValue,
    error,
    required = false,
    onChange,
    autoComplete,
    icon,
    hint,
    maxLength,
    pattern,
    inputMode,
}: FormInputProps) {
    const [focused, setFocused] = useState(false);
    const [localValue, setLocalValue] = useState(value || defaultValue || '');
    const [touched, setTouched] = useState(false);
    const isControlled = onChange !== undefined;
    const uniqueId = useId();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) {
            setLocalValue(e.target.value);
        }
        onChange && onChange(e);
    };

    const handleBlur = () => {
        setFocused(false);
        setTouched(true);
    };

    return (
        <div className="mb-5">
            {/* Clear, visible label */}
            <label
                htmlFor={uniqueId + name}
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <div className="relative">
                {/* Icon (if provided) */}
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {icon}
                    </div>
                )}

                <input
                    id={uniqueId + name}
                    name={name}
                    type={type}
                    className={`
                        w-full px-4 py-2.5 ${icon ? 'pl-10' : ''} 
                        bg-white dark:bg-gray-700 
                        border ${error && touched
                            ? 'border-red-500 dark:border-red-400'
                            : focused
                                ? 'border-emerald-500 dark:border-emerald-400'
                                : 'border-gray-300 dark:border-gray-600'
                        } 
                        rounded-lg 
                        focus:outline-none focus:ring-2 
                        ${error && touched
                            ? 'focus:ring-red-500/20 dark:focus:ring-red-400/20'
                            : 'focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20'
                        }
                        text-gray-900 dark:text-white 
                        placeholder-gray-500 dark:placeholder-gray-400
                        transition-all duration-200
                    `}
                    placeholder={placeholder}
                    value={isControlled ? value || '' : undefined}
                    defaultValue={!isControlled ? defaultValue || '' : undefined}
                    onChange={handleChange}
                    onFocus={() => setFocused(true)}
                    onBlur={handleBlur}
                    autoComplete={autoComplete}
                    required={required}
                    aria-invalid={error && touched ? "true" : "false"}
                    aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
                    maxLength={maxLength}
                    pattern={pattern}
                    inputMode={inputMode}
                />

                {/* Character counter for fields with maxLength */}
                {maxLength && (
                    <div className={`absolute right-3 bottom-1 text-xs ${localValue.length > maxLength * 0.8
                            ? 'text-amber-500 dark:text-amber-400'
                            : 'text-gray-400 dark:text-gray-500'
                        }`}>
                        {localValue.length}/{maxLength}
                    </div>
                )}
            </div>

            {/* Error or hint message with improved visibility */}
            <div className="min-h-[20px]">
                {error && touched ? (
                    <p
                        id={`${name}-error`}
                        className="mt-1.5 text-sm text-red-500 flex items-center"
                    >
                        <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </p>
                ) : hint ? (
                    <p id={`${name}-hint`} className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {hint}
                    </p>
                ) : null}
            </div>
        </div>
    );
}
