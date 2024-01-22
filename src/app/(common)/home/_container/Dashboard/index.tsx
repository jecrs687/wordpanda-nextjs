
"use client";
import { ROUTES } from '@constants/ROUTES';
import Linker from '@core/Linker';
import { Lottie } from '@core/Lotties';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './dashboard.module.scss';
const contents = [
  ["Welcome to the Language Boost App!",
    "This app helps you learn languages using movie subtitles."],
  ["This app is free to use.",
    "You can support the app by donating."],
  ["Choose a movie, and then choose a language to learn.",
    "You will be able to watch the movie with subtitles in your target language.",
    "You can also play games to help you learn the language."],
]
const DashboardComponent = () => {

  const [scroll, setScroll] = useState(0)
  const [step, setStep] = useState(0)
  const scrollRef = useRef(null)
  useEffect(() => {
    const scrollReference = scrollRef.current
    const handleScroll = () => {
      const scroll = scrollRef.current?.scrollTop || 0
      console.log(scroll)
      setScroll(scroll)
    }
    scrollReference?.addEventListener('scroll', handleScroll)
    return () => {
      scrollReference?.removeEventListener('scroll', handleScroll)
    }
  }, [scrollRef])


  const screenSize = window.screen.height
  const screenStep = screenSize / 3

  const scrollSizeHeight = screenSize + (screenStep * contents.length)

  useEffect(() => {
    const currentStep = Math.floor(scroll / screenStep) % contents.length
    if (step !== currentStep) {
      setStep(currentStep)
    }
  }, [scroll, screenSize, screenStep, step])

  const Step = useMemo(() => {
    const content = contents[step]

    const First = () => <div className={styles.content}>
      <h1 className={styles.title}>
        {content[0]}
      </h1>
      <p className={styles.description}>
        {content[1]}
      </p>
    </div>
    return [First][0]
  }, [step])
  return (
    <main className={styles.container}>

      <header className={styles.header} >
        <div className={styles.scroll} ref={scrollRef}>
          <div className={styles.scroll__content}
            style={{
              height: scrollSizeHeight
            }}
          >
          </div>
        </div>
        <div className={styles.header__content} >
          <Lottie
            options={{
              animationData: require('@assets/lotties/rocket.json'),
              autoplay: true,
              loop: true,
            }}
            height={500}
            width={500}
          />
          <div className={styles.contents}>
            <Step />
          </div>

          <Lottie
            options={{
              animationData: require('@assets/lotties/scroll.json'),
              autoplay: true,
              loop: true,
            }}
            height={500}
            width={500}
          />

        </div>
      </header>
      <main className={styles.main}>
        <section className={styles.section}>
          <section className={styles.about}>
            <h2 className={styles.about__title}>
              How it works? </h2>
            <p className={styles.about__description}>
              Choose a movie, and then choose a language to learn. You will be able to watch the movie with subtitles in your target language. You can also play games to help you learn the language.</p>
            <p className={styles.about__description}>
              You can track your progress and see how much you have learned.
            </p>
            <p className={styles.about__description}>
              You can use this app with Netflix, Amazon Prime Video, and Youtube.
            </p>
            <p className={styles.about__description}>
              This app is free to use. You can support the app by donating.
            </p>
          </section>
          <section className={styles.features}>
            <h2 className={styles.features__title}>
              Features</h2>
            <ul className={styles.features__list}>
              {
                [
                  'Choose a movie',
                  'Choose a language',
                  'Play games to help you learn the language',
                  'Watch the movie with subtitles in your target language',
                  'Track your progress'
                ].map((feature, index) => (
                  <li key={index} className={styles.features__list__item}>
                    {feature}
                  </li>
                ))
              }
            </ul>
          </section>
        </section>
        <section className={styles.section}>

          <section className={styles.get__started}>
            <h2>Get started</h2>
            <p>Click the button below to get started.</p>
          </section>
          <section className={styles.platforms}>
            <h2>Platforms</h2>
            <ul className={styles.platforms__list}>
              {
                [
                  'Netflix',
                  'Amazon',
                  'Youtube'
                ].map((platform, index) => (
                  <li key={index} className={styles.platforms__list__item}>
                    {platform}
                  </li>
                ))
              }
            </ul>
          </section>
        </section>
      </main>
      <div className={styles.footer}>
        <div className={styles.buttons}>
          <Linker
            href={ROUTES.LOGIN()}
          >Get Started</Linker>
          <Linker
            href={ROUTES.REGISTER()}
          >Sign In</Linker>
        </div>
      </div>
    </main >
  )
}

export const Dashboard = dynamic(() => Promise.resolve(DashboardComponent), { ssr: false })