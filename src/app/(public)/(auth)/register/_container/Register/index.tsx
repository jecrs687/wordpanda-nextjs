"use client";
import Input from '@common/Input';
import { SelectLanguage } from '@common/SelectLanguage';
import { ShowIf } from '@common/ShowIf/ShowIf';
import { ROUTES } from '@constants/ROUTES';
import Button from '@core/Button';
import LoaderSpinner from '@core/LoaderSpinner';
import { Dialog } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
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
    const [modalError, setModalError] = useState(false)
    const [alreadyNavigate, setAlreadyNavigate] = useState(1)
    const stepsErrors = useMemo(()=>[
         ['email', 'password', 'passwordConfirmation'],
         ['firstName', 'lastName'],
         ['phone', 'username', 'language']
    ],[])
    const errorsByStep = Object
    .entries(stepsErrors)
    .reduce((acc, [key, value]) => {
        value.forEach(v => {
            acc[v] = +key
        })
        return acc;
    }, {})
    useEffect(() => {
        if (state.success) {
            route.push(ROUTES.OTP(state.user.id))
        }
        if(state.error){
            setModalError(true)
        }
        if (state.errors) {
            for (const key in stepsErrors) {
                if (stepsErrors[key].some(key => state.errors[key])) {
                    setSteps(Number(key)+1)
                    break;
                }
            }
        }
    }, [state, route, stepsErrors])
    
    const inputHandle = (name) => {
        const findError = errorsByStep[name]
        return {
            error: findError < alreadyNavigate ? state.errors?.[name]: '',
            name,
            value: values[name],
            onChange: (e) => setValues({ ...values, [name]: e.target.value })
        }
    }
    return (
        <main className={styles.main}>
            <Dialog open={state.error} onClose={()=>{setModalError(false)}}>
                <div>
                    {state.error}
                </div>
            </Dialog>
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
                        <div style={{zIndex:12412}}>
                        <SelectLanguage 
                        name='languageId'
                        title='Idioma'
                        error={state.errors?.languageId}
                        dropdownPosition='top'
                         />
                        </div>
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
                            onClick={() => {
                                setSteps(steps + 1)
                                if(steps !==1) setAlreadyNavigate(x=>x+1)
                            }
                            }

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
