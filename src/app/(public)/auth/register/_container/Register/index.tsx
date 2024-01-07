"use client";
import { Input } from '@common/Input';
import Image from 'next/image';
import { useFormState } from 'react-dom';
import { submit } from './action';
import styles from './index.module.scss';

export default function Register() {
    const [state, formAction] = useFormState(submit, {})

    return (
        <main className={styles.main}>

            <form action={formAction}>
                <Image
                    src={"/assets/logo.png"}
                    width={200}
                    height={200}
                    alt='logo'
                    className={styles.image}
                />
                <h1>Language boost</h1>

                <Input
                    placeholder='Email'
                    name="email"
                    title='Email'
                    type='text'
                    error={state.errors?.email}
                />
                <Input
                    placeholder='Senha'
                    name="password"
                    title='Senha'
                    type='password'
                    error={state.errors?.password}
                />
                <Input
                    placeholder='Primeiro nome'
                    name="firstName"
                    title='Primeiro nome'
                    type='text'
                    error={state.errors?.firstName}
                />
                <Input
                    placeholder='Ultimo nome'
                    name="lastName"
                    title='Ultimo nome'
                    type='text'
                    error={state.errors?.lastName}
                />
                <Input
                    placeholder='Telefone'
                    name="phone"
                    title='Telefone'
                    type='phone'
                    error={state.errors?.phone}
                />
                <Input
                    placeholder='Confirmação de senha'
                    name="passwordConfirmation"
                    title='Confirmação de senha'
                    type='password'
                    error={state.errors?.passwordConfirmation}
                />
                <Input
                    placeholder='username'
                    name="username"
                    title='username'
                    type='text'
                    error={state.errors?.username}
                />
                <button type='submit' >
                    Login
                </button>
            </form>
        </main>
    )
}