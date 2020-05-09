import { AxiosClient, RequestStatus } from 'app/requests';
import {
  E621PostPages,
  getNextPostsPage,
  selectClient,
  selectPosts,
  selectPostsMeta,
} from 'app/slices/e621APISlice';
import ImageGallery, {
  GalleryImage,
} from 'components/image-gallery/ImageGallery';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Tabs, makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import { getSearchParams, isEqualSearch } from 'util/search-utils';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import ImageInfo from 'components/image-info/ImageInfo';

const useStyles = makeStyles(() => ({
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '60px',
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
}));

export function Results() {
  const classes = useStyles();
  const theme = useTheme();
  const isPageNarrow = useMediaQuery(theme.breakpoints.down('xs'));

  const postsPerPage = 100;
  const [posts, postsStatus] = useSelector(selectPosts);
  const [postsMeta] = useSelector(selectPostsMeta);
  const [apiClient] = useSelector(selectClient);
  const { client: routeClient } = useParams();
  const client = useMemo(
    () => (routeClient as AxiosClient) ?? AxiosClient.E621,
    [routeClient]
  );
  const location = useLocation();
  const dispatch = useDispatch();

  const tags = useMemo(() => getSearchParams(location.search, 'tags'), [
    location.search,
  ]);

  const nextPage = useCallback(() => {
    if (postsStatus !== RequestStatus.REQUESTING) {
      dispatch(
        getNextPostsPage(
          tags,
          postsPerPage,
          (client as AxiosClient) ?? AxiosClient.E621
        )
      );
    }
  }, [postsStatus, dispatch, client, tags]);

  const hasMorePosts = useMemo(() => {
    const [lastFetchedPage] = posts.slice(-1);
    if (!lastFetchedPage || lastFetchedPage.length < postsPerPage) {
      return false;
    }
    return true;
  }, [posts]);

  const images = useMemo(() => e621PostsToGalleryImages(posts, classes), [
    posts,
    classes,
  ]);

  const needsInit = useMemo(
    () =>
      !posts[0] ||
      (posts[0] &&
        !isEqualSearch(
          { client, meta: { tags, limit: postsPerPage } },
          {
            client: apiClient,
            meta: { tags: postsMeta.tags, limit: postsMeta.limit },
          }
        )),
    [posts, tags, postsMeta.limit, postsMeta.tags, apiClient, client]
  );

  // Initial trigger to get results
  useEffect(() => {
    if (needsInit && postsStatus !== RequestStatus.REQUESTING) {
      nextPage();
    }
  }, [needsInit, postsStatus, nextPage]);

  return (
    <ImageGallery
      images={e621PostsToGalleryImages(posts, classes, apiClient)}
      hasMore={hasMorePosts}
      dataLength={images.length}
      next={nextPage}
      scrollIntoView
      scrollOffset={isPageNarrow ? -116 : -64}
    />
  );
}

export default Results;

export function e621PostsToGalleryImages(
  posts: E621PostPages,
  classes: ReturnType<typeof useStyles>,
  client: AxiosClient = AxiosClient.E621
) {
  return posts.reduce<GalleryImage[]>((prev, curr): any => {
    curr.forEach((post) => {
      // E621 API returning null for some reason
      if (post.file.url != null) {
        prev.push({
          htmlId: `post-${post.id}`,
          id: post.id,
          src: post.file.url,
          w: post.file.width,
          h: post.file.height,
          description: post.description,
          msrc: post.sample.url,
          lazySrc: post.preview.url,
          externalLink: `https://${client}.net/posts/${post.id}`,
          captionEl: (expanded, setExpanded) => (
            <ImageInfo
              post={post}
              expanded={expanded}
              setExpanded={setExpanded}
            />
          ),
          thumbnail: {
            src: post.sample.url,
            w: post.sample.width,
            h: post.sample.height,
            // overlay: (
            //   <div
            //     className={classes.imageOverlay}
            //   >{`${post.score.up} ${post.score.down} ${post.score.total}`}</div>
            // ),
          },
        });
      }
    });
    return prev;
  }, []);
}
