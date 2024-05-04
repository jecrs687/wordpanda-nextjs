"use client";

import Input from '@common/Input';
import { TOKEN_KEY } from '@constants/CONFIGS';
import { ROUTES } from '@constants/ROUTES';
import Button from '@core/Button';
import LoaderSpinner from '@core/LoaderSpinner';
import { useChannels } from '@hooks/useChannels';
import useDevice from '@hooks/useDevice';
import Image from 'next/image';
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

export default function LoginPage({ nextPage }: { nextPage?: string }) {
    const [state, formAction] = useFormState(submit, {})
    const { extension } = useDevice()
    const route = useRouter()
    const { web } = useChannels()
    useEffect(() => {
        if (state.admin)
            localStorage.setItem('admin', state.admin)

        if (state.token) {
            localStorage.setItem(TOKEN_KEY, state.token)
            web.setToken(state.token)
            route.push(nextPage ? nextPage : extension ? ROUTES.EXTENSION_LANGUAGES() : ROUTES.DASHBOARD())
        }
    }, [state, route, web, extension, nextPage])
    return (
        <main className={styles.main}>
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
            </form>
            <div onClick={()=>{
               window.open("https://wordpanda.app"+ROUTES.REGISTER())
            }} className={styles.link}>
                Não tem uma conta? Registre-se
            </div>
        </main>
    )
}
