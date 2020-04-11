import {
  IconButton,
  AppBar as MaterialAppBar,
  Toolbar,
  Typography,
  makeStyles,
} from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import { generateSearchQuery, getSearchParams } from 'util/search-utils';
import { useHistory, useRouteMatch } from 'react-router-dom';

import { ChevronLeft } from '@material-ui/icons';
import SearchInput from 'components/search-input/SearchInput';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  invisible: {
    visibility: 'hidden',
  },
  hidden: {
    display: 'none',
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  menuButton: {
    marginRight: theme.spacing(2),
    order: 1,
    [theme.breakpoints.down('xs')]: {
      marginRight: 0,
    },
  },
  title: {
    marginRight: theme.spacing(4),
    textAlign: 'center',
    order: 2,
    [theme.breakpoints.down('xs')]: {
      flexGrow: 1,
      marginRight: '48px',
    },
  },
  searchInput: {
    flexGrow: 1,
    maxWidth: '666px',
    order: 3,
    marginRight: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%',
      width: '100%',
      marginRight: 0,
      marginTop: '12px',
      marginBottom: '12px',
    },
  },
}));

export function AppBar() {
  const classes = useStyles();

  const history = useHistory();

  const match = useRouteMatch<{ client: string }>('/:client');

  const tags = useMemo(() => getSearchParams(history.location.search, 'tags'), [
    history.location.search,
  ]);

  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    setSearchInput(tags.join(' '));
  }, [tags]);

  const isHome = useMemo(() => /^\/[^/]*\/?$/.test(history.location.pathname), [
    history.location.pathname,
  ]);

  return (
    <MaterialAppBar position="static">
      <Toolbar className={classes.toolbar}>
        <IconButton
          color="inherit"
          aria-label="navigate back"
          onClick={() => {
            history.push(`/${match?.params.client ?? ''}`);
          }}
          edge="start"
          className={clsx(classes.menuButton, isHome && classes.invisible)}
        >
          <ChevronLeft />
        </IconButton>
        <Typography className={classes.title} variant="h6" noWrap>
          Shokunin
        </Typography>
        <SearchInput
          className={clsx(classes.searchInput, isHome && classes.hidden)}
          disableElevation
          buttonOnRight
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onSubmit={(e) => {
            e.preventDefault();
            history.push({
              ...history.location,
              search: generateSearchQuery(searchInput.split(' ')),
            });
          }}
        />
      </Toolbar>
    </MaterialAppBar>
  );
}

export default AppBar;
