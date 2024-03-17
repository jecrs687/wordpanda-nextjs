import { getLanguage } from '@backend/domain/actions/Languages/getLanguage.action';
import GamesPage from '../../games/_container/GamesPage/page';
const langs = {};
export default async function Page(
    {
        params: { id }
    }
) {
    if (!langs[id]) {
        langs[id] = await getLanguage({ id })
    }
    const language = langs[id];
    return (<>
        <GamesPage language={language} />
    </>
    )
}
