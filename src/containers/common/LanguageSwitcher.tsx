import { useI18n } from "@providers/TranslationProvider";

const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "pt", name: "Português" }
];

export default function LanguageSwitcher() {
    const { language, changeLanguage } = useI18n();

    return (
        <div className="language-switcher">
            <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="p-2 rounded border border-gray-300 bg-white"
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
