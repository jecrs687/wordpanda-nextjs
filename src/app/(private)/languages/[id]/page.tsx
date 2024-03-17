import { getLanguage } from '@backend/domain/actions/Languages/getLanguage.action';
import BackButton from '@common/BackButton';
import GamesPage from '../../games/_container/GamesPage/page';

export default async function Page(
    {
        params: { id }
    }
) {
    const language = await getLanguage({ id })
    return (<>

        <BackButton >
            Games
        </BackButton>
        <GamesPage language={language} />
    </>
    )
}
