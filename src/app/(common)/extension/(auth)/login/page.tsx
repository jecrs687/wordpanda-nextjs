import { ROUTES } from '@constants/ROUTES';
import LoginPage from './_container/Login';
export default async function Page() {
    return (
        <LoginPage nextPage={ROUTES.EXTENSION_LANGUAGES()} />
    )
}
