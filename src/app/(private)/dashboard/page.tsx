import { getUser } from '@actions/User/getUser.action';
import { getPlatforms } from '@backend/domain/actions/Platform/getPlatform.action';
import { sendEmail } from '@infra/mail';
import Dashboard from './_container/Dashboard';

export const dynamic = 'force-dynamic';
export default async function Page() {
    const [{ user }, { platforms }] = await Promise.all([getUser(), getPlatforms()])
    const { userLanguages: languages, mediaUser: medias } = user
    sendEmail('WELCOME_MAIL', user)
    return (
        <Dashboard languages={languages} medias={medias} platforms={platforms} />
    )
}
