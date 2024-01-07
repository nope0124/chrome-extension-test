import { AuthData } from '@/interfaces/auth';
import client from '@/lib/api/client';

export const getBookmark = (authData: AuthData) => {
  const headers = {
    'access-token': authData.accessToken,
    client: authData.client,
    uid: authData.uid,
  };
  return client.get('/bookmarks', { headers });
};
