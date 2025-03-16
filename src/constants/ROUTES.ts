export const ROUTES = {
    // Auth routes
    LOGIN: () => "/login",
    REGISTER: () => "/register",
    FORGOT_PASSWORD: () => "/forgot-password",
    RESET_PASSWORD: (token?: string) => `/reset-password${token ? `/${token}` : ''}`,

    // Dashboard
    DASHBOARD: () => "/dashboard",

    // User
    PROFILE: () => "/profile",
    SETTINGS: () => "/settings",

    // Words
    MY_WORDS: () => "/words",
    WORD_DETAILS: (id: string) => `/words/${id}`,

    // Media
    MEDIA: (id: string) => `/media/${id}`,
    MEDIA_WITH_LANGUAGE: (id: string, code: string) => `/media/${id}?code=${code}`,

    // Languages
    LANGUAGES: () => "/languages",
    LANGUAGE_DETAILS: (code: string) => `/languages/${code}`,

    // Library
    LIBRARY: () => "/library",

    // Explore
    EXPLORE: () => "/explore",

    // Study
    NEW_STUDY: () => "/study/new",
    STUDY: (id: string) => `/study/${id}`,

    // Static pages
    ABOUT: () => "/about",
    CONTACT: () => "/contact",
    PRIVACY: () => "/privacy",
    TERMS: () => "/terms",
};
