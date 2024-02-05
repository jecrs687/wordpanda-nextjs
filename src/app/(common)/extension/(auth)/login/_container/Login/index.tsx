"use client";

import Input from '@common/Input';
import { ROUTES } from '@constants/ROUTES';
import Button from '@core/Button';
import LoaderSpinner from '@core/LoaderSpinner';
import { useChannels } from '@hooks/useChannels';
import useDevice from '@hooks/useDevice';
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
            status.pending ? <LoaderSpinner size='16px' /> : 'Login'
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
            <form action={formAction}>
                {/* <Image
                    src={"/assets/logo.png"}
                    width={200}
                    height={200}
                    alt='logo'
                    className={styles.image}
                /> */}
                <h1>Language boost</h1>

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
            </form>
            <Link href={ROUTES.REGISTER()}>Não tem uma conta? Registre-se
            </Link>
        </main>
    )
}
