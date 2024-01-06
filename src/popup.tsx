// import { getGitHubStats, getGitHubTopLanguage, getGitHubUsername } from '@/api';
// import { Header, StatsBody, StatsForm } from '@/components';
// import { ThemeType } from '@/types/enums';
// import { Box, ChakraProvider, useColorMode } from '@chakra-ui/react';
// import React, { useEffect, useState } from 'react';
// import { createRoot } from 'react-dom/client';
// import { useForm } from 'react-hook-form';

// const Popup = () => {
//   const [username, setUsername] = useState('');
//   const [currentStats, setCurrentStats] = useState('');
//   const [currentTopLanguage, setCurrentTopLanguage] = useState('');
//   const { colorMode } = useColorMode();
//   const { register, setValue, handleSubmit, formState } = useForm<FormData>();

//   const onSubmit = handleSubmit((data) => {
//     console.log(data['username']);
//     setUsername(data['username']);
//   });

//   useEffect(() => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       const currentURL = tabs[0].url || '';
//       const name = getGitHubUsername(currentURL);
//       setUsername(name);
//       setValue('username', name);
//     });
//   }, []);

//   useEffect(() => {
//     const fetch = async (username: string) => {
//       const themeType =
//         colorMode === 'light' ? ThemeType.LIGHT : ThemeType.DARK;
//       const stats = await getGitHubStats(username, themeType);
//       const lang = await getGitHubTopLanguage(username, themeType);
//       setCurrentTopLanguage(lang.data);
//       setCurrentStats(stats.data);
//     };
//     console.log(username);
//     if (username !== '') {
//       console.log(username);
//       fetch(username);
//     }
//   }, [username, colorMode, currentStats, currentTopLanguage]);

//   return (
//     <>
//       <Box w="540px">
//         <Header />
//         <StatsBody
//           currentStats={currentStats}
//           currentTopLanguage={currentTopLanguage}
//         />
//         <StatsForm
//           onSubmit={onSubmit}
//           register={register}
//           formState={formState}
//         />
//       </Box>
//     </>
//   );
// };

// const container = document.getElementById('root');
// if (!container) throw new Error('container not found');
// const root = createRoot(container);
// root.render(
//   <React.StrictMode>
//     <ChakraProvider>
//       <Popup />
//     </ChakraProvider>
//   </React.StrictMode>
// );

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
  // const history = useNavigate();

  const { setIsSignedIn, currentUser, setCurrentUser } =
    useContext(AuthContext);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);

  const handleSubmit1 = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
        console.log(res.data.data);
        setCurrentUser(res.data.data);
        console.log(currentUser);

        // history('/home');

        console.log('Signed in successfully!');
      } else {
        setAlertMessageOpen(true);
      }
    } catch (err) {
      console.log(err);
      setAlertMessageOpen(true);
    }
  };

  return (
    <>
      <Box sx={{ width: 540 }}>
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
                  onClick={handleSubmit1}
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
      </Box>
    </>
  );

  // const [username, setUsername] = useState('');
  // const [currentStats, setCurrentStats] = useState('');
  // const [currentTopLanguage, setCurrentTopLanguage] = useState('');
  // const { colorMode } = useColorMode();
  // const { register, setValue, handleSubmit, formState } = useForm<FormData>();

  // const onSubmit = handleSubmit((data) => {
  //   console.log(data['username']);
  //   setUsername(data['username']);
  // });

  // useEffect(() => {
  //   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //     const currentURL = tabs[0].url || '';
  //     const name = getGitHubUsername(currentURL);
  //     setUsername(name);
  //     setValue('username', name);
  //   });
  // }, []);

  // useEffect(() => {
  //   const fetch = async (username: string) => {
  //     const themeType =
  //       colorMode === 'light' ? ThemeType.LIGHT : ThemeType.DARK;
  //     const stats = await getGitHubStats(username, themeType);
  //     const lang = await getGitHubTopLanguage(username, themeType);
  //     setCurrentTopLanguage(lang.data);
  //     setCurrentStats(stats.data);
  //   };
  //   console.log(username);
  //   if (username !== '') {
  //     console.log(username);
  //     fetch(username);
  //   }
  // }, [username, colorMode, currentStats, currentTopLanguage]);

  // return (
  //   <>
  //     <Box w="540px">
  //       <Header />
  //       <StatsBody
  //         currentStats={currentStats}
  //         currentTopLanguage={currentTopLanguage}
  //       />
  //       <StatsForm
  //         onSubmit={onSubmit}
  //         register={register}
  //         formState={formState}
  //       />
  //     </Box>
  //   </>
  // );
};

const container = document.getElementById('root');
if (!container) throw new Error('container not found');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Popup />
    </ThemeProvider>
  </React.StrictMode>
);
