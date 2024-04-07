"use client";

import Input from '@common/Input';
import { ROUTES } from '@constants/ROUTES';
import Button from '@core/Button';
import LoaderSpinner from '@core/LoaderSpinner';
import { useChannels } from '@hooks/useChannels';
import useDevice from '@hooks/useDevice';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from "react-dom";
import { submit } from './action';
import styles from './index.module.scss';

function Submit() {
    const status = useFormStatus();
    return <Button disabled={status.pending} type='submit'>
        {
            status.pending ? <LoaderSpinner size='20px' /> : 'Login'
        }
    </Button>
}

export default function LoginPage() {
    const [state, formAction] = useFormState(submit, {})
    const { extension } = useDevice()
    const route = useRouter()
    const { web } = useChannels()
    useEffect(() => {
        if (state.admin)
            localStorage.setItem('admin', state.admin)

        if (state.token) {
            localStorage.setItem('wordPand_token', state.token)
            route.push(extension ? ROUTES.EXTENSION_GAMES() : ROUTES.DASHBOARD())
            web.setToken(state.token)
        }
    }, [state, route, web, extension])
    return (
        <main className={styles.main}>
            <Image
                src="/assets/backgrounds/login.jpeg"
                alt="logo"
                width={1000}
                height={1000}
                className={styles.background}
            />
            <form action={formAction}>

                <div className={styles.logo}>
                    <Image
                        src="/assets/logo.png"
                        alt="logo"
                        width={100}
                        height={100}
                        className={styles.logo__image}
                    />
                    <h3 className={styles.logo__title}>
                        Wordpanda
                    </h3>

                </div>

                <Input
                    type='text'
                    placeholder='Email'
                    name="email"
                    title='Email'
                    error={state?.errors?.email}
                />
                <Input
                    type='password'
                    placeholder='Senha'
                    name="password"
                    title='Senha'
                    error={state?.errors?.password}
                />
                <Submit />

                <Link href={ROUTES.REGISTER()} className={styles.link}>
                    Não tem uma conta? Registre-se
                </Link>
            </form>
        </main>
    )
}
