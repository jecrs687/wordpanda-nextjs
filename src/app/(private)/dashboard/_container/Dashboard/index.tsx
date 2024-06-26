"use client";
import { getUser } from '@actions/User/getUser.action';
import { getPlatforms } from '@backend/domain/actions/Platform/getPlatform.action';
import CardMovieBig from '@common/Cards/CardMovieBig';
import CardMovieSmall from '@common/Cards/CardMovieSmall';
import LanguageCard from '@common/Cards/LanguageCard';
import Input from '@common/Input';
import { ShowIf } from '@common/ShowIf/ShowIf';
import TextSearch from '@common/TextSearch';
import Button from '@core/Button';
import useSearch from '@hooks/useSearch';
import { deepcopy } from '@utils/deepcopy';
import { insertMissingMovies } from './action';
import styles from './page.module.scss';

type Platform = Awaited<ReturnType<typeof getPlatforms>>['platforms']
const Dashboard = ({
    languages,
    medias,
    platforms: plat,
}: {
    languages: Awaited<ReturnType<typeof getUser>>['user']['userLanguages'],
    medias: Awaited<ReturnType<typeof getUser>>['user']['mediaUser'],
    platforms: Platform,
}) => {
    const { search, setSearch } = useSearch();
    const userLanguages = languages.filter(({ language }) => language.language.toLowerCase().includes(search.toLowerCase()))
    const mediaUser = medias.filter(({ mediaLanguage }) => mediaLanguage.media.name.toLowerCase().includes(search.toLowerCase()))
    const platforms = plat.map((platform) => {
        const medias = platform?.medias?.filter(({ name }) => name.toLowerCase().includes(search.toLowerCase()))
        return { ...platform, medias }
    }).filter(({ medias }) => medias.length)
    const mostViewed = deepcopy<typeof platforms>(platforms)?.[0]?.medias?.sort((a, b) => b.mediaLanguages.reduce((a, c) => a + c._count.mediaUsers, 0) - a.mediaLanguages.reduce((a, c) => a + c._count.mediaUsers, 0)).slice(0, 25) || []
    const recentAdded = deepcopy<typeof platforms>(platforms)?.[0]?.medias?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 25) || [];
    const notFound = !mostViewed.length && !recentAdded.length
    return (
        <main className={styles.main}>

            <div className={styles.header}>
                <div className={styles.search}>
                    <TextSearch
                        name=''
                        title=''
                        placeholder='Encontre seu filme, lingua ou série'
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <div className={styles.container}>
                <ShowIf condition={notFound}>

                    <form className={styles.form}
                        onSubmit={(event) => {
                            insertMissingMovies(new FormData(event.currentTarget))
                        }}>
                        <h2>
                            Não encontramos nada com o termo pesquisado
                        </h2>
                        <h4>
                            Quer adicionar a nossa base de dados?
                            <br />
                            Basta clicar no botão abaixo e adicionar o filme ou série que deseja:
                        </h4>
                        <Input name='name' title='Nome' placeholder='Se beber não case' />
                        <Input name='provider' title='Provedor' placeholder='Netflix, prime' />
                        <Button type='submit'>Adicionar</Button>

                        <p>
                            Apos adicionar, aguarde a aprovação da nossa equipe para que o conteúdo seja disponibilizado
                        </p>
                    </form>

                </ShowIf>

                <div className={styles.card}>
                    <ShowIf condition={!!userLanguages.length}>
                        <div className={styles.carrossel}>
                            <h4>Aprendendo</h4>
                            <div className={styles.contents}>
                                {
                                    userLanguages.map((language, index) => {
                                        return (
                                            <LanguageCard
                                                key={index}
                                                language={language.language.language}
                                                code={language.language.code}
                                                id={language.language.id}
                                                wordsNumber={language._count.userWords}
                                                totalWordsNumber={language.language._count.words}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </ShowIf>
                    <div className={styles.media}>
                        <ShowIf condition={!!mediaUser.length}>
                            <div className={styles.carrossel}>
                                <h4>Assistidos</h4>
                                <div className={styles.contents}>
                                    {mediaUser.map((content, index) => {
                                        return (

                                            <CardMovieSmall
                                                code={content.mediaLanguage.language.code}
                                                id={content.mediaLanguage.media.id}
                                                language={content.mediaLanguage.language.language}
                                                logoUrl={content.mediaLanguage.media.logoUrl}
                                                name={content.mediaLanguage.media.name}
                                                platform={content.mediaLanguage.media.platform.name}
                                                key={index}
                                            />
                                        )
                                    })}
                                </div>

                            </div>
                        </ShowIf>

                        <ShowIf condition={!!platforms.length}>
                            {
                                platforms.map(
                                    (platform, id) =>
                                        <ShowIf key={id} condition={!!platform.medias.length}>
                                            <div className={styles.carrossel}>
                                                <h4>{platform.name}</h4>
                                                <div className={styles.contents}>
                                                    {platform.medias.map((content, index) =>
                                                        <CardMovieSmall
                                                            languages={content.mediaLanguages.map((x) => x.language.language).join(', ')}
                                                            id={content.id}
                                                            logoUrl={content.logoUrl}
                                                            name={content.name}
                                                            platform={platform.name}
                                                            key={index}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </ShowIf>

                                )
                            }
                        </ShowIf>
                        <ShowIf condition={!!mostViewed.length}>
                            <div className={styles.carrossel}>
                                <h4>Mais vistos</h4>
                                <div className={styles.contents}>
                                    {mostViewed.map((content, index) =>
                                        <CardMovieBig
                                            id={content.id}
                                            logoUrl={content.logoUrl}
                                            name={content.name}
                                            languages={content.mediaLanguages.map((x) => x.language.language).join(', ')}
                                            index={index}
                                            key={index}
                                        />
                                    )}
                                </div>
                            </div>
                        </ShowIf>
                        <ShowIf condition={!!platforms.length}>
                            <div className={styles.carrossel}>
                                <h4>Adicionados recentemente</h4>
                                <div className={styles.contents}>
                                    {
                                        recentAdded.map(
                                            (recent, id) =>
                                                <CardMovieSmall
                                                    languages={recent.mediaLanguages.map((x) => x.language.language).join(', ')}
                                                    id={recent.id}
                                                    logoUrl={recent.logoUrl}
                                                    name={recent.name}
                                                    platform={recent.platformId}
                                                    key={id}
                                                />

                                        )
                                    }
                                </div>
                            </div>
                        </ShowIf>
                    </div>
                </div>

            </div>

        </main>
    )
}

export default Dashboard;