import { PostBookmarkLinkRequest } from '@/interfaces/bookmark_link';
import client from '@/lib/api/client';
import Cookies from 'js-cookie';

export const postTheme = (data: PostBookmarkLinkRequest) => {
  const headers = {
    'access-token': Cookies.get('_access_token'),
    client: Cookies.get('_client'),
    uid: Cookies.get('_uid'),
  };
  return client.post('themes', { theme: data }, { headers });
};
