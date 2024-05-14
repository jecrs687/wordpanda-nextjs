"use client";
import { ShowIf } from '@common/ShowIf/ShowIf';
import { TOKEN_KEY } from '@constants/CONFIGS';
import { ROUTES } from '@constants/ROUTES';
import Button from '@core/Button';
import { Lottie } from '@core/Lotties';
import useQueryParams from '@hooks/useQueryParams';
import useWindowSize from '@hooks/useWindowSize';
import { getCookie } from '@utils/cookie';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
export default function Page() {
  const [step, setStep] = useState(0);
  const [transaction, setTransaction] = useState(false);
  const router = useRouter();
  const { queryParams } = useQueryParams();
  const {
    isMobile, windowWidth, windowHeight
  } = useWindowSize();
  useEffect(() => {
    const token = getCookie(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    if (token)
      router.push(ROUTES.DASHBOARD());

  }, [router])
  useEffect(() => {
    if (step === 1)
      setTimeout(() => setStep(step + 1), 5000)
  }, [step])

  const changeStep = (step: number) => {
    setTransaction(true);
    setTimeout(() => {
      setStep(step);
      setTransaction(false);
    }, 500)
  }
  const first = step !== 0
  const lottiesOptions = (size = 1) => ({
    height: first && !isMobile ? 1000 : windowHeight / (size * 3),
    width: first && !isMobile ? 1000 : windowWidth / (size * 2),
    containerProps: {
      className: styles.lottie,
      style: {
        width: first && !isMobile ? '550px' : `${windowWidth / size}px`,
        height: first && !isMobile ? '550px' : `${windowHeight / (size * 3.2)}px`,
        overflow: 'hidden',
        marginTop: 'auto',
        marginBottom: 'auto',
      }
    },
    style: {
      width: first && !isMobile ? '550px' : `${windowWidth / size}px`,
      height: first && !isMobile ? '550px' : `${windowHeight / (size * 3.2)}px`,
      marginBottom: 'auto',
    }
  })

  return (
    <main className={styles.main}

      style={
        {
          color: 'black',
          background: step % 2 === 0 ?
            'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.5) 100%)'
            : 'linear-gradient(90deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,1) 100%)'
        }
      }>
      <header className={styles.header}
        style={{
          marginTop: `${(+queryParams?.statusBarHeight || 0) * 2}px`
        }}
      >
        <Image
          className={styles.logo}
          src="/assets/logo.png" alt="panda" width={100} height={100} />
        <h1 className={styles.title}>
          WorldPanda
        </h1>
      </header>
      <ShowIf condition={step === 0} onlyHide>
        <div className={clsx(
          styles.container,
          styles.first,
          {
            [styles.fadeIn]: step === 0,
            [styles.fadeOut]: step === 0 && transaction
          }
        )}>
          <div className={styles.first_lottie}>

            <Lottie
              options={{
                animationData: require('@assets/lotties/eating-panda.json'),
                autoplay: true,
                loop: true,
              }}
              {...lottiesOptions()}
            />
          </div>

          <h1
            className={styles.title}

          >Seja bem-vindo ao worldpanda!</h1>
          <Button
            onClick={() => changeStep(2)}
            className={styles.button}
          >
            Comece sua jornada aqui <br />
            (sim eu sou um botão de verdade...)
          </Button>

          <Button
            variety='secondary'
            onClick={() => changeStep(1)}
            className={styles.button}
            style={{ borderRadius: 10, zoom: 0.6, marginBottom: '20px' }}
          >
            Caso goste de pandas e queira ver um panda comendo clique aqui
          </Button>
        </div>
      </ShowIf>

      <ShowIf condition={step === 1} onlyHide>
        <div className={clsx(
          styles.container, {
          [styles.fadeIn]: step === 1,
          [styles.fadeOut]: step === 1 && transaction
        }
        )}>
          <h3
            className={styles.subtitle}

          >Já se deparou com um panda comendo?</h3>
          <h4
            className={styles.text}

          >
            Acredite, é uma das coisas mais fofas que você verá na vida...
          </h4>
          <Image
            alt='panda eating'
            src="/assets/gifs/panda-eating.gif"
            width={200}
            height={250}
          />
          <h3
            className={styles.subtitle}
          >
            E é por isso que estamos aqui, para te mostrar o melhor dos pandas!
          </h3>
        </div>
      </ShowIf>
      <ShowIf condition={step === 2} onlyHide>
        <div className={clsx(
          styles.container, {
          [styles.fadeIn]: step === 2,
          [styles.fadeOut]: step === 2 && transaction
        }
        )}>
          <Lottie
            options={{
              animationData: require('@assets/lotties/screens.json'),
              autoplay: true,
              loop: true,
            }}
            {...lottiesOptions()}
          />
          <h3
            className={styles.subtitle}
          >
            Você está tentando aprender uma nova lingua com filmes?
          </h3>
          <h4 className={styles.text}>
            Nós podemos te ajudar com isso! 🐼
          </h4>
          <Button
            className={styles.button}
            onClick={() => changeStep(3)}
          >
            Clique aqui para começar
          </Button>
        </div>
      </ShowIf>
      <ShowIf condition={step === 3} onlyHide>
        <div className={clsx(
          styles.container, {
          [styles.fadeIn]: step === 3,
          [styles.fadeOut]: step === 3 && transaction
        }
        )}>
          <Lottie
            options={{
              animationData: require('@assets/lotties/panda-select.json'),
              autoplay: true,
              loop: true,
            }}
            {...lottiesOptions(1.8)}
          />
          <h3
            className={styles.subtitle}
          >
            Aprenda uma nova lingua com os melhores filmes!
          </h3>
          <h4
            className={styles.text}
          >
            Selecione um filme e treine sua lingua estrangeira com as legendas dele <br />
            E o melhor de tudo, é <span style={{ fontSize: 20, color: 'red', fontWeight: 'bold' }}> de graça! 💰</span>
          </h4>
          <Button
            className={styles.button}
            onClick={() => changeStep(4)}
          >
            Clique aqui para começar!
          </Button>
        </div>
      </ShowIf>
      <ShowIf condition={step === 4} onlyHide>
        <div className={clsx(
          styles.container, {
          [styles.fadeIn]: step === 4,
          [styles.fadeOut]: step === 4 && transaction
        }
        )}>
          <Lottie
            options={{
              animationData: require('@assets/lotties/ai.json'),
              autoplay: true,
              loop: true,
            }}
            {...lottiesOptions(1.5)}
          />
          <h3
            className={styles.subtitle}
          >
            Aprenda novas palavras com o panda 🐼
          </h3>
          <h4
            className={styles.text}
          >
            Uma IA opera por trás do panda, ela te ajudará a aprender novas palavras.
            Ela organiza as palavras de acordo com o seu nível de conhecimento e te ajuda a memorizá-las.
          </h4>
          <Button
            className={styles.button}
            onClick={() => changeStep(5)}
          >
            Clique aqui para começar!
          </Button>
        </div>
      </ShowIf>
      <ShowIf condition={step === 5} onlyHide>
        <div className={clsx(
          styles.container, {
          [styles.fadeIn]: step === 5,
          [styles.fadeOut]: step === 5 && transaction
        }
        )}>
          <Lottie
            options={{
              animationData: require('@assets/lotties/loging.json'),
              autoplay: true,
              loop: true,
            }}
            {...lottiesOptions(1.5)}
          />
          <h3
            className={styles.subtitle}
          >
            Sabemos que nem todo mundo gosta, mas o panda precisa saber quem é você
          </h3>
          <h4
            className={styles.text}
          >
            Por favor, faça login ou crie uma conta para continuar
          </h4>
          <div
            className={styles.buttons__login}
          >
            <Button
              onClick={() => {
                router.push(ROUTES.REGISTER())
              }}
            >
              Registre-se
            </Button>
            <Button
              onClick={() => {
                router.push(ROUTES.LOGIN())
              }}
            >
              Faça login
            </Button>
          </div>
        </div>
      </ShowIf>
    </main >
  )
}
