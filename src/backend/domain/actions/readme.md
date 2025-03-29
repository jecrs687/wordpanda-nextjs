
- `createUser(data)`: Creates a new user account with email validation and password encryption. Returns the created user or error message.

- `getUser()`: Retrieves basic user information with associated language. Uses Redis caching with 1000s TTL for performance optimization.

- `getUserInformation()`: Retrieves detailed user data including languages, word counts, and media usage with Redis caching (TTL: 1000s).

- `getUserProgress()`: Provides comprehensive learning statistics including streak data, daily metrics, overall progress, language-specific completion rates, and 14-day activity history with Redis caching (TTL: 300s).

- `getUserWithWords()`: Retrieves a user's complete learning portfolio including all words across all languages, with detailed word metadata and media engagement statistics.

- `loginUser(email, password)`: Authenticates a user by validating credentials and generates a JWT token for session management.

- `resendOtp({id})`: Generates a 4-digit OTP, stores it in Redis cache, and sends it via email for user verification.

- `otpSubmit(currentState, form)`: Validates the user-submitted OTP against the stored value, activates the user account, and issues an authentication token.

- `getWordOfTheDay(request)`: Retrieves a consistent daily featured word based on date hash, providing translations, example usage, and difficulty rating, with Redis caching (TTL: 86400s).

- `preserveStreak(days)`: Maintains user learning streak during breaks using points or subscription benefits. Requires authentication.

- `createWord(wordData)`: Creates new words in the system with validation and language association. Returns created word data or error messages.

- `createWordsFromEvent(subtitleEvent, languageId)`: Creates words from subtitle event data and associates them with the correct language. Handles frequency analysis and duplicate detection.

- `getSrsReviewWords(request)`: Retrieves words due for review based on SRS scheduling, combining both review words and new words based on configured ratios, with comprehensive statistics about learning progress.
- `getUserTargetLanguageId(userId)`: Helper function that gets the user's target/native language ID for translations.
- `formatUserWord()`, `formatWord()`, `formatTranslations()`: Helper functions that format database results into standardized response structures.

- `calculateWordScore(word)`: Assigns a priority score to words based on error rates, recency, and frequency for optimal learning.
- `sortWords(a, b)`: Sorts words by their calculated scores for prioritized learning.
- `getUserId()`: Retrieves the authenticated user's ID from cookies or authorization headers.

- `updateSrsProgress(request)`: Implements the SuperMemo2 spaced repetition algorithm to update a word's learning progress based on recall quality (0-5), calculating intervals, ease factors, confidence levels, and next review dates. Also updates global word statistics and clears relevant caches.

- `getLanguage({id, userId})`: Retrieves detailed information about a specific language by ID, with authentication verification.

- `getLanguages()`: Retrieves all available languages with comprehensive statistics about word counts and user adoption.
- `setUserLanguage({id})`: Updates a user's primary language preference for learning and UI.

- `getUserLanguages()`: Retrieves all languages a user is currently learning with statistics about word counts, progress, and available vocabulary.

- `getTranslations()`: Loads appropriate translation strings based on user language preferences, supporting dynamic path-based lookups for UI internationalization.

- `completeLearningSession(request)`: Finalizes a learning session with metrics like duration and words learned, awards points, checks for achievements, and clears user caches.
- `checkAndAwardAchievements(userId)`: Helper function that evaluates and awards eligible achievements based on user progress.

- `createLearningSession(request)`: Creates a new learning session record and intelligently updates user streak information based on daily activity patterns.
- `runTransactionWithRetries(fn, maxRetries)`: Implements retry logic for database transactions to handle potential conflicts or deadlocks.

- `completeGameSession(request)`: Records game results including score, individual round performance, updates word mastery statistics, and completes the associated learning session.
- `runTransactionWithRetries(fn, maxRetries)`: Ensures database transaction reliability with retry logic for conflict resolution.

- `createGameSession(request)`: Initializes a new game session with specified game type and either selected words or automatically chosen words for review, creating an associated learning session.
- `runTransactionWithRetries(fn, maxRetries)`: Implements robust database transaction handling with exponential backoff retry logic.

- `flashGameAction(body)`: Processes flashcard game interactions, updating word learning statistics based on difficulty ratings and ensuring proper language and media relationships.
- `GET()`: API compatibility function for HTTP GET requests (appears to be a placeholder).

- `memoryGameAction(body)`: Handles memory game interaction results, updating word learning progress, streak data, and ensuring proper relationships between users, languages, and media.

- `quizGameAction({words})`: Manages quiz gameplay, generating AI-based questions for words without existing quiz data and retrieving formatted word data for the game interface.

- `getRecommendedMedia(request)`: Gets personalized media recommendations based on user language level, difficulty preferences, and previous viewing history.

- `getMovieByUser(movieId)`: Retrieves movie details with user progress and learned words from that content, including related media information.

- `getPlatforms({take, skip, search})`: Retrieves platforms (like Netflix, YouTube) with their available media content, using in-memory caching with 24-hour expiration.

- `insertSubtitles(subtitleData, mediaId, languageId)`: Processes and inserts subtitle data with word extraction, frequency analysis, and media association.

- `getAchievements()`: Retrieves earned achievements, available achievements, and progress toward next milestones with Redis caching (TTL: 300s).

- `getUserChallenges()`: Gets active, upcoming, and completed challenges for the user, including global community challenges, with Redis caching (TTL: 300s).

- `trackUserActivity(request)`: Records user engagement data for analytics purposes, updating activity timestamps and marketing metrics.
- `updateMarketingMetrics(activityType)`: Helper function that updates aggregate metrics for marketing analysis based on activity type.

- `getLearningInsights()`: Provides advanced learning analytics with trends, forecasts, and personalized insights for optimizing learning strategies, with Redis caching (TTL: 1800s).

- `getUserMetrics()`: Generates comprehensive learning analytics with detailed statistics on words, languages, success rates, and usage patterns.
- `calculateStreak()`: Intelligently calculates and updates user streak information based on activity history.
- `processDailyActivity()`: Analyzes daily learning patterns across languages.
- `calculateSuccessRates()`: Computes recall success rates by language and overall.
- `getMostUsedWords()`, `getMostDifficultWords()`: Identifies frequently used and challenging words.
- `calculateLearningEfficiency()`: Measures learning efficiency as words learned per attempt.
- `calculatePracticeFrequency()`: Analyzes study time patterns by day and time of day.
- `calculateDailyGoalProgress()`: Tracks progress toward daily learning goals.
- `processGamePerformance()`: Analyzes game results and accuracy metrics.
- `processSessionMetrics()`: Compiles statistics on learning sessions and time spent.
- `formatTime()`: Helper function for human-readable time formatting.

- `getSrsSettings()`: Retrieves a user's spaced repetition settings with default values and caching.
- `updateSrsSettings(request)`: Updates a user's spaced repetition settings and learning preferences, clearing cache to ensure settings consistency.

- `shareProgress(options)`: Generates shareable content for social media with referral tracking and personalized learning statistics.
