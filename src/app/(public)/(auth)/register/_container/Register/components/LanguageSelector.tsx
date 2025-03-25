import { SelectLanguage } from '@common/SelectLanguage';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type LanguageSelectorProps = {
    name: string;
    error?: string;
    initialValue?: string;
};

export function LanguageSelector({ name, error, initialValue }: LanguageSelectorProps) {
    const { t } = useTranslation();
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
    );
}
