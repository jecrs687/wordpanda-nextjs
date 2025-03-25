import { getUserMetrics } from '@backend/domain/actions/Metrics/getUserMetrics.action';
import { Suspense } from 'react';
import MetricsContainer from './_components/MetricsContainer';
import MetricsLoading from './_components/MetricsLoading';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'WordPanda | Learning Metrics',
  description: 'Track your language learning progress with detailed metrics and insights'
};

export default async function MetricsPage() {
  const metricsData = await getUserMetrics();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 dark:from-gray-950 dark:to-gray-900">
      <Suspense fallback={<MetricsLoading />}>
        <MetricsContainer data={metricsData} />
      </Suspense>
    </div>
  );
}
