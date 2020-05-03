import { Chip, Divider, Tab, Tabs, makeStyles } from '@material-ui/core';
import {
  E621Post,
  E621Rating,
  E621RatingStringMap,
} from 'app/slices/e621APISlice';
import { capitalize, omit } from 'lodash';

import ImageScore from './ImageScore';
import React from 'react';
import clsx from 'clsx';
import { colors } from '@material-ui/core';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  widthConstraint: {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    height: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    '& > section': {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      '& > header': {
        boxShadow: theme.shadows[4],
        cursor: 'pointer',
        height: '44px',
        width: '100%',
        minHeight: '44px',
      },
    },
  },
  content: {
    padding: '30px',
  },
  description: {},
  body: {
    flexGrow: 1,
    alignItems: 'flex-start',
    overflowY: 'auto',
    minHeight: 0,
  },
  artist: {},
  headerTextTitle: {
    textTransform: 'uppercase',
    margin: 0,
    display: 'inline',
    fontSize: '12px',
    fontWeight: 400,
    color: theme.palette.text.hint,
  },
  headerText: {
    display: 'inline',
    fontSize: '18px',
    fontWeight: 700,
    marginLeft: '10px',
  },
  headerItems: {
    height: '100%',
    padding: '10px 30px',
    justifyContent: 'space-between',
  },
  score: {},
  tags: {
    '& > div': {
      marginRight: '5px',
      marginBottom: '5px',

      '&.general': {
        backgroundColor: colors.deepPurple.A700,
      },
      '&.species': {
        backgroundColor: colors.indigo.A700,
      },
      '&.character': {
        backgroundColor: colors.cyan.A700,
      },
      '&.copyright': {
        backgroundColor: colors.green.A700,
      },
      '&.lore': {
        backgroundColor: colors.amber.A700,
      },
      '&.meta': {
        backgroundColor: colors.deepOrange.A700,
      },
    },
  },
  meta: {},
  metaItem: { display: 'flex' },
  metaItemKey: {
    minWidth: '140px',
    display: 'inline-block',
    height: '100%',
    color: theme.palette.text.hint,
  },
  metaItemValue: {
    whiteSpace: 'pre-line',
  },
}));

export function ImageInfo({
  post,
  expanded,
  setExpanded,
}: {
  post: E621Post;
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const classes = useStyles();
  const metaData = new Map<string, string>([
    ['id', String(post.id)],
    ['rating', E621RatingStringMap[post.rating]],
    ['created at', new Date(post.created_at).toLocaleString()],
    ['updated at', new Date(post.updated_at).toLocaleString()],
    ['approved by', String(post.approver_id ?? 'Pending approval')],
    ['uploaded by', String(post.uploader_id ?? 'None')],
    ['md5', post.file.md5],
    [
      post.sources.length > 1 ? 'sources' : 'source',
      post.sources.length > 0 ? post.sources.join('\n') : 'None',
    ],
    [
      post.pools.length > 1 ? 'pools' : 'pool',
      post.pools.length > 0 ? post.pools.join('\n') : 'None',
    ],
    ['parent', String(post.relationships.parentId ?? 'None')],
    [
      'children',
      post.relationships.has_children
        ? post.relationships.children.map((x) => String(x)).join(', ')
        : 'None',
    ],
  ]);
  return (
    <div className={classes.container}>
      <section>
        <header onClick={() => setExpanded((expanded) => !expanded)}>
          <div className={clsx(classes.widthConstraint, classes.headerItems)}>
            <div className={classes.artist}>
              <h4 className={classes.headerTextTitle}>{`${
                post.tags.artist.length > 1 ? 'Artists' : 'Artist'
              }`}</h4>
              <span className={classes.headerText}>
                {post.tags.artist.length > 0
                  ? post.tags.artist.join(', ')
                  : 'Unknown'}
              </span>
            </div>
            <div className={classes.score}>
              <ImageScore
                upCount={post.score.up}
                downCount={post.score.down}
                favCount={post.fav_count}
                commentCount={post.comment_count}
              />
            </div>
          </div>
        </header>
        <div
          className={clsx(classes.body, classes.widthConstraint)}
          onWheel={(e) => {
            e.stopPropagation();
          }}
        >
          <div className={classes.content}>
            <article className={classes.tags}>
              {Object.entries(omit(post.tags, 'artist')).flatMap(
                ([tagGroup, tags]) => {
                  return tags.map((tag) => (
                    <Chip
                      className={clsx(tagGroup)}
                      size="small"
                      key={tag}
                      label={tag.replace(/_/g, ' ')}
                    />
                  ));
                }
              )}
            </article>
            <article className={classes.description}>
              {post.description.split('\n').map((p, index) => {
                return <p key={index}>{p}</p>;
              })}
            </article>
            <article className={classes.meta}>
              {Array.from(metaData, ([key, value]) => {
                return (
                  <div className={classes.metaItem} key={key}>
                    <span className={classes.metaItemKey}>
                      {capitalize(key)}
                    </span>
                    <span className={classes.metaItemValue}>{value}</span>
                  </div>
                );
              })}
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ImageInfo;
