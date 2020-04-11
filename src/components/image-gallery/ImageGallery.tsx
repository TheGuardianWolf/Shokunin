import 'react-lazy-load-image-component/src/effects/blur.css';

import {
  LazyLoadImage,
  ScrollPosition,
  trackWindowScroll,
} from 'react-lazy-load-image-component';
import { ListItem, makeStyles } from '@material-ui/core';
import {
  PhotoSwipeItem,
  PhotoSwipeWrapper,
} from 'components/photoswipe/PhotoSwipeWrapper';
import React, { useState } from 'react';

import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry from 'react-masonry-css';
import ReactResizeDetector from 'react-resize-detector';
import { isMobile } from 'react-device-detect';

export interface GalleryImage extends PhotoSwipeItem {}

const useStyles = makeStyles(() => ({
  thumbnailGrid: {
    display: 'flex',
    marginLeft: '-30px' /* gutter size offset */,
    width: 'auto',
  },
  thumbnailColumn: {
    paddingLeft: '15px' /* gutter size */,
    backgroundClip: 'padding-box',
  },
  thumbnail: {
    width: 'auto',
    padding: 0,
    marginBottom: '15px',
  },
  thumbnailImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
    margin: '0 auto',
    outline: 0,
  },
}));

export function ImageGallery({
  scrollPosition,
  images = [],
  next = () => {},
  hasMore = false,
  loader,
  dataLength = 0,
  scrollIntoView,
  scrollOffset = 0,
}: {
  images?: GalleryImage[];
  next?: () => void;
  hasMore?: boolean;
  loader?: React.ReactNode;
  dataLength?: number;
  scrollIntoView?: boolean;
  scrollOffset?: number;
  scrollPosition: ScrollPosition;
}) {
  const classes = useStyles();
  const [columnWidth, setColumnWidth] = useState(400);

  return (
    <PhotoSwipeWrapper
      images={images}
      scrollIntoView={scrollIntoView}
      scrollOffset={scrollOffset}
    >
      {(openPhotoSwipe) => (
        <InfiniteScroll
          dataLength={dataLength}
          next={next}
          hasMore={hasMore}
          loader={loader}
        >
          <Masonry
            className={classes.thumbnailGrid}
            breakpointCols={{
              default: 8,
              2600: 7,
              2200: 6,
              1800: 5,
              1400: 4,
              1000: 3,
              600: 2,
              400: 1,
            }}
            columnClassName={classes.thumbnailColumn}
          >
            {[
              <ReactResizeDetector
                refreshMode="debounce"
                refreshRate={300}
                handleWidth
                onResize={(width) => setColumnWidth(width)}
                key="resize-detector"
              />,
            ].concat(
              images.map((item, index) => (
                <ListItem
                  className={classes.thumbnail}
                  key={item.id}
                  button
                  onClick={() => {
                    openPhotoSwipe(index);
                  }}
                >
                  <LazyLoadImage
                    id={item.htmlId}
                    className={classes.thumbnailImage}
                    tabIndex={index + 1}
                    src={item.thumbnail}
                    alt={item.description}
                    width={columnWidth}
                    height={(columnWidth / item.thumbnailW) * item.thumbnailH}
                    placeholderSrc={item.lazySrc}
                    effect={isMobile ? undefined : 'blur'}
                    scrollPosition={scrollPosition}
                  />
                </ListItem>
              ))
            )}
          </Masonry>
        </InfiniteScroll>
      )}
    </PhotoSwipeWrapper>
  );
}

export default trackWindowScroll(ImageGallery);
