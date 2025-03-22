import { SelectLanguage } from '@common/SelectLanguage';
import { useState } from 'react';

type LanguageSelectorProps = {
    name: string;
    error?: string;
    initialValue?: string;
};

export function LanguageSelector({ name, error, initialValue }: LanguageSelectorProps) {
    const [focused, setFocused] = useState(false);
    const [touched, setTouched] = useState(false);

    const handleFocus = () => {
        setFocused(true);
    };

    const handleBlur = () => {
        setFocused(false);
        setTouched(true);
    };

    return (
        // <div className="relative mb-5">
        //     <div
        //         className={`
        //             bg-white dark:bg-gray-700 rounded-lg 
        //             border ${error && touched
        //                 ? 'border-red-500 dark:border-red-400'
        //                 : focused
        //                     ? 'border-emerald-500 dark:border-emerald-400'
        //                     : 'border-gray-300 dark:border-gray-600'
        //             }
        //             focus-within:ring-2 ${error && touched
        //                 ? 'focus-within:ring-red-500/20'
        //                 : 'focus-within:ring-emerald-500/20'
        //             }
        //         `}
        //         onFocus={handleFocus}
        //         onBlur={handleBlur}
        //     >
        <SelectLanguage
            name={name}
            notPreload={true}
            dropdownPosition="bottom"
            error={error}
            title=""
            className="border-0 shadow-none py-2.5 px-4 rounded-lg text-gray-800 dark:text-white"
            aria-required="true"
            aria-invalid={error && touched ? "true" : "false"}
            aria-describedby={error ? `${name}-error` : undefined}
        />
        //     </div>

        //     {/* Error message */}
        //     {error && touched && (
        //         <p
        //             id={`${name}-error`}
        //             className="mt-1.5 text-sm text-red-500 flex items-center"
        //         >
        //             <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
        //                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        //             </svg>
        //             {error}
        //         </p>
        //     )}
        // </div>
    );
}
