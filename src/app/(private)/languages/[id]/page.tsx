import { getLanguage } from '@backend/domain/actions/Languages/getLanguage.action';
import GamesPage from '../../games/_container/GamesPage/page';
export default async function Page(props) {
    const params = await props.params;

    const {
        id
    } = params;

    const language = await getLanguage({ id });
    return (<GamesPage language={language} />)
}
