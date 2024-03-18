"use client";
import Input from '@common/Input';
import { SelectLanguage } from '@common/SelectLanguage';
import { ShowIf } from '@common/ShowIf/ShowIf';
import { ROUTES } from '@constants/ROUTES';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import Loading from 'src/app/loading';
import { submit } from './action';
import styles from './index.module.scss';

export default function Register() {
    const [state, formAction] = useFormState(submit, {})
    const route = useRouter()
    const [steps, setSteps] = useState(1)
    const [values, setValues] = useState({})

    useEffect(() => {
        if (state.token) {
            localStorage.setItem('wordPand_token', state.token)
            route.push(ROUTES.DASHBOARD())
        }
        if (state.errors) {
            if (['phone', 'username', 'language'].some(key => state.errors[key])) {
                setSteps(3)
            }
            if (['firstName', 'lastName'].some(key => state.errors[key])) {
                setSteps(2)
            }
            if (['email', 'password', 'passwordConfirmation'].some(key => state.errors[key])) {
                setSteps(1)
            }
        }

    }, [state, route])

    const inputHandle = (name) => {
        return {
            error: state.errors?.[name],
            name,
            value: values[name],
            onChange: (e) => setValues({ ...values, [name]: e.target.value })
        }
    }
    return (
        <main className={styles.main}>

            <form action={formAction}>
                <Image
                    src={"/assets/logo.png"}
                    width={100}
                    height={100}
                    alt='logo'
                    className={styles.image}
                />
                <h1>Wordpanda</h1>
                <div className={styles.form}>
                    <ShowIf condition={steps === 1} onlyHide>
                        <Input
                            placeholder='Email'
                            title='Email'
                            type='text'
                            {...inputHandle('email')}
                        />
                        <Input
                            placeholder='Senha'
                            title='Senha'
                            type='password'
                            {...inputHandle('password')}
                        />
                        <Input
                            placeholder='Confirmação de senha'
                            title='Confirmação de senha'
                            type='password'
                            {...inputHandle('passwordConfirmation')}
                        />
                    </ShowIf>
                    <ShowIf condition={steps === 2} onlyHide>
                        <Input
                            placeholder='Primeiro nome'
                            title='Primeiro nome'
                            type='text'
                            {...inputHandle('firstName')}
                        />
                        <Input
                            placeholder='Ultimo nome'
                            title='Ultimo nome'
                            type='text'
                            {...inputHandle('lastName')}
                        />
                    </ShowIf>
                    <ShowIf condition={steps === 3} onlyHide>
                        <Input
                            placeholder='Telefone'
                            title='Telefone'
                            type='phone'
                            {...inputHandle('phone')}
                        />

                        <Input
                            placeholder='username'
                            title='username'
                            type='text'
                            {...inputHandle('username')}
                        />
                        <SelectLanguage />
                    </ShowIf>
                    <ShowIf condition={steps === 4} >
                        <Loading />
                    </ShowIf>

                </div>
                <div className={styles.buttons}>
                    <ShowIf condition={steps > 1} onlyHide>
                        <div role='button'
                            onClick={() => setSteps(steps - 1)}
                            className={styles.back}
                        >
                            {'<'}
                        </div>
                    </ShowIf>
                    <ShowIf condition={steps > 2} onlyHide>
                        <button type=
                            'submit'

                            className={styles.button}
                        >
                            Cadastrar
                        </button>
                    </ShowIf>
                    <ShowIf condition={steps < 3} onlyHide>
                        <div role='button'
                            onClick={() => setSteps(steps + 1)}
                            className={styles.button}
                        >
                            Próximo
                        </div>
                    </ShowIf>
                </div>

                <div className={styles.progress}>
                    <div className={styles.progress__bar}
                        style={{
                            width: `${(steps - 1) * 33.33}%`
                        }}
                    />
                </div>

            </form>

            <Link href={ROUTES.LOGIN()}
                className={styles.link}>
                Tem uma conta? Faça login
            </Link>
        </main>
    )
}
