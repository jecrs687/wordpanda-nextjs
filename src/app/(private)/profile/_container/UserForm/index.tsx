"use client";

import { ROUTES } from '@constants/ROUTES';
import { User } from '@prisma/client';
import { fetchClient } from '@services/fetchClient';
import { setCookie } from '@utils/cookie';
import { Formik } from 'formik';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { ProfilePutRequest, ProfilePutResponse } from 'src/app/api/profile/route';
import useSWRMutation from 'swr/mutation';
import { z } from 'zod';

export default function UserForm({ user }: {
    user: User
}) {
    const { firstName, lastName, email, phone, languageId } = user;
    const [edit, setEdit] = useState(false);
    const { data, trigger } = useSWRMutation<
        ProfilePutResponse,
        Error,
        string,
        ProfilePutRequest
    >('/api/profile', fetchClient('PUT'));

    const validate = z.object({
        firstName: z.string().min(3, 'O nome deve conter pelo menos 3 caracteres'),
        lastName: z.string().min(3, 'O sobrenome deve conter pelo menos 3 caracteres'),
        email: z.string().email('Email inválido'),
        phone: z.string().min(8, 'O telefone deve conter pelo menos 8 caracteres'),
        password: z.string().min(8, 'A senha deve conter pelo menos 8 caracteres').or(z.string().max(0)),
    });

    return (
        <Formik
            initialValues={{
                firstName,
                lastName,
                email,
                phone,
                password: '',
                languageId
            }}
            validate={values => {
                try {
                    validate.parse(values);
                } catch (error) {
                    return error.formErrors.fieldErrors;
                }
            }}
            onSubmit={async (values, { setSubmitting }) => {
                setCookie('language', String(values.languageId));
                localStorage.setItem('wordPand_language', String(values.languageId));
                await trigger(values);
                setSubmitting(false);
                setEdit(false);
            }}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
            }) => (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        {/* Email field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                disabled={!edit}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border rounded-lg focus:ring-2 focus:ring-emerald-500/40 focus:outline-none transition-all ${errors.email && touched.email
                                    ? 'border-rose-500'
                                    : 'border-gray-300 dark:border-gray-700'
                                    } ${!edit ? 'opacity-70' : ''}`}
                            />
                            {errors.email && touched.email && (
                                <p className="mt-1 text-xs text-rose-500">{errors.email}</p>
                            )}
                        </div>

                        {/* Password field (only shown when editing) */}
                        {edit && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Senha
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="********"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border rounded-lg focus:ring-2 focus:ring-emerald-500/40 focus:outline-none transition-all ${errors.password && touched.password
                                        ? 'border-rose-500'
                                        : 'border-gray-300 dark:border-gray-700'
                                        }`}
                                />
                                {errors.password && touched.password && (
                                    <p className="mt-1 text-xs text-rose-500">{errors.password}</p>
                                )}
                            </div>
                        )}

                        {/* First name field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nome
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                disabled={!edit}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.firstName}
                                className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border rounded-lg focus:ring-2 focus:ring-emerald-500/40 focus:outline-none transition-all ${errors.firstName && touched.firstName
                                    ? 'border-rose-500'
                                    : 'border-gray-300 dark:border-gray-700'
                                    } ${!edit ? 'opacity-70' : ''}`}
                            />
                            {errors.firstName && touched.firstName && (
                                <p className="mt-1 text-xs text-rose-500">{errors.firstName}</p>
                            )}
                        </div>

                        {/* Last name field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Sobrenome
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                disabled={!edit}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.lastName}
                                className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border rounded-lg focus:ring-2 focus:ring-emerald-500/40 focus:outline-none transition-all ${errors.lastName && touched.lastName
                                    ? 'border-rose-500'
                                    : 'border-gray-300 dark:border-gray-700'
                                    } ${!edit ? 'opacity-70' : ''}`}
                            />
                            {errors.lastName && touched.lastName && (
                                <p className="mt-1 text-xs text-rose-500">{errors.lastName}</p>
                            )}
                        </div>

                        {/* Phone field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Telefone
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                disabled={!edit}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.phone}
                                className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border rounded-lg focus:ring-2 focus:ring-emerald-500/40 focus:outline-none transition-all ${errors.phone && touched.phone
                                    ? 'border-rose-500'
                                    : 'border-gray-300 dark:border-gray-700'
                                    } ${!edit ? 'opacity-70' : ''}`}
                            />
                            {errors.phone && touched.phone && (
                                <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>
                            )}
                        </div>
                    </div>

                    {/* Button group */}
                    <div className="flex flex-col space-y-3 pt-3">
                        {edit ? (
                            <div className="flex space-x-3">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Salvando...
                                        </span>
                                    ) : "Salvar"}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    type="button"
                                    onClick={() => setEdit(false)}
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                                >
                                    Cancelar
                                </motion.button>
                            </div>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                type="button"
                                onClick={() => setEdit(true)}
                                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            >
                                Editar perfil
                            </motion.button>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            className="px-4 py-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-medium rounded-lg hover:bg-rose-200 dark:hover:bg-rose-800/30 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                        >
                            <Link href={ROUTES.LOGOUT()} className="flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Sair
                            </Link>
                        </motion.button>
                    </div>
                </form>
            )}
        </Formik>
    );
}
