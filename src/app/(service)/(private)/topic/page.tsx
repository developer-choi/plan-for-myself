import {getTopicsApi} from '@/utils/service/api/topic-server';
import TopicClientPage from '@/components/service/topic/TopicClientPage';

export default async function Page() {
  const topics = await getTopicsApi();
  return <TopicClientPage initialTopics={topics}/>;
}