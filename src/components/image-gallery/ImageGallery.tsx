import 'react-lazy-load-image-component/src/effects/blur.css';

import {
  LazyLoadImage,
  ScrollPosition,
  trackWindowScroll,
} from 'react-lazy-load-image-component';
import {
  ListItem,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import {
  PhotoSwipeItem,
  PhotoSwipeWrapper,
} from 'components/photoswipe/PhotoSwipeWrapper';
import React, { useMemo, useState } from 'react';

import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry from 'react-masonry-css';
import ReactResizeDetector from 'react-resize-detector';
import _ from 'lodash';
import { isMobile } from 'react-device-detect';

export interface GalleryImageThumbnail {
  src: string;
  w: number;
  h: number;
  overlay?: React.ReactNode;
}

export interface GalleryImage extends PhotoSwipeItem {
  thumbnail: GalleryImageThumbnail;
}

const useStyles = makeStyles((theme) => ({
  thumbnailGrid: {
    // display: 'flex',
    // flexWrap: 'wrap',
    // justifyContent: 'space-between',
    marginLeft: `-${theme.spacing(2)}px` /* gutter size offset */,
    width: '100%',
    // alignItems: 'center',
  },
  thumbnailRow: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  thumbnail: {
    marginLeft: theme.spacing(2),
    width: 'auto',
    height: '100%',
    padding: 0,
    boxShadow: theme.shadows[8],
    // '&:hover': {
    //   '& $thumbnailOverlay': {
    //     opacity: 1,
    //   },
    // },
  },
  thumbnailImage: {
    width: 'auto',
    height: '100%',
    display: 'block',
    margin: '0 auto',
    outline: 0,
    position: 'relative',
  },
  // thumbnailOverlay: {
  //   position: 'absolute',
  //   opacity: 0,
  //   transition: 'opacity 0.2s ease',
  //   top: 0,
  //   left: 0,
  //   height: '100%',
  //   width: '100%',
  // },
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
  const theme = useTheme();
  const classes = useStyles();
  const smallScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const [galleryWidth, setGalleryWidth] = useState<number | null>(null);
  console.log(smallScreen);

  // pw = r_k * BASIS + GAP * (n - 1)
  const imageLayout = useMemo(() => {
    if (galleryWidth && images) {
      if (smallScreen) {
        return images.map((image, index) => {
          return {
            columns: [
              {
                index,
                item: image,
              },
            ],
            rowHeight: (galleryWidth / image.thumbnail.w) * image.thumbnail.h,
          };
        });
      }

      const BASIS = 300;
      const GAP = theme.spacing(2);
      let columns: {
        index: number;
        item: GalleryImage;
      }[] = [];
      const rows: { columns: typeof columns; rowHeight: number }[] = [];
      let ratioSum = 0;
      let n = 0;

      images.forEach((image, index) => {
        columns.push({
          index,
          item: image,
        });
        ratioSum += image.thumbnail.w / image.thumbnail.h;
        n += 1;
        const totalWidth = ratioSum * BASIS + GAP * (n - 1);
        if (totalWidth > galleryWidth) {
          rows.push({
            columns,
            rowHeight: (galleryWidth - GAP * (columns.length - 1)) / ratioSum,
          });
          columns = [];
          ratioSum = 0;
          n = 0;
        } else if (images.length - 1 === index && !hasMore) {
          rows.push({
            columns,
            rowHeight: BASIS,
          });
        }
      });

      return rows;
    }
    return null;
  }, [galleryWidth, images]);

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
          <ReactResizeDetector
            refreshMode="debounce"
            refreshRate={300}
            handleWidth
            onResize={(width) => setGalleryWidth(width)}
            key="resize-detector"
          />
          {!_.isNull(imageLayout) && (
            <div className={classes.thumbnailGrid}>
              {imageLayout.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className={classes.thumbnailRow}
                  style={{ height: row.rowHeight }}
                >
                  {row.columns.map((column, columnIndex) => {
                    const item = column.item;
                    const index = column.index;
                    return (
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
                          src={item.thumbnail.src}
                          alt={item.description}
                          width={
                            (row.rowHeight / item.thumbnail.h) *
                            item.thumbnail.w
                          }
                          height={row.rowHeight}
                          placeholderSrc={item.lazySrc}
                          effect={isMobile ? undefined : 'blur'}
                          scrollPosition={scrollPosition}
                        />
                        {/* <div className={classes.thumbnailOverlay}>
                        {item.thumbnail.overlay}
                      </div> */}
                      </ListItem>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </InfiniteScroll>
      )}
    </PhotoSwipeWrapper>
  );
}

export default trackWindowScroll(ImageGallery);
