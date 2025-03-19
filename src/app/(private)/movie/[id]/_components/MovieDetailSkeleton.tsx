import { motion } from "framer-motion";

export default function MovieDetailSkeleton() {
    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Header skeleton */}
            <div className="h-10 mb-8 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>

            {/* Movie details skeleton */}
            <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 mb-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Poster skeleton */}
                    <div className="w-full max-w-xs">
                        <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    </div>

                    <div className="flex-1">
                        {/* Title skeleton */}
                        <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4"></div>

                        {/* Description skeleton */}
                        <div className="space-y-2 mb-6">
                            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div className="h-4 w-4/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>

                        {/* Badge skeleton */}
                        <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Languages section skeleton */}
            <div>
                <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-6"></div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, index) => (
                        <motion.div
                            key={index}
                            className="h-64 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
