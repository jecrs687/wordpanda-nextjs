"use client";
import Input from '@common/Input';
import { SelectLanguage } from '@common/SelectLanguage';
import { ROUTES } from '@constants/ROUTES';
import Button from '@core/Button';
import { User } from '@prisma/client';
import { fetchClient } from '@services/fetchClient';
import { setCookie } from '@utils/cookie';
import { Formik } from 'formik';
import Link from 'next/link';
import { useState } from 'react';
import { ProfilePutRequest, ProfilePutResponse } from 'src/app/api/profile/route';
import useSWRMutation from 'swr/mutation';
import { z } from 'zod';
import styles from './UserForm.module.scss';
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
    >('/api/profile', fetchClient('PUT'))
    const validate = z.object({
        firstName: z.string().min(3,
            'O nome deve conter pelo menos 3 caracteres'
        ),
        lastName: z.string().min(3,
            'O sobrenome deve conter pelo menos 3 caracteres'
        ),
        email: z.string().email(),
        phone: z.string().min(8,
            'O telefone deve conter pelo menos 8 caracteres'
        ),
        password: z.string()
            .min(8, 'A senha deve conter pelo menos 8 caracteres')
            .or(z.string().max(0)),
    })
    return (
        <Formik
            initialValues={
                {
                    firstName,
                    lastName,
                    email,
                    phone,
                    password: '',
                    languageId
                }
            }
            validate={
                values => {
                    try {
                        validate.parse(values)
                    } catch (error) {
                        return error.formErrors.fieldErrors
                    }
                }
            }
            onSubmit={async (values, { setSubmitting }) => {
                setCookie('language', String(values.languageId))
                localStorage.setItem('wordPand_language', String(values.languageId))
                await trigger(values);
                setSubmitting(false);
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
                <form onSubmit={handleSubmit} className={styles.form}>
                    <Input
                        type="email"
                        name="email"
                        title="Email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={!edit}
                        value={values.email}
                        error={errors.email && touched.email && errors.email}
                    />
                    <Input
                        type="password"
                        name="password"
                        title="Senha"
                        placeholder='*********'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={!edit}
                        value={values.password}
                        error={errors.password && touched.password && errors.password}
                    />
                    <Input
                        type="text"
                        name="firstName"
                        title="Nome"
                        disabled={!edit}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.firstName}
                        error={errors.firstName && touched.firstName && errors.firstName}
                    />
                    <Input
                        type="text"
                        name="lastName"
                        title="Sobrenome"
                        disabled={!edit}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.lastName}
                        error={errors.lastName && touched.lastName && errors.lastName}
                    />
                    <Input
                        type="text"
                        name="phone"
                        title="Telefone"
                        disabled={!edit}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.phone}
                        error={errors.phone && touched.phone && errors.phone}
                    />
                    <SelectLanguage
                        title="Idioma do sistema"
                        disabled={!edit}
                        name='languageId'
                        error={errors.languageId && touched.languageId && errors.languageId}
                        value={languageId}
                        onChange={({ value }) => {

                            handleChange({ target: { name: 'languageId', value } })
                        }}
                        onBlur={handleBlur}
                        className={styles.select}
                    />
                    <div className={styles.buttons}>

                        <div className={styles.buttons__group}>
                            <Button
                                type={!edit ? 'submit' : 'button'}
                                onClick={() => setEdit(!edit)}
                            >
                                {edit ? 'Salvar' : 'Editar'}
                            </Button>
                            {
                                edit && <Button
                                    type="button"
                                    variety="secondary"
                                    onClick={() => setEdit(!edit)}
                                >
                                    Cancelar
                                </Button>
                            }

                        </div>

                        <Button variety='secondary'>
                            <Link href={ROUTES.LOGOUT()} >
                                Logout
                            </Link>
                        </Button>
                    </div>

                </form>
            )}
        </Formik>
    );
}
