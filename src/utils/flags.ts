// Flag emoji based on language code
export const getFlagClassEmoji = (code: string) => {
    // Some common language codes to emoji flags mapping or lucide icons
    const languageToFlag = {
        'br': 'fi fi-br',
        'en': 'fi fi-us',
        'es': 'fi fi-es',
        'fr': 'fi fi-fr',
        'de': 'fi fi-de',
        'it': 'fi fi-it',
        'jp': 'fi fi-jp',
        'kr': 'fi fi-kr',
        'zh': 'fi fi-cn',
        'ru': 'fi fi-ru',
        'ar': 'fi fi-sa',
        'fi': 'fi fi-fi',
        'nl': 'fi fi-nl',
        'pt': 'fi fi-pt',
        'sv': 'fi fi-se',
        'tr': 'fi fi-tr',
        'pl': 'fi fi-pl',
        'no': 'fi fi-no',
        'da': 'fi fi-dk',
        'el': 'fi fi-gr',
        'hu': 'fi fi-hu',
        'cs': 'fi fi-cz',
        'ro': 'fi fi-ro',
        'sk': 'fi fi-sk',
        'bg': 'fi fi-bg',
        'uk': 'fi fi-ua',
        'hr': 'fi fi-hr',
        'id': 'fi fi-id',
        'ms': 'fi fi-my',
        'th': 'fi fi-th',
        'vi': 'fi fi-vn',
        'hi': 'fi fi-in',
        'he': 'fi fi-il',
        'fa': 'fi fi-ir',
        'ur': 'fi fi-pk',
        'bn': 'fi fi-bd',
        'ta': 'fi fi-lk'
    }
    return languageToFlag[code?.toLowerCase()];
};
