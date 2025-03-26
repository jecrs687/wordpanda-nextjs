"use client";

import { getUserWithWords } from '@backend/domain/actions/User/getUserWithWords.action';
import { SelectLanguage } from '@common/SelectLanguage';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Metrics from '../../_components/Metrics';
import ProfileHeader from '../../_components/ProfileHeader';
import UserForm from '../UserForm';

export default function UserProfile({ errors, user }: {
  errors?: any,
  user: Awaited<ReturnType<typeof getUserWithWords>>['user']
}) {
  const { t } = useTranslation();

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
      mostWrong: '',
      mostWrongAttempts: 0,
    })
  })
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      <ProfileHeader user={user} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Metrics metrics={metrics} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="rounded-xl bg-white dark:bg-gray-900 shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('profile.learningLanguage')}
            </h2>
            <SelectLanguage
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <UserForm user={user} />
        </div>
      </div>
    </motion.div>
  );
}
