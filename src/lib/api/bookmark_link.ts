import { AuthData } from '@/interfaces/auth';
import { PostBookmarkLinkRequest } from '@/interfaces/bookmark_link';
import client from '@/lib/api/client';

export const getBookmarkLinks = (authData: AuthData) => {
  const headers = {
    'access-token': authData.accessToken,
    client: authData.client,
    uid: authData.uid,
  };
  return client.get('/bookmark_links', { headers });
};

export const postBookmarkLink = (
  authData: AuthData,
  data: PostBookmarkLinkRequest
) => {
  const headers = {
    'access-token': authData.accessToken,
    client: authData.client,
    uid: authData.uid,
  };
  return client.post('/bookmark_links', { bookmark_link: data }, { headers });
};
