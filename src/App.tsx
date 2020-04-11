import {
  CssBaseline,
  Paper,
  ThemeProvider,
  createMuiTheme,
  makeStyles,
  responsiveFontSizes,
  useMediaQuery,
} from '@material-ui/core';
import React, { useMemo } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import AppBar from 'app/header/AppBar';
import Home from 'app/pages/Home';
import { LastLocationProvider } from 'react-router-last-location';
import Results from 'app/pages/Results';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    minWidth: '320px',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    borderRadius: 0,
  },
}));

export function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      responsiveFontSizes(
        createMuiTheme({
          palette: {
            type: prefersDarkMode ? 'dark' : 'light',
          },
        })
      ),
    [prefersDarkMode]
  );

  const classes = useStyles();

  return (
    <Router>
      <LastLocationProvider>
        <ThemeProvider theme={theme}>
          <div className={classes.root}>
            <CssBaseline />
            <AppBar />
            <Paper component="main" className={classes.content}>
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/:client" exact component={Home} />
                <Route path="/:client/search" component={Results} />
              </Switch>
            </Paper>
          </div>
        </ThemeProvider>
      </LastLocationProvider>
    </Router>
  );
}

export default App;
