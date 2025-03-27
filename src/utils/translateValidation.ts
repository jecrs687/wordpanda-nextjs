import { i18n } from "i18next";
import { getI18n } from "react-i18next";

/**
 * Translates validation error messages from server keys to localized strings
 * 
 * @param errors Record of error keys and messages from the server
 * @returns Record with the same keys but translated messages
 */
export function translateValidationErrors(errors: Record<string, string>): Record<string, string> {
    if (!errors) return {};

    const translatedErrors: Record<string, string> = {};
    let i18nInstance: i18n;

    try {
        // Try to get the i18n instance from react-i18next
        i18nInstance = getI18n();
    } catch (error) {
        // If we can't get the i18n instance (e.g., during SSR), return the original errors
        return errors;
    }

    for (const [field, errorKey] of Object.entries(errors)) {
        // Only translate if the errorKey is a string and looks like a translation key (contains periods)
        if (typeof errorKey === 'string' && errorKey.includes('.')) {
            try {
                // Translate the error message
                translatedErrors[field] = i18nInstance.t(errorKey);
            } catch (error) {
                // If translation fails, use the original error key
                translatedErrors[field] = errorKey;
            }
        } else {
            // Pass through if it's not a translation key
            translatedErrors[field] = errorKey;
        }
    }

    return translatedErrors;
}
