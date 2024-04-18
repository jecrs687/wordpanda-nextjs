"use client";
import Input from '@common/Input';
import { SelectLanguage } from '@common/SelectLanguage';
import { ShowIf } from '@common/ShowIf/ShowIf';
import { TOKEN_KEY } from '@constants/CONFIGS';
import { ROUTES } from '@constants/ROUTES';
import Button from '@core/Button';
import LoaderSpinner from '@core/LoaderSpinner';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Loading from 'src/app/loading';
import { submit } from './action';
import styles from './index.module.scss';
function Submit() {
    const status = useFormStatus();
    return <Button disabled={status.pending} type='submit'>
        {
            status.pending ? <LoaderSpinner size='20px' /> : 'Cadastrar'
        }
    </Button>
}

export default function Register() {
    const [state, formAction] = useFormState(submit, {})
    const route = useRouter()
    const [steps, setSteps] = useState(1)
    const [values, setValues] = useState({})

    useEffect(() => {
        if (state.token) {
            localStorage.setItem(TOKEN_KEY, state.token)
            route.push(ROUTES.DASHBOARD())
        }
        if (state.errors) {
            const steps = {
                1: ['email', 'password', 'passwordConfirmation'],
                2: ['firstName', 'lastName'],
                3: ['phone', 'username', 'language']
            }
            for (const key in steps) {
                if (steps[key].some(key => state.errors[key])) {
                    setSteps(Number(key))
                    break;
                }
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <Image
                        src={"/assets/logo.png"}
                        width={40}
                        height={40}
                        alt='logo'
                        className={styles.image}
                    />
                    <h1 className={styles.title}>Wordpanda</h1>
                </div>
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
                        <Button
                            onClick={() => setSteps(steps - 1)}

                            type='button'
                        >
                            Anterior
                        </Button>
                    </ShowIf>
                    <ShowIf condition={steps > 2} onlyHide>
                        <Submit />
                    </ShowIf>
                    <ShowIf condition={steps < 3} onlyHide>
                        <Button
                            onClick={() => setSteps(steps + 1)}

                            type='button'
                        >
                            Próximo
                        </Button>
                    </ShowIf>
                </div>
                <ShowIf condition={steps > 1} onlyHide>
                    <div className={styles.progress}>
                        <div className={styles.progress__bar}
                            style={{
                                width: `${(steps - 1) * 33.33}%`
                            }}
                        />
                    </div>
                </ShowIf>

                <Link href={ROUTES.LOGIN()}
                    className={styles.link}>
                    Tem uma conta? Faça login
                </Link>
            </form>

        </main>
    )
}
