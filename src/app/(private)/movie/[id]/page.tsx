import { getMovieByUser } from '@backend/domain/actions/Movie/getMovieByUser';
import BackButton from '@common/BackButton';
import CardGame from '@common/Cards/CardGame';
import { Suspense } from 'react';
import MoviesLayout from '../_components/MoviesLayout';
import MovieDetailSkeleton from './_components/MovieDetailSkeleton';

export const dynamic = 'force-dynamic';

export default async function Page(props) {
    const params = await props.params;
    const { id } = params;

    const { movie, user } = await getMovieByUser(id);

    return (
        <MoviesLayout>
            <Suspense fallback={<MovieDetailSkeleton />}>
                <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 relative">
                    {/* Decorative background elements */}
                    <div className="absolute top-20 right-20 w-64 h-64 bg-emerald-400/10 dark:bg-emerald-800/10 rounded-full blur-3xl -z-10" />
                    <div className="absolute bottom-40 left-1/4 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-800/10 rounded-full blur-3xl -z-10" />

                    {/* Header section */}
                    <div className="mb-8">
                        <BackButton title={movie.name} />
                    </div>

                    {/* Movie details section */}
                    <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl dark:shadow-gray-900/30 p-6 border border-gray-200/50 dark:border-gray-700/50 mb-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                            <div className="w-full max-w-xs">
                                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-2xl">
                                    <img
                                        src={movie.logoUrl}
                                        alt={movie.name}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>

                            <div className="flex-1">
                                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-indigo-400 mb-4">
                                    {movie.name}
                                </h1>

                                <div className="space-y-2 mb-6">
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {movie.description || 'No description available'}
                                    </p>
                                </div>

                                <div>
                                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                        </svg>
                                        <span className="text-sm font-medium">
                                            {movie.mediaLanguages?.length || 0} Languages Available
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Available languages section */}
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-indigo-400 mb-6">
                            Available Languages
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {movie.mediaLanguages?.map((mediaLanguage, index) => (
                                <CardGame
                                    key={index}
                                    mediaId={movie.id}
                                    words={[]}
                                    language={mediaLanguage.language.code}
                                    languageName={mediaLanguage.language.language}
                                    mediaWords={mediaLanguage.mediaWords}
                                    totalWords={mediaLanguage._count.mediaWords}
                                />
                            ))}

                            {!movie.mediaLanguages?.length && (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No languages available for this movie yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Suspense>
        </MoviesLayout>
    );
}
