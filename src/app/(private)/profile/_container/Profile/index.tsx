"use client";

import { getUserWithWords } from '@backend/domain/actions/User/getUserWithWords.action';
import { SelectLanguage } from '@common/SelectLanguage';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Metrics from '../Metrics';
import UserForm from '../UserForm';

export default function UserProfile({ errors, user }: {
  errors?: any,
  user: Awaited<ReturnType<typeof getUserWithWords>>['user']
}) {
  const metrics = user.userLanguages?.map((lang) => ({
    ...lang,
    metric: lang.userWords?.reduce(
      (acc, curr) => {
        return {
          errors: acc.errors + curr.errors,
          attempts: acc.attempts + curr.attempts,
          mostShowed: acc?.mostShowedAttempts < curr.attempts ? curr?.word.word : acc.mostShowed,
          mostShowedAttempts: acc?.mostShowedAttempts < curr.attempts ? curr?.attempts : acc.mostShowedAttempts,
          mostWrong: acc?.mostWrongAttempts < curr.errors ? curr?.word.word : acc.mostWrong,
          mostWrongAttempts: acc?.mostWrongAttempts < curr.errors ? curr?.errors : acc.mostWrongAttempts,
        }
      }, {
      errors: 0,
      attempts: 0,
      mostShowed: '',
      mostShowedAttempts: 0,
      mostWrongAttempts: 0,
      mostWrong: '',
    })
  }));

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-emerald-400/10 dark:bg-emerald-800/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-40 left-1/4 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-800/10 rounded-full blur-3xl -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex items-center"
      >
        <div className="bg-white dark:bg-gray-800 rounded-full p-1 mr-4 shadow-lg">
          <Image
            src="/assets/logo.png"
            alt="WordPanda"
            width={60}
            height={60}
            className="rounded-full"
          />
        </div>
        <div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-indigo-400"
          >
            Perfil do usuário
          </motion.h1>
          <p className="text-zinc-600 dark:text-zinc-300">
            Gerencie suas informações e acompanhe seu progresso
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Information Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl dark:shadow-gray-900/30 p-6 border border-gray-200/50 dark:border-gray-700/50">
            <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800 dark:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Olá, {user.firstName} {user.lastName}!
            </h2>

            <div className="space-y-6">
              <UserForm user={user} />

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Configurações do sistema
                </h3>
                <SelectLanguage
                  title="Idioma do sistema"
                  name='languageId'
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Metrics Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl dark:shadow-gray-900/30 p-6 border border-gray-200/50 dark:border-gray-700/50 h-full">
            <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800 dark:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Seu progresso
            </h2>

            <div className="h-[500px]">
              <Metrics />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
