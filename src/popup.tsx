import Cookies from 'js-cookie';
import React, { createContext, useContext, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { makeStyles } from '@mui/styles';

import { SignInData } from '@/interfaces/index';
import { User } from '@/interfaces/user';
import { signIn } from '@/lib/api/auth';

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

const AuthContext = createContext(
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
        // 成功した場合はCookieに各値を格納
        Cookies.set('_access_token', res.headers['access-token']);
        Cookies.set('_client', res.headers['client']);
        Cookies.set('_uid', res.headers['uid']);
        console.log(Cookies.set('_uid', res.headers['uid']));

        setIsSignedIn(true);
        setCurrentUser(res.data.data);
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
          <>
            <h2>メールアドレス: {currentUser?.email}</h2>
            <h2>名前: {currentUser?.name}</h2>
          </>
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

  return (
    <>
      {isSignedIn && currentUser ? (
        <>
          <h2>メールアドレス: {currentUser?.email}</h2>
          <h2>名前: {currentUser?.name}</h2>
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
