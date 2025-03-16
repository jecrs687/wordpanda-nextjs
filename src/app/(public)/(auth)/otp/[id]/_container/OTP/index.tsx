"use client";
import OtpInput from '@common/OTP';
import { ShowIf } from '@common/ShowIf/ShowIf';
import { TOKEN_KEY } from '@constants/CONFIGS';
import { ROUTES } from '@constants/ROUTES';
import Button from '@core/Button';
import LoaderSpinner from '@core/LoaderSpinner';
import { setCookie } from '@utils/cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Loading from 'src/app/loading';
import { submit } from './action';
import styles from './index.module.scss';
import { resendOtp } from './resend';
function Submit({ status }) {
    return <Button disabled={status.pending} type='submit'>
        {
            status.pending ? <LoaderSpinner size='20px' /> : 'Confirmar'
        }
    </Button>
}

export default function OtpConfirmation({ id }) {
    const [state, formAction] = useActionState(submit, {})
    const status = useFormStatus();
    const [time, setTime] = useState(0)
    const route = useRouter()
    const [values, setValues] = useState<{ id: string, otp?: string }>({ id })
    const ref = useRef(null)
    const regress = () => {
        setTime(60)
        const inverval = setInterval(() => setTime(x => x - 1), 1000);
        setTimeout(() => {
            clearInterval(inverval)
            setTime(0)
        }, 60000)
    }
    useEffect(() => {
        if (state.token) {
            localStorage.setItem(TOKEN_KEY, state.token)
            setCookie(TOKEN_KEY, state.token)
            route.push(ROUTES.DASHBOARD())

        }

    }, [state, route])

    useEffect(() => {
        if (values?.otp?.length === 4) {
            const form = new FormData()
            form.set('otp', values.otp)
            form.set('id', values.id)
            formAction(form)
        }
    }, [formAction, values])

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
            <form action={formAction} ref={ref}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <Image
                        src={"/assets/logo.png"}
                        width={200}
                        height={200}
                        alt='logo'
                        className={styles.image}
                    />
                </div>
                <h3>Verificação</h3>
                <h5>Enviamos um código de verificação para o seu email</h5>
                <div className={styles.form}>

                    <ShowIf condition={false} onlyHide>
                        <input {...inputHandle('otp')} />
                        <input {...inputHandle('id')} />

                    </ShowIf>
                    <OtpInput onOtpSubmit={(otp) => setValues(x => ({ ...x, otp }))} />
                    {state.errors?.otp && <p className={styles.error}>{state.errors?.otp}</p>}
                    <ShowIf condition={status.pending} >
                        <Loading />
                    </ShowIf>

                </div>
                <div className={styles.buttons}>
                    <Submit status={status} />
                    <Button
                        disabled={time !== 0}
                        type='button'
                        onClick={() => {
                            resendOtp({ id })
                            regress()
                        }
                        }>
                        {
                            time === 0 ? 'Reenviar código' : `Reenviar código em ${time}`
                        }
                    </Button>
                </div>


                <Link href={ROUTES.LOGIN()}
                    className={styles.link}>
                    Tem uma conta? Faça login
                </Link>
            </form>

        </main>
    )
}
