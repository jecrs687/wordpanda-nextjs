import { useTranslation } from "react-i18next";



export function Trans() {
    const { t } = useTranslation();

    return <h2>{t('Welcome to React')}</h2>;
}