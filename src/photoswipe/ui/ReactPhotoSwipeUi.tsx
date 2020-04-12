declare namespace ReactPhotoSwipeUi {
  interface Options extends PhotoSwipeUI_Default.Options {}
}

export default function ReactPhotoSwipeUi({
  pswp,
  framework,
}: {
  pswp: PhotoSwipe<ReactPhotoSwipeUi.Options>;
  framework: PhotoSwipe.UIFramework;
}) {
  const config = {
    overlayUIUpdated: false,
    controlsVisible: true,
    fullscreenAPI: null,
    controls: null,
    captionContainer: null,
    fakeCaptionContainer: null,
    indexIndicator: null,
    shareButton: null,
    shareModal: null,
    shareModalHidden: true,
    initialCloseOnScrollValue: null,
    isIdle: null,
    listen: null,
    loadingIndicator: null,
    loadingIndicatorHidden: null,
    loadingIndicatorTimeout: null,

    galleryHasOneSlide: null,
    options: null,
    uiOptions: {
      barsSize: {
        top: 44,
        bottom: 'auto',
      },
    },
  };
}
