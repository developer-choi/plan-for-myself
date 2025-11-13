import {fetchFromClient} from '@/utils/extend/library/fetch/fromClient';
import {Topic} from '@/types/topic';

export type PostTopicApiRequest = Omit<Topic, 'id'>

export async function postTopicApi({content, category}: PostTopicApiRequest): Promise<void> {
  await fetchFromClient('/api/topic', {
    method: 'POST',
    authPolicy: 'private',
    body: {content, category},
  });
}

export async function deleteTopicApi(id: number): Promise<void> {
  await fetchFromClient(`/api/topic/${id}`, {
    method: 'DELETE',
    authPolicy: 'private',
  });
}
