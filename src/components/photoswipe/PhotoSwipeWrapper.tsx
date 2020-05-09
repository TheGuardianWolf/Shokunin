import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';

import {
  ChevronLeftSharp,
  ChevronRightSharp,
  FastForwardOutlined,
  InfoOutlined,
  OpenInNewOutlined,
  PauseOutlined,
  PlayArrowOutlined,
} from '@material-ui/icons';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

enum PlaybackState {
  PAUSED = 0,
  NORMAL = 1,
  FAST = 2,
}

const PLAYBACK_ICON_STATE: React.ReactNode[] = [
  <PlayArrowOutlined />,
  <FastForwardOutlined />,
  <PauseOutlined />,
];

export interface PhotoSwipeItem extends PhotoSwipeUI_Default.Item {
  description: string;
  htmlId: string;
  id: number;
  w: number;
  h: number;
  lazySrc: string;
  externalLink?: string;
  captionEl?: (
    expanded: boolean,
    setInfoExpanded: React.Dispatch<React.SetStateAction<boolean>>
  ) => React.ReactNode;
}

export type PhotoSwipeWrapperChildFunction = (
  openPhotoSwipe: (index: number) => void
) => React.ReactNode;

const useStyles = makeStyles((theme) => ({
  photoSwipe: {
    '& .pswp__img:last-child': {
      boxShadow: theme.shadows[16],
      backgroundColor: theme.palette.background.paper,
    },
    '& .pswp__top-bar': {
      transition: 'all 0.2s ease',
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[4],
      opacity: 1,
    },
    '& .pswp__caption': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[4],
      transition: 'all 0.2s ease',
      height: '70vh',
      minHeight: 0,
      overflow: 'hidden',
      transform: 'translateY(calc(-44px + 70vh))',
      '&.expanded': {
        transform: 'none',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[4],
        opacity: 1,
      },
      '&.show': {
        display: 'block',
      },
    },
    '& .pswp__bg': {
      backgroundColor: theme.palette.background.default,
    },
    '& .pswp__ui--idle': {
      '& .pswp__button--arrow--right, & .pswp__button--arrow--left': {
        opacity: 0.5,
      },
      '& .pswp__top-bar': {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        opacity: 0.7,
      },
      '& .pswp__caption': {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        opacity: 0.7,
      },
    },
    '& .pswp__button--arrow--right::before': {
      background: 'none',
      right: 'auto',
      top: 'auto',
      width: '35px',
      height: '35px',
    },
    '& .pswp__button--arrow--left::before': {
      background: 'none',
      left: 'auto',
      top: 'auto',
      width: '35px',
      height: '35px',
    },
  },
  btn: {
    background: 'none !important',
    '& svg': {
      fill: '#FFF',
      marginTop: '3px',
    },
  },
  btnAdjust: {
    '& svg': {
      height: '19px',
      width: '19px',
    },
  },
  hidden: {
    display: 'none',
  },
}));

export function PhotoSwipeWrapper({
  children,
  images = [],
  scrollIntoView,
  scrollOffset = 0,
}: {
  children?: PhotoSwipeWrapperChildFunction;
  images?: PhotoSwipeItem[];
  scrollIntoView?: boolean;
  scrollOffset?: number;
}) {
  const classes = useStyles();

  const history = useHistory();
  const anchor = useRef<HTMLDivElement>(null);
  const [photoSwipe, setPhotoSwipe] = useState<PhotoSwipe<
    PhotoSwipeUI_Default.Options
  > | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>(
    PlaybackState.PAUSED
  );
  const [
    playbackInterval,
    setPlaybackInterval,
  ] = useState<NodeJS.Timeout | null>(null);
  const [infoExpanded, setInfoExpanded] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const currentPhotoSwipeItem = useMemo(() => {
    const item = currentIndex != null ? images[currentIndex] : null;
    return item;
  }, [currentIndex, images]);

  const openPhotoSwipe = useCallback(
    (index: number) => {
      const photoSwipeOptions: PhotoSwipeUI_Default.Options = {
        index: index ?? 0,
        loop: false,
        preload: [3, 3],
        closeElClasses: [],
        closeOnScroll: false,
        closeOnVerticalDrag: false,
        clickToCloseNonZoomable: false,
        window: window,
        tapToToggleControls: false,
      };

      let photoSwipe: PhotoSwipe<PhotoSwipeUI_Default.Options> | null = null;
      if (anchor.current != null) {
        photoSwipe = new PhotoSwipe<PhotoSwipeUI_Default.Options>(
          anchor.current,
          PhotoSwipeUI_Default,
          images,
          photoSwipeOptions
        );

        photoSwipe.listen('beforeChange', () => {
          setCurrentIndex(photoSwipe?.getCurrentIndex() ?? null);
        });
        // photoSwipe.listen('afterChange', () => {
        //   if (photoSwipe && scrollIntoView) {
        //     const index = photoSwipe.getCurrentIndex();
        //     const htmlId = images[index]?.htmlId;
        //     if (htmlId) {
        //       const element = document.getElementById(htmlId);
        //       if (element) {
        //         const rect = element.getBoundingClientRect();
        //         const absoluteElementCenter =
        //           rect.top + rect.height / 2 + window.pageYOffset;

        //         window.scrollTo({
        //           top:
        //             absoluteElementCenter -
        //             window.innerHeight / 2 +
        //             scrollOffset,
        //           behavior: 'smooth',
        //         });
        //       }
        //     }
        //   }
        // });
        photoSwipe.listen('close', () => {
          setPlaybackState(PlaybackState.PAUSED);
          setInfoExpanded(false);
          setPhotoSwipe(null);
        });
        photoSwipe.listen('preventDragEvent', (e, isDown, preventObj) => {
          preventObj.prevent = !('ontouchstart' in document.documentElement);
        });
        photoSwipe.init();
      }
      setPhotoSwipe(photoSwipe);
      return photoSwipe;
    },
    //eslint-disable-next-line
    [images]
  );

  // When photoswipe opens, remove scrollbars, then restore when it closes
  useLayoutEffect(() => {
    if (photoSwipe) {
      window.document.body.style.overflowY = 'hidden';
    } else {
      window.document.body.style.overflowY = 'auto';
    }
  }, [photoSwipe]);

  // When photoswipe closes, scroll to image
  useEffect(() => {
    if (!photoSwipe && scrollIntoView && currentIndex) {
      const index = currentIndex;
      const htmlId = images[index]?.htmlId;
      if (htmlId) {
        const element = document.getElementById(htmlId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const absoluteElementCenter =
            rect.top + rect.height / 2 + window.pageYOffset;

          window.scrollTo({
            top: absoluteElementCenter - window.innerHeight / 2 + scrollOffset,
            behavior: 'smooth',
          });
        }
      }
    }
    //eslint-disable-next-line
  }, [photoSwipe]);

  // Remove the hash on load if photoswipe is closed
  useEffect(() => {
    if (!photoSwipe && history.location.hash.length > 0) {
      history.replace({
        ...history.location,
        hash: history.location.hash.replace(/&gid=\d*?&pid=\d*/, ''),
      });
    }
    //eslint-disable-next-line
  }, []);

  // Update slideshow with newly loaded images
  useEffect(() => {
    if (photoSwipe && photoSwipe.items.length < images.length) {
      photoSwipe.items.splice(
        photoSwipe.items.length,
        0,
        ...images.slice(photoSwipe.items.length)
      );
      (photoSwipe.ui as any).update();
    }
  }, [photoSwipe, images]);

  // Set playback after each button press
  useEffect(() => {
    if (playbackInterval) {
      clearInterval(playbackInterval);
    }

    let period = Infinity;
    switch (playbackState) {
      case PlaybackState.NORMAL:
        period = 6000;
        break;
      case PlaybackState.FAST:
        period = 3000;
        break;
    }

    if (Number.isFinite(period)) {
      setPlaybackInterval(
        setInterval(() => {
          photoSwipe?.next();
        }, period)
      );
    } else {
      setPlaybackInterval(null);
    }
    //eslint-disable-next-line
  }, [playbackState]);

  return (
    <div className={classes.photoSwipe}>
      <div
        ref={anchor}
        className="pswp"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <div className="pswp__bg"></div>
        <div className="pswp__scroll-wrap">
          <div
            className="pswp__container"
            onClick={() => setInfoExpanded(false)}
          >
            <div className="pswp__item"></div>
            <div className="pswp__item"></div>
            <div className="pswp__item"></div>
          </div>
          <div className="pswp__ui pswp__ui--hidden">
            <div className="pswp__top-bar">
              <div className="pswp__counter"></div>
              <button
                className="pswp__button pswp__button--close"
                title="Close (Esc)"
              ></button>
              <button
                className="pswp__button pswp__button--share"
                title="Share"
              ></button>
              <button
                className="pswp__button pswp__button--fs"
                title="Toggle fullscreen"
              ></button>
              <button
                className="pswp__button pswp__button--zoom"
                title="Zoom in/out"
              ></button>
              <button
                className={clsx(
                  'pswp__button',
                  classes.btn,
                  classes.btnAdjust,
                  !currentPhotoSwipeItem?.captionEl && 'hidden'
                )}
                title="Info"
                onClick={() => setInfoExpanded((i) => !i)}
              >
                <InfoOutlined />
              </button>
              <button
                className={clsx('pswp__button', classes.btn)}
                title="Auto playback"
                onClick={() => {
                  setPlaybackState((playbackState + 1) % 3);
                }}
              >
                {PLAYBACK_ICON_STATE[playbackState]}
              </button>
              <a
                className={clsx('pswp__button', classes.btn)}
                href={currentPhotoSwipeItem?.externalLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  className={clsx(
                    'pswp__button',
                    classes.btn,
                    classes.btnAdjust
                  )}
                  title="Open post on site"
                >
                  <OpenInNewOutlined />
                </button>
              </a>
              <div className="pswp__preloader">
                <div className="pswp__preloader__icn">
                  <div className="pswp__preloader__cut">
                    <div className="pswp__preloader__donut"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
              <div className="pswp__share-tooltip"></div>
            </div>
            <button
              className="pswp__button pswp__button--arrow--left"
              title="Previous (arrow left)"
            >
              <ChevronLeftSharp color="action" fontSize="large" />
            </button>
            <button
              className="pswp__button pswp__button--arrow--right"
              title="Next (arrow right)"
            >
              <ChevronRightSharp color="action" fontSize="large" />
            </button>
            <div
              className={clsx(
                'pswp__caption',
                currentPhotoSwipeItem?.captionEl && 'show',
                infoExpanded && 'expanded'
              )}
            >
              <div
                className={clsx('pswp__caption__center', classes.hidden)}
              ></div>
              {(currentPhotoSwipeItem?.captionEl ?? (() => null))(
                infoExpanded,
                setInfoExpanded
              )}
            </div>
          </div>
        </div>
      </div>
      <div>{children && children(openPhotoSwipe)}</div>
    </div>
  );
}

export default PhotoSwipeWrapper;
