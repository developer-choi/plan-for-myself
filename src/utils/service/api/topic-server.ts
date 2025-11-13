import 'server-only';
import {Topic} from '@/types/topic';
import {fetchFromServer} from '@/utils/extend/library/fetch/fromServer';

export async function getTopicsApi(): Promise<Topic[]> {
  const {data} = await fetchFromServer<Topic[]>('/api/topic', {
    method: 'GET',
    authPolicy: 'private',
    next: {
      tags: ['TOPIC_LIST'],
    },
  });
  return data;
}
