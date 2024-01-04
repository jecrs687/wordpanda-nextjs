import { Lottie } from "@core/Lotties";
import styles from './page.module.scss';
export default async function Page() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>

                <Lottie
                    autoplay
                    loop
                    mode="normal"
                    src="/assets/lotties/rocket.json"
                    style={{
                        height: 400,
                        width: 400
                    }}
                />
                <div className={styles.content}>
                    <h1 className={styles.title}>
                        Welcome to the Language Boost App!
                    </h1>
                    <p className={styles.description}>
                        This app helps you learn languages using movie subtitles.
                    </p>
                </div>
            </header>
            <main className={styles.main}>
                <section className={styles.about}>
                    <h2 className={styles.about__title}>
                        How it works? </h2>
                    <p className={styles.about__description}>
                        Choose a movie, and then choose a language to learn. You will be able to watch the movie with subtitles in your target language. You can also play games to help you learn the language.</p>
                </section>
                <section className={styles.get__started}>
                    <h2>Get started</h2>
                    <p>Click the button below to get started.</p>
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
                <div className={styles.footer}>
                    <div className={styles.buttons}>
                        <button>Get Started</button>
                        <button>Sign In</button>
                    </div>
                </div>
            </main>

        </div>
    );
}
