import { getUser } from '@actions/User/getUser.action';
import { getPlatforms } from '@backend/domain/actions/Platform/getPlatform.action';
import Dashboard from './_container/Dashboard';

export const dynamic = 'force-dynamic';
export default async function Page() {
    const [{ user }, { platforms }] = await Promise.all([getUser(), getPlatforms()])
    const { userLanguages: languages, mediaUser: medias } = user

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-zinc-100 to-sky-50 dark:from-black dark:via-gray-950 dark:to-blue-950/30">
            <div className="container mx-auto px-4 py-8">
                <Dashboard languages={languages} medias={medias} platforms={platforms} />
            </div>
        </div>
    )
}
