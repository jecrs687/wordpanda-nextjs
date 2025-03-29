/**
 * Domain Actions Index
 * 
 * This file exports all domain actions from their respective subfolders.
 * Each action is a function that implements specific business logic operations
 * related to the domain entities defined in the Prisma schema.
 */

// User Management & Authentication
export * from './User/createUser.action'; // Creates a new user account with email/password validation and stores encrypted password
export * from './User/getUser.action'; // Retrieves basic user information with caching for performance optimization
export * from './User/getUserProgress.action'; // Gets detailed user learning progress metrics including streak, daily goals, and overall statistics
export * from './User/getUserWithWords.action'; // Retrieves a user with their learned words and language relationships
export * from './User/loginUser.action'; // Authenticates a user by validating credentials and generates a JWT token
export * from './Word/otpValidations.action'; // Handles OTP verification for user account activation and email verification

// Learning & Progress Tracking
export * from './Learning/getWordOfTheDay.action'; // Retrieves a featured word of the day with translations and contextual examples
export * from './Streak/preserveStreak.action'; // Maintains user learning streak during breaks using points or subscription benefits
export * from './Word/createWord.action'; // Creates new words in the system with validation and language association
export * from './Word/createWordsFromEvent.action'; // Creates words from subtitle event data and associates them with the correct language
export * from './Word/getSrsReviewWords.action'; // Gets words due for spaced repetition review based on SRS algorithm timing
export * from './Word/getWords.action'; // Retrieves words with translations based on filters, supports caching and batch processing
export * from './Word/updateSrsProgress.action'; // Updates word learning progress using SuperMemo-2 SRS algorithm with recall quality

// Languages
export * from './Languages/getLanguage.action'; // Gets detailed information for a specific language by ID
export * from './Languages/getLanguages.action'; // Gets all available languages with word counts and statistics
export * from './Languages/getUserLanguages.action'; // Gets languages a user is currently learning with progress information
export * from './Translation/getTranslations.action'; // Gets translations for UI localization based on user preferences

// Learning Sessions
export * from './LearningSession/completeLearningSession.action'; // Completes a learning session with results and metrics tracking
export * from './LearningSession/createLearningSession.action'; // Creates a new learning session and updates user streak information

// Games & Activities
export * from './Games/completeGameSession.action'; // Completes a game session with score, metrics, and word progress updates
export * from './Games/createGameSession.action'; // Creates a new game session with associated words and learning context
export * from './Games/flash.action'; // Handles flashcard game interaction with spaced repetition updates
export * from './Games/memory.action'; // Handles memory card game logic with word learning progress tracking
export * from './Games/quiz.action'; // Handles quiz game with AI-generated questions and word mastery tracking

// Media & Content
export * from './Media/getRecommendedMedia.action'; // Gets personalized media recommendations based on user language level
export * from './Movie/getMovieByUser.action'; // Gets movie details with user progress and learned words from that content
export * from './Platform/getPlatform.action'; // Gets platform information with available media content
export * from './Subtitles/insertSubtitles'; // Processes and inserts subtitle data with word extraction and frequency analysis

// Challenges & Achievements
export * from './Achievements/getAchievements.action'; // Gets user achievements and progress toward next milestones
export * from './Challenges/getUserChallenges.action'; // Gets active, upcoming, and completed challenges for a user

// Dashboard & Analytics
export * from './Analytics/trackUserActivity.action'; // Tracks user activity for analytics and engagement measurement
export * from './Dashboard/getLearningInsights.action'; // Gets comprehensive learning analytics for dashboard with trends and forecasts
export * from './Metrics/getUserMetrics.action'; // Gets detailed user learning metrics including success rates and learning efficiency

// Social Features
export * from './Social/shareProgress.action'; // Generates shareable content for social media with referral tracking

// Settings
export * from './Settings/updateSrsSettings.action'; // Updates user's spaced repetition settings and learning preferences

/**
 * This index file provides a centralized access point to all domain actions
 * in the application, organized by their respective functional areas.
 * Each function implements core business logic with proper error handling,
 * data validation, and transaction management where appropriate.
 */
