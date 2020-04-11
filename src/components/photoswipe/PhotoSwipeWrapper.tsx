import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';

export interface PhotoSwipeItem extends PhotoSwipe.Item {
  htmlId: string;
  id: number;
  src: string;
  thumbnail: string;
  w: number;
  h: number;
  thumbnailW: number;
  thumbnailH: number;
  description: string;
  author: string;
  msrc: string;
  lazySrc: string;
}

export type PhotoSwipeWrapperChildFunction = (
  openPhotoSwipe: (index: number) => void
) => React.ReactNode;

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
  const anchor = useRef<HTMLDivElement>(null);
  const [photoSwipe, setPhotoSwipe] = useState<PhotoSwipe<
    PhotoSwipeUI_Default.Options
  > | null>(null);

  const openPhotoSwipe = useCallback(
    (index: number) => {
      const photoSwipeOptions: PhotoSwipe.Options = {
        index: index ?? 0,
        loop: false,
        preload: [3, 3],
      };

      let photoSwipe: PhotoSwipe<PhotoSwipeUI_Default.Options> | null = null;
      if (anchor.current != null) {
        photoSwipe = new PhotoSwipe<PhotoSwipeUI_Default.Options>(
          anchor.current,
          PhotoSwipeUI_Default,
          images,
          photoSwipeOptions
        );
        if (scrollIntoView) {
          photoSwipe.listen('afterChange', () => {
            if (photoSwipe) {
              const index = photoSwipe.getCurrentIndex();
              const htmlId = images[index]?.htmlId;
              if (htmlId) {
                const element = document.getElementById(htmlId);
                if (element) {
                  const rect = element.getBoundingClientRect();
                  const absoluteElementCenter =
                    rect.top + rect.height / 2 + window.pageYOffset;

                  window.scrollTo({
                    top:
                      absoluteElementCenter -
                      window.innerHeight / 2 +
                      scrollOffset,
                    behavior: 'smooth',
                  });
                }
              }
            }
          });
        }
        photoSwipe.init();
      }
      setPhotoSwipe(photoSwipe);
      return photoSwipe;
    },
    [images, scrollIntoView, scrollOffset]
  );

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

  return (
    <div>
      <div
        ref={anchor}
        className="pswp"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <div className="pswp__bg"></div>
        <div className="pswp__scroll-wrap">
          <div className="pswp__container">
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
            ></button>
            <button
              className="pswp__button pswp__button--arrow--right"
              title="Next (arrow right)"
            ></button>
            <div className="pswp__caption">
              <div className="pswp__caption__center"></div>
            </div>
          </div>
        </div>
      </div>
      <div>{children && children(openPhotoSwipe)}</div>
    </div>
  );
}

export default PhotoSwipeWrapper;
