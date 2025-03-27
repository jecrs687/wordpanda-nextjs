"use client";

import { ROUTES } from '@constants/ROUTES';
import { User } from '@prisma/client';
import { fetchClient } from '@services/fetchClient';
import { setCookie } from '@utils/cookie';
import { Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { Edit, Save, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProfilePutRequest, ProfilePutResponse } from 'src/app/api/profile/route';
import useSWRMutation from 'swr/mutation';
import { z } from 'zod';
import UserFormField from '../../_components/UserFormField';

export default function UserForm({ user }: {
    user: User
}) {
    const { t } = useTranslation();
    const { firstName, lastName, email, phone } = user;
    const [edit, setEdit] = useState(false);
    const { data, trigger } = useSWRMutation<
        ProfilePutResponse,
        Error,
        string,
        ProfilePutRequest
    >('/api/profile', fetchClient('PUT'));

    const validate = z.object({
        firstName: z.string().min(3, t('profile.validation.firstName')),
        lastName: z.string().min(3, t('profile.validation.lastName')),
        email: z.string().email(t('profile.validation.email')),
        phone: z.string().min(8, t('profile.validation.phone')),
        password: z.string().min(8, t('profile.validation.password')).or(z.string().max(0)),
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl bg-white dark:bg-gray-900 shadow-sm p-6"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('profile.personalInfo')}</h2>
                {!edit ? (
                    <button
                        onClick={() => setEdit(true)}
                        className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                    >
                        <Edit className="w-4 h-4" />
                        {t('common.edit')}
                    </button>
                ) : (
                    <button
                        onClick={() => setEdit(false)}
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                        <X className="w-4 h-4" />
                        {t('common.cancel')}
                    </button>
                )}
            </div>

            <Formik
                initialValues={{
                    firstName,
                    lastName,
                    email,
                    phone,
                    password: '',
                }}
                validate={(values) => {
                    try {
                        validate.parse(values);
                        return {};
                    } catch (error: any) {
                        return error.formErrors.fieldErrors;
                    }
                }}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                    try {
                        const response = await trigger({
                            ...values,
                            ...(values.password === '' && { password: undefined }),
                        });
                        if (response?.data) {
                            setCookie(ROUTES.PROFILE(), 'true', 1);
                            setEdit(false);
                        }
                    } catch (error) {
                        console.error(error);
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                            <UserFormField
                                label={t('register.form.firstName.label')}
                                name="firstName"
                                disabled={!edit}
                            />

                            <UserFormField
                                label={t('register.form.lastName.label')}
                                name="lastName"
                                disabled={!edit}
                            />

                            <UserFormField
                                label={t('auth.email')}
                                name="email"
                                type="email"
                                disabled={!edit}
                            />

                            <UserFormField
                                label={t('register.form.phone.label')}
                                name="phone"
                                disabled={!edit}
                            />

                            {edit && (
                                <UserFormField
                                    label={t('auth.newPassword')}
                                    name="password"
                                    type="password"
                                    placeholder={t('profile.passwordPlaceholder')}
                                />
                            )}
                        </div>

                        {edit && (
                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="w-4 h-4" />
                                    {t('common.save')}
                                </button>
                            </div>
                        )}
                    </Form>
                )}
            </Formik>
        </motion.div>
    );
}
