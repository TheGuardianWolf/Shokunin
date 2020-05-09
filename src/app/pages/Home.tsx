import {
  Button,
  Typography,
  makeStyles,
  useMediaQuery,
} from '@material-ui/core';
import { Link, useParams } from 'react-router-dom';
import React, { useState } from 'react';

import { AxiosClient } from 'app/requests';
import Ouroboros from '../../logo.svg';
import SearchInput from 'components/search-input/SearchInput';
import clsx from 'clsx';
import { generateSearchQuery } from 'util/search-utils';

const useStyles = makeStyles((theme) => ({
  darkBackground: {
    backgroundColor: theme.palette.background.default,
  },
  searchPage: {
    height: '100%',
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: '0 auto',
    paddingTop: theme.spacing(6),
    [theme.breakpoints.down('sm')]: {
      paddingTop: theme.spacing(3),
    },
    [theme.breakpoints.down('xs')]: {
      paddingTop: 0,
    },
  },
  searchTitleContainer: {
    margin: '0 auto',
  },
  searchTitle: {
    fontWeight: 700,
  },
  searchImage: {
    width: 'auto',
    height: '300px',
    maxHeight: '40vh',
    display: 'block',
    filter: theme.palette.type === 'dark' ? 'invert(1)' : 'none',
  },
  searchImageContainer: {
    margin: '20px auto',
    marginBottom: '20px',
  },
  searchIcon: {
    padding: 10,
  },
  searchInput: {
    padding: '2px 4px',
    alignItems: 'center',
    maxWidth: '100%',
    width: 400,
    margin: '20px auto',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '999px',
  },
  searchButtonsContainer: {
    margin: '0 auto',
  },
}));

export function Home() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const classes = useStyles();

  const { client } = useParams();

  const [searchInput, setSearchInput] = useState('');

  return (
    <div className={classes.searchPage}>
      <form className={classes.searchContainer}>
        <div className={classes.searchImageContainer}>
          <img src={Ouroboros} alt="" className={classes.searchImage} />
        </div>
        <div className={classes.searchTitleContainer}>
          <Typography
            className={classes.searchTitle}
            variant="h2"
            align="center"
            noWrap
          >
            Shokunin
          </Typography>
        </div>
        <SearchInput
          className={clsx(
            classes.searchInput,
            prefersDarkMode && classes.darkBackground
          )}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          buttonDisabled
          disableElevation={prefersDarkMode}
        />
        <div className={classes.searchButtonsContainer}>
          <Link
            to={{
              pathname: `/${client ?? AxiosClient.E621}/search`,
              search: generateSearchQuery(searchInput.split(' ')),
            }}
          >
            <Button type="submit" disableElevation variant="contained">
              Search
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Home;
