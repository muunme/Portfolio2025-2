/*

initClass

--------------------------------------------------------------------*/

console.log('%c Set %c %c initClass.js %c', 'color:white; background-color:#56b2e3; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');

import KoalaGuide          from './class/koala-guide';            // Template ✔︎
import KoalaParallax       from './class/koala-parallax';         // Template ✔︎
import KoalaImageLoader    from './class/koala-image-loader';     // Template ✔︎
import KoalaMarquee        from './class/koala-marquee';          // Template ✔︎
import KoalaVisibleChecker from './class/koala-visible-checker';  // Template ✔︎
import KoalaCurrentChecker from './class/koala-current-checker';  // Template ✔︎
import KoalaHorizonScroll  from './class/koala-horizon-scroll';  // Template ✔︎
import PageTransition      from './class/transition';
import SmoothScroller      from './class/smooth-scroll';
import KoalaThree          from './class/koala-three.js';
import KoalaPanels         from './class/koala-panels.js';



const APP = {
  koalaGuide         : new KoalaGuide({ visible: _DETECT.guide ?? true }),
  pageTransition     : new PageTransition(),
  smoothScroller     : new SmoothScroller(),
  koalaImageLoader   : new KoalaImageLoader({ imageElem: '.js-img', imageBg: 'js-bg', imageAdd: 'is-loaded', flagWebp: _DETECT.webp, flagRetina: _DETECT.retina }),
  koalaParallax      : new KoalaParallax({ targetElements: '.js-p__wrap', imgElement: '.js-p__item', mobileEnabled: true, posPow: 0.2, scalePow: -0.1 }),
  koalaMarquee       : new KoalaMarquee({ targetWrap: '.js-marquee', item: '.js-marquee__item', inner: '.js-marquee__inner', auto: true, autoSpeed: 0.8, drag: true, dragSpeed: 1.5, scroll: true }),
  koalaVisibleChecker: new KoalaVisibleChecker({ target: '.js-visible', delayItem: '.js-visible__d', delayMode: true, delayTime: 0.05, first: true }),
  koalaCurrentChecker: new KoalaCurrentChecker({ mode: 'nav', /*"default" "nav" "header"*/ targetWrap: '.js-current', targetItem: '.js-current__item', nav: '.js-current__nav', triggerItem: 'js-current__trigger', scrollY: () => _scroll, /*window.pageYOffset or 任意 */ checkFn: null, }),
  koalaHorizonScroll : new KoalaHorizonScroll({ scrollWrap: '.js-wrapper', target: '.js-hr', wrap: '.js-hr__wrap', item: '.js-hr__item' }),
  koalaThree         : new KoalaThree(),
  koalaPanel         : new KoalaPanels()
};

export function initGlobals(data) {
  console.log('%c initGlobals %c  %c  %c', 'color:#439160; border:1px solid #439160; padding:0px 1px;  border-radius:4px;', '', 'color:#91e5ff;', '');
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  window._w        = window.innerWidth;
  window._h        = window.innerHeight;
  window._scroll   = 0;
  window._velocity = 0;
}
export function initOnce(data) {
  APP.koalaMarquee.app = APP;
  APP.koalaMarquee.setApp(APP);
  APP.koalaGuide.onInit()
  APP.koalaPanel.onInit();
  setTimeout(() => {
    APP.koalaThree.onInit(data.next.container);
  }, 100);
}
export function initAPP(data) {
  APP.koalaHorizonScroll.onInit(data.next.container);
  APP.koalaVisibleChecker.onInit(data.next.container);
  APP.smoothScroller.onInit(data.next.container);
  APP.koalaMarquee.onInit(data.next.container);
  APP.koalaCurrentChecker.onInit(data.next.container);
  APP.koalaParallax.onInit(data.next.container);
  setTimeout(() => {
    // APP.koalaThree.onInit(data.next.container);
    APP.koalaImageLoader.onInit(data.next.container);
  }, 100);
}
export function onResize(data) {
  console.log('%c onResize %c  %c  %c', 'color:#439160; border:1px solid #439160; padding:0px 1px;  border-radius:4px;', '', 'color:#91e5ff;', '');

  //vh
  const vhSet = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  vhSet();
  //スマホ横にした時にリサイズ発火
  const deviceChangeRelaod = () => {
    if (_w == window.innerWidth && device.mobile()) return;
    _w = window.innerWidth;
    _h = window.innerHeight;
    if (_DETECT.ua !== window.navigator.userAgent) {
      document.location.reload();
      return;
    }
  };
  deviceChangeRelaod();
}
export function onDestroy(data) {
  APP.koalaHorizonScroll.onDestroy();
  APP.koalaVisibleChecker.onDestroy();
  // APP.koalaMarquee.onDestroy();
  APP.smoothScroller.onDestroy()
}
export function onScroll(e) {
  requestAnimationFrame;
  const scrollCheck = (e) => {
    if (e > 100 && !_DETECT.isScrolled) {
      _DETECT.isScrolled = true;
      document.documentElement.classList.add('is-scrolled');
    } else if (e < 100 && _DETECT.isScrolled) {
      _DETECT.isScrolled = false;
      document.documentElement.classList.remove('is-scrolled');
    }
  };

  // _scroll = e;
  scrollCheck(e);
}
gsap.ticker.add((time) => {
  if (APP?.smoothScroller?.raf) APP.smoothScroller.raf(time * 1000);
});
export { APP };

