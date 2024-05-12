"use client";
import { ShowIf } from '@common/ShowIf/ShowIf';
import { ROUTES } from '@constants/ROUTES';
import Button from '@core/Button';
import { Lottie } from '@core/Lotties';
import useWindowSize from '@hooks/useWindowSize';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
export default function Page() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const {
    isMobile, windowWidth, windowHeight
  } = useWindowSize();
  useEffect(() => {
    if (step === 1)
      setTimeout(() => setStep(step + 1), 2000)
  }, [step])
  const lottiesOptions = (size = 1) => ({
    height: !isMobile ? 1000 : windowHeight / (size * 3),
    width: !isMobile ? 1000 : windowWidth / (size * 2),
    containerProps: {
      style: {
        width: !isMobile ? '600px' : `${windowWidth / size}px`,
        height: !isMobile ? '600px' : `${windowHeight / (size * 3.2)}px`,
        overflow: 'hidden',
        marginTop: 'auto'
      }
    },
    style: {
      width: !isMobile ? '600px' : `${windowWidth / size}px`,
      height: !isMobile ? '600px' : `${windowHeight / (size * 3.2)}px`,
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
      <header className={styles.header}>
        <Image
          className={styles.logo}
          src="/assets/logo.png" alt="panda" width={100} height={100} />
        <h1 className={styles.title}>
          WorldPanda
        </h1>
      </header>
      <ShowIf condition={step === 0} onlyHide>
        <div className={clsx(
          styles.container, step === 0 ? styles.active : styles.inactive
        )}>
          <Lottie
            options={{
              animationData: require('@assets/lotties/eating-panda.json'),
              autoplay: true,
              loop: true,
            }}
            {...lottiesOptions()}
          />
          <h3
            className={styles.subtitle}

          >Seja bem-vindo ao worldpanda!</h3>
          <Button
            onClick={() => setStep(2)}
            className={styles.button}
          >
            Comece sua jornada aqui <br />
            (sim eu sou um botão de verdade...)
          </Button>

          <Button
            variety='secondary'
            onClick={() => setStep(1)}
            className={styles.button}
            style={{ borderRadius: 10, zoom: 0.6, marginBottom: '20px' }}
          >
            Caso goste de pandas e queira ver um panda comendo clique aqui
          </Button>
        </div>
      </ShowIf>

      <ShowIf condition={step === 1} onlyHide>
        <div className={clsx(
          styles.container, step === 1 ? styles.active : styles.inactive
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
          styles.container, step === 2 ? styles.active : styles.inactive
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
            onClick={() => setStep(3)}
          >
            Clique aqui para começar
          </Button>
        </div>
      </ShowIf>
      <ShowIf condition={step === 3} onlyHide>
        <div className={clsx(
          styles.container, step === 3 ? styles.active : styles.inactive
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
            onClick={() => setStep(4)}
          >
            Clique aqui para começar!
          </Button>
        </div>
      </ShowIf>
      <ShowIf condition={step === 4} onlyHide>
        <div className={clsx(
          styles.container, step === 4 ? styles.active : styles.inactive
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
            onClick={() => setStep(5)}
          >
            Clique aqui para começar!
          </Button>
        </div>
      </ShowIf>
      <ShowIf condition={step === 5} onlyHide>
        <div className={clsx(
          styles.container, step === 5 ? styles.active : styles.inactive
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
            Sei que nem todo mundo gosta, mas o panda precisa saber quem é você
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
