import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';

import React, {
  createRef,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Function } from 'lodash';
import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';
import { isFunction } from 'util';

export interface PhotoSwipeItem extends PhotoSwipe.Item {
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
}: {
  children?: PhotoSwipeWrapperChildFunction;
  images?: PhotoSwipeItem[];
}) {
  const anchor = useRef<HTMLDivElement>(null);

  const openPhotoSwipe = useCallback((index: number) => {}, []);

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
