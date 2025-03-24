"use server";

import { getUser } from "@/src/backend/domain/actions/User/getUser.action";
import { cacheClient } from "@/src/backend/infra/cache/redis.cache";

// Import your translation files - adjust paths according to your project structure
import enTranslations from "@locales/en.json";
import esTranslations from "@locales/es.json";
import ptTranslations from "@locales/pt.json";

// Define a type for translations, allowing nested objects
type TranslationRecordUnit = string | Record<string, string | TranslationRecord>;
interface TranslationRecord {
    [key: string]: TranslationRecordUnit;
}

// Map of language codes to translation objects
const translations: Record<string, TranslationRecord> = {
    en: enTranslations,
    es: esTranslations,
    pt: ptTranslations,
    // Add more languages as needed
};

// Default language to use as fallback
const DEFAULT_LANGUAGE = "en";

/**
 * Gets translations for a specific language code
 */
export function getTranslationsForLanguage(languageCode: string): TranslationRecord {
    return translations[languageCode] || translations[DEFAULT_LANGUAGE];
}

/**
 * Gets translation for a specific key in a given language
 */
export function getTranslation(key: string, languageCode: string): string {
    const langTranslations = getTranslationsForLanguage(languageCode);
    const keys = key.split(".");
    let current = langTranslations;

    for (const key of keys) {
        if (!current[key]) {
            return key;
        }

        current = current[key] as Record<string, string>;
    }

    return current as unknown as string;
}

/**
 * Gets the current user's preferred language code
 */
export async function getUserLanguageCode(): Promise<string> {
    try {
        const cacheKey = 'userLanguageCode';
        const cachedLanguage = await cacheClient.get(cacheKey);

        if (cachedLanguage) {
            return cachedLanguage;
        }

        const { user } = await getUser();

        if (!user) {
            return DEFAULT_LANGUAGE;
        }

        const languageCode = user.language?.code || DEFAULT_LANGUAGE;

        // Cache the language code for future use
        await cacheClient.set(cacheKey, languageCode, { EX: 1800 }); // 30 minutes

        return languageCode;
    } catch (error) {
        console.error("Error getting user language:", error);
        return DEFAULT_LANGUAGE;
    }
}

/**
 * Gets translations for the current user
 */
export async function getUserTranslations(): Promise<TranslationRecord> {
    const languageCode = await getUserLanguageCode();
    return getTranslationsForLanguage(languageCode);
}

/**
 * Translates a specific key for the current user
 */
export async function translateForUser(key: string): Promise<string> {
    const languageCode = await getUserLanguageCode();
    return getTranslation(key, languageCode);
}
