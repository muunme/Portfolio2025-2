/*!
 * Koala-Detector
 *
 * @version: v0.2.0
 * @date   : 2024-01-23
 * @license: Copyright (c) 2024 KOALA
 *
 * CurrentDeviceを利用しています
 *
 **/

export default class KoalaDetector {
  constructor(opts) {
    this.opts = opts || {};
    //global
    window._w = window.innerWidth;
    window._h = window.innerHeight;
    //
    window._DETECT = {
      webp: false,
      retina: false,
      touch: false,
      guide: this.opts.guideMode || false,
      ua: window.navigator.userAgent,
      isTransition: false,
      isScrolled: false,
      mobileStyle: device.mobile() || _w < 680,
    };
  }
  onInit(data) {
    this.data = data || document;

    this.onDetectRetina();
    this.onDetectWebp();
    this.onDetectTouch();
    console.log('%c Set %c %c KoalaDetect %c', 'color:white; background-color:#56b2e3; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');
  }
  //
  onDetectRetina() {
    if (window.devicePixelRatio > 1) {
      _DETECT.retina = true;
    } else {
      _DETECT.retina = false;
    }
  }
  onDetectWebp() {
    this.canvas = document.createElement('canvas');
    if (this.canvas.toDataURL('image/webp').indexOf('data:image/webp') == 0) {
      _DETECT.webp = true;
    } else {
      _DETECT.webp = false;
    }
  }
  onDetectTouch() {
    if (window.ontouchstart === null) {
      _DETECT.touch = true;
      document.querySelector('html').classList.add('touch');
    } else {
      _DETECT.touch = false;
      document.querySelector('html').classList.remove('touch');
    }
  }
}
const koalaDetector = new KoalaDetector({ guideMode: true });
koalaDetector.onInit();
