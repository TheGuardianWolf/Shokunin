import { Button, ButtonGroup, IconButton, makeStyles } from '@material-ui/core';
import { Comment, Favorite, ThumbDown, ThumbUp } from '@material-ui/icons';

import { E621Score } from 'app/slices/e621APISlice';
import React from 'react';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  container: {
    '& > button': {
      minWidth: '80px',
    },
  },
}));

export function ImageScore({
  upCount,
  downCount,
  favCount,
  commentCount,
}: {
  upCount: number;
  downCount: number;
  favCount: number;
  commentCount: number;
}) {
  const classes = useStyles();
  return (
    <ButtonGroup
      className={classes.container}
      aria-label="Image score controls"
    >
      <Button startIcon={<ThumbUp />}>{upCount}</Button>
      <Button startIcon={<ThumbDown />}>{-downCount}</Button>
      <Button startIcon={<Favorite />}>{favCount}</Button>
      <Button startIcon={<Comment />}>{commentCount}</Button>
    </ButtonGroup>
  );
}

export default ImageScore;
