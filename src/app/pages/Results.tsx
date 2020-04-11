import { AxiosClient, RequestStatus } from 'app/requests';
import {
  E621PostPages,
  getNextPostsPage,
  selectPosts,
  selectPostsMeta,
} from 'app/slices/e621APISlice';
import ImageGallery, {
  GalleryImage,
} from 'components/image-gallery/ImageGallery';
import React, { useCallback, useEffect, useMemo } from 'react';
import { getSearchParams, isEqualSearch } from 'util/search-utils';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import { selectClient } from 'app/slices/searchSlice';

export function Results() {
  const postsPerPage = 100;
  const [posts, postsStatus] = useSelector(selectPosts);
  const [postsMeta] = useSelector(selectPostsMeta);
  const [apiClient] = useSelector(selectClient);
  const { routeClient } = useParams();
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

  const images = useMemo(() => e621PostsToGalleryImages(posts), [posts]);

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
      images={e621PostsToGalleryImages(posts)}
      hasMore={hasMorePosts}
      dataLength={images.length}
      next={nextPage}
    />
  );
}

export default Results;

export function e621PostsToGalleryImages(posts: E621PostPages) {
  return posts.reduce<GalleryImage[]>((prev, curr): any => {
    curr.forEach((post) => {
      // E621 API returning null for some reason
      if (post.file.url != null) {
        prev.push({
          id: post.id,
          src: post.file.url,
          thumbnail: post.sample.url,
          thumbnailW: post.sample.width,
          thumbnailH: post.sample.height,
          w: post.file.width,
          h: post.file.height,
          description: post.description,
          author: post.tags.artist.join(', '),
          msrc: post.sample.url,
          lazySrc: post.preview.url,
        });
      }
    });
    return prev;
  }, []);
}
