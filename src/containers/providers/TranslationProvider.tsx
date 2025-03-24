import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { initReactI18next } from "react-i18next";

// Import translations
import enTranslation from "@locales/en.json";
import esTranslation from "@locales/es.json";
import itTranslation from "@locales/it.json";
import ptTranslation from "@locales/pt.json";

const resources = {
    en: {
        translation: enTranslation
    },
    es: {
        translation: esTranslation
    },
    pt: {
        translation: ptTranslation
    },
    it: {
        translation: itTranslation
    }
};

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        },
        detection: {
            order: ["localStorage", "navigator"]
        }
    });

interface I18nContextProps {
    language: string;
    changeLanguage: (lang: string) => void;
}

const I18nContext = createContext<I18nContextProps>({
    language: "en",
    changeLanguage: () => { }
});

export const useI18n = () => useContext(I18nContext);

interface TranslationProviderProps {
    children: ReactNode;
}

export const TranslationProvider = ({ children }: TranslationProviderProps) => {
    const [language, setLanguage] = useState(i18n.language || "en");

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setLanguage(lang);
    };

    useEffect(() => {
        i18n.on("languageChanged", (lng) => {
            setLanguage(lng);
        });

        return () => {
            i18n.off("languageChanged");
        };
    }, []);

    return (
        <I18nContext.Provider value={{ language, changeLanguage }}>
            {children}
        </I18nContext.Provider>
    );
};

export default TranslationProvider;