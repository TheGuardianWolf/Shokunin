import { ChevronLeft, Storage } from '@material-ui/icons';
import {
  IconButton,
  AppBar as MaterialAppBar,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  makeStyles,
} from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import { generateSearchQuery, getSearchParams } from 'util/search-utils';
import { useHistory, useRouteMatch } from 'react-router-dom';

import { AxiosClient } from 'app/requests';
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
  toolbarButtonNavigateBack: {
    marginRight: theme.spacing(2),
    order: 1,
    [theme.breakpoints.down('xs')]: {
      marginRight: 0,
    },
  },
  toolbarButtonServerSelect: {
    marginLeft: 'auto',
    order: 4,
    [theme.breakpoints.down('xs')]: {
      order: 3,
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

const servers = [
  {
    client: AxiosClient.E621,
    name: 'NSFW (e621.net)',
  },
  {
    client: AxiosClient.E926,
    name: 'SFW (e926.net)',
  },
];

export function AppBar() {
  const classes = useStyles();

  const history = useHistory();
  const match = useRouteMatch<{ client: AxiosClient | undefined }>('/:client');

  const client = useMemo(() => match?.params.client ?? AxiosClient.E621, [
    match,
  ]);

  const tags = useMemo(() => getSearchParams(history.location.search, 'tags'), [
    history.location.search,
  ]);

  const [searchInput, setSearchInput] = useState('');
  const [serverSelectAnchorEl, setServerSelectAnchorEl] = useState<
    (EventTarget & HTMLButtonElement) | null
  >(null);

  useEffect(() => {
    setSearchInput(tags.join(' '));
  }, [tags]);

  const isHome = useMemo(() => /^\/[^/]*\/?$/.test(history.location.pathname), [
    history.location.pathname,
  ]);

  return (
    <MaterialAppBar position="sticky">
      <Toolbar className={classes.toolbar}>
        <IconButton
          color="inherit"
          aria-label="navigate back"
          onClick={() => {
            history.push(`/${match?.params.client ?? ''}`);
          }}
          edge="start"
          className={clsx(
            classes.toolbarButtonNavigateBack,
            isHome && classes.invisible
          )}
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
        <IconButton
          color="inherit"
          aria-label="server select"
          aria-controls="menu-server"
          aria-haspopup="true"
          onClick={(e) => setServerSelectAnchorEl(e.currentTarget)}
          edge="start"
          className={classes.toolbarButtonServerSelect}
        >
          <Storage />
        </IconButton>
        <Menu
          id="menu-server"
          anchorEl={serverSelectAnchorEl}
          keepMounted
          open={!!serverSelectAnchorEl}
          onClose={() => setServerSelectAnchorEl(null)}
        >
          {servers.map((server) => (
            <MenuItem
              key={server.name}
              selected={client === server.client}
              onClick={() => {
                const pathComponents = history.location.pathname.split('/');
                if (pathComponents.length > 1) {
                  pathComponents[1] = server.client;
                }
                history.push({
                  ...history.location,
                  pathname: pathComponents.join('/'),
                });
                setServerSelectAnchorEl(null);
              }}
            >
              {server.name}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </MaterialAppBar>
  );
}

export default AppBar;
