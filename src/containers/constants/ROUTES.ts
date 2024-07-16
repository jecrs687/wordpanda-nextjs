export const ROUTES = {

    LOGIN: () => '/login',
    OTP: (id: string) => `/otp/${id}`,
    LOGOUT: () => '/logout',
    REGISTER: () => '/register',
    HOME: () => '/',
    DASHBOARD: () => '/dashboard',
    PROFILE: () => '/profile',
    NOT_FOUND: () => '/not-found',
    FORGOT_PASSWORD: () => '/forgot-password',
    RESET_PASSWORD: () => '/reset-password',
    VERIFY_EMAIL: () => '/verify-email',
    LANGUAGES: () => '/languages',
    LANGUAGE: (id) => `/languages/${id}`,
    GAMES: () => '/games',
    GAME_QUIZ: () => `/games/quiz`,
    GAME_FLASHCARD: () => `/games/flashcard`,
    GAME_TRANSLATE: () => `/games/translate`,
    GAME_SPEAK: () => `/games/speak`,
    GAME_LISTENING: () => `/games/listening`,
    GAME_WRITE: () => `/games/write`,
    GAME_CHAT: () => `/games/chat`,
    GAME_HANGMAN: () => `/games/hangman`,
    GAME_MEMORY: () => `/games/memory`,
    GAME_LIST: () => `/games/list`,
    WORDS: () => '/words',
    WORD: (id) => `/words/${id}`,
    WORDS_RESULT: () => '/words/result',
    MOVIES: () => '/movies',
    MOVIE: (id) => `/movies/${id}`,
    VIDEOS: () => '/videos',
    VIDEO: (id) => `/videos/${id}`,
    ADMIN: () => `/admin`,
    SAVE_WORDS: () => `/admin/save-words`,
    EXTENSION: () => `/extension`,
    EXTENSION_GAMES: () => `/extension/games`,
    EXTENSION_LANGUAGES: () => `/extension/languages`,
    POP_LOGIN: () => '/pop-up/login',
    POP_REGISTER: () => '/pop-up/register',
    POP_DASHBOARD: () => '/pop-up/dashboard',

}