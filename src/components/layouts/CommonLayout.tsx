import React from 'react';

import { Container, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';

import Header from '@/components/layouts/Header';

const useStyles = makeStyles(() => ({
  container: {
    paddingTop: '3rem',
  },
}));

interface CommonLayoutProps {
  children: React.ReactElement;
}

// 全てのページで共通となるレイアウト
const CommonLayout = ({ children }: CommonLayoutProps) => {
  const classes = useStyles();

  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <Container maxWidth="lg" className={classes.container}>
          <Grid container justifyContent="center">
            <Grid item>{children}</Grid>
          </Grid>
        </Container>
      </main>
    </>
  );
};

export default CommonLayout;
