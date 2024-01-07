import React, { createContext, useContext, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { makeStyles } from '@mui/styles';

import { SignInData } from '@/interfaces/index';
import { User } from '@/interfaces/user';
import { getCurrentUser, signIn } from '@/lib/api/auth';

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// MUIのカスタムテーマを作成
const theme = createTheme({
  // ここにカスタムテーマ設定を追加
});

const useStyles = makeStyles(() => ({
  submitBtn: {
    textAlign: 'right',
    flexGrow: 1,
    textTransform: 'none',
  },
  header: {
    textAlign: 'center',
  },
  card: {
    maxWidth: 400,
  },
  box: {
    paddingTop: '2rem',
  },
  link: {
    textDecoration: 'none',
  },
}));

export const AuthContext = createContext(
  {} as {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isSignedIn: boolean;
    setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
    currentUser: User | undefined;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  }
);

// サインイン用ページ
const Popup = () => {
  const classes = useStyles();

  const { isSignedIn, setIsSignedIn, currentUser, setCurrentUser } =
    useContext(AuthContext);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // ログイン成功時にトークンを保存
  const saveAuthData = (authData: any) => {
    chrome.storage.local.set(authData, function () {
      console.log('Auth data is saved in Chrome storage');
    });
  };

  // アプリケーション起動時にトークンをチェック
  const checkToken = () => {
    chrome.storage.local.get(
      ['access-token', 'client', 'uid'],
      function (result) {
        if (result['access-token'] && result['client'] && result['uid']) {
          autoLogin(result['access-token'], result['client'], result['uid']);
        }
      }
    );
  };

  // 自動ログイン処理
  const autoLogin = async (
    accessToken: string,
    client: string,
    uid: string
  ) => {
    const res = await getCurrentUser(accessToken, client, uid);
    console.log(res);
    console.log('autoLoginCheck');
    setCurrentUser(res?.data.currentUser);
    setIsSignedIn(true);
  };

  useEffect(() => {
    checkToken();
  }, []);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const data: SignInData = {
      email: email,
      password: password,
    };

    try {
      const res = await signIn(data);
      console.log(res);

      if (res.status === 200) {
        saveAuthData({
          'access-token': res.headers['access-token'],
          client: res.headers['client'],
          uid: res.headers['uid'],
        });

        setIsSignedIn(true);
        setCurrentUser(res.data.data);
        console.log(res.data.data);
        console.log('Signed in successfully!');
      }
    } catch (err) {
      console.log(err);
    }
  };

  console.log(currentUser);

  return (
    <>
      <Box sx={{ width: 540 }}>
        {isSignedIn && currentUser ? (
          <Home />
        ) : (
          <form noValidate autoComplete="off">
            <Card className={classes.card}>
              <CardHeader className={classes.header} title="サインイン" />
              <CardContent>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="メールアドレス"
                  value={email}
                  margin="dense"
                  onChange={(event) => setEmail(event.target.value)}
                />
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="パスワード"
                  type="password"
                  placeholder="6文字以上"
                  value={password}
                  margin="dense"
                  autoComplete="current-password"
                  onChange={(event) => setPassword(event.target.value)}
                />
                <Box className={classes.submitBtn}>
                  <Button
                    type="submit"
                    variant="outlined"
                    color="primary"
                    disabled={!email || !password ? true : false}
                    onClick={handleSubmit}
                  >
                    送信
                  </Button>
                </Box>
                <Box textAlign="center" className={classes.box}>
                  <Typography variant="body2">
                    まだアカウントをお持ちでない方はから作成してください。
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </form>
        )}
      </Box>
    </>
  );
};

const Home: React.FC = () => {
  const { isSignedIn, currentUser } = useContext(AuthContext);

  const [currentUrl, setCurrentUrl] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');

  useEffect(() => {
    // 現在のタブの情報を取得する関数
    const getCurrentTabInfo = async () => {
      // 権限の問題で`chrome.tabs.query`を使用する
      const queryOptions = { active: true, currentWindow: true };
      const [tab] = await chrome.tabs.query(queryOptions);
      if (tab) {
        setCurrentUrl(tab.url || '');
        setCurrentTitle(tab.title || '');
        setFaviconUrl(tab.favIconUrl || '');
      }
    };

    getCurrentTabInfo();
  }, []);

  return (
    <>
      {isSignedIn && currentUser ? (
        <>
          <h2>メールアドレス: {currentUser?.email}</h2>
          <h2>名前: {currentUser?.name}</h2>
          <p>現在のURL: {currentUrl}</p>
          <p>現在のタイトル: {currentTitle}</p>
          <p>
            現在のFavicon: <img src={faviconUrl} alt="Favicon" />
          </p>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

const App = () => {
  // 状態変数を定義
  const [loading, setLoading] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);

  return (
    <React.StrictMode>
      <AuthContext.Provider
        value={{
          loading,
          setLoading,
          isSignedIn,
          setIsSignedIn,
          currentUser,
          setCurrentUser,
        }}
      >
        <ThemeProvider theme={theme}>
          <Popup />
        </ThemeProvider>
      </AuthContext.Provider>
    </React.StrictMode>
  );
};

const container = document.getElementById('root');
if (!container) throw new Error('container not found');
const root = createRoot(container);
root.render(<App />);
