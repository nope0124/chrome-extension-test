import Cookies from 'js-cookie';
import React, { createContext, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { makeStyles } from '@mui/styles';

import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { User } from '@/interfaces/user';
import { signOut } from '@/lib/api/auth';

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

const useStyles = makeStyles(() => ({
  title: {
    flexGrow: 1,
    textDecoration: 'none',
    color: 'inherit',
  },
  linkBtn: {
    textTransform: 'none',
  },
}));

const Header: React.FC = () => {
  const { loading, isSignedIn, setIsSignedIn } = useContext(AuthContext);
  const classes = useStyles();
  const history = useNavigate();

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const res = await signOut();

      if (res.data.success === true) {
        // サインアウト時には各Cookieを削除
        Cookies.remove('_access_token');
        Cookies.remove('_client');
        Cookies.remove('_uid');

        setIsSignedIn(false);
        history('/sign_in');

        console.log('Succeeded in sign out');
      } else {
        console.log('Failed in sign out');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const AuthButtons = () => {
    // 認証完了後はサインアウト用のボタンを表示
    // 未認証時は認証用のボタンを表示
    if (!loading) {
      if (isSignedIn) {
        return (
          <>
            <Button
              component={Link}
              to="/themes/new"
              color="inherit"
              className={classes.linkBtn}
            >
              テーマ作成
            </Button>
            <Button
              color="inherit"
              className={classes.linkBtn}
              onClick={handleSignOut}
            >
              サインアウト
            </Button>
          </>
        );
      } else {
        return (
          <Button
            component={Link}
            to="/sign_in"
            color="inherit"
            className={classes.linkBtn}
          >
            サインイン
          </Button>
        );
      }
    } else {
      return <></>;
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit">
            <MenuIcon />
          </IconButton>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            className={classes.title}
          >
            Sample
          </Typography>
          <AuthButtons />
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
