import client from '@/lib/api/client';
import Cookies from 'js-cookie';

import { AuthData } from '@/interfaces/auth';
import { SignInData, SignUpData } from '@/interfaces/index';

// サインアップ（新規アカウント作成）
export const signUp = (data: SignUpData) => {
  return client.post('auth', data);
};

// サインイン（ログイン）
export const signIn = (data: SignInData) => {
  return client.post('auth/sign_in', data);
};

// サインアウト（ログアウト）
export const signOut = () => {
  return client.delete('auth/sign_out', {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
};

// 認証済みのユーザーを取得
export const getCurrentUser = (authData: AuthData) => {
  return client.get('/auth/sessions', {
    headers: {
      'access-token': authData.accessToken,
      client: authData.client,
      uid: authData.uid,
    },
  });
};
