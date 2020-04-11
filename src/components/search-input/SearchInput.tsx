import { IconButton, InputBase, Paper, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';

import { Search } from '@material-ui/icons';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  floatRight: {
    order: 2,
  },
  searchIcon: {
    padding: 10,
  },
  searchInput: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  searchInputContainer: {
    display: 'flex',
  },
}));

export function SearchInput({
  className,
  onSubmit,
  disableElevation,
  buttonOnRight,
  buttonDisabled,
  value,
  onChange,
}: {
  className?: string;
  onSubmit?: (event: React.FormEvent<HTMLDivElement>) => void;
  disableElevation?: boolean;
  buttonOnRight?: boolean;
  buttonDisabled?: boolean;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const classes = useStyles();
  const [searchInputRaised, setSearchInputRaised] = useState(false);
  const [searchInputFocused, setSearchInputFocused] = useState(false);

  return (
    <Paper
      elevation={searchInputRaised && !disableElevation ? 3 : 0}
      className={clsx(classes.searchInputContainer, className)}
      onMouseEnter={() => {
        setSearchInputRaised(true);
      }}
      onMouseLeave={() => {
        if (!searchInputFocused) {
          setSearchInputRaised(false);
        }
      }}
      component={onSubmit ? 'form' : 'div'}
      onSubmitCapture={onSubmit}
    >
      <IconButton
        disabled={buttonDisabled}
        className={clsx(
          buttonOnRight && classes.floatRight,
          classes.searchIcon
        )}
        type={buttonDisabled ? 'button' : 'submit'}
        aria-label="icon"
      >
        <Search />
      </IconButton>

      <InputBase
        onFocus={() => {
          setSearchInputRaised(true);
          setSearchInputFocused(true);
        }}
        onBlur={() => {
          setSearchInputRaised(false);
          setSearchInputFocused(false);
        }}
        className={classes.searchInput}
        value={value}
        onChange={onChange}
        inputProps={{ 'aria-label': 'search input' }}
      />
    </Paper>
  );
}

export default SearchInput;
