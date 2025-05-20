/*

SmoothScroll

--------------------------------------------------------------------*/
import Lenis from 'lenis';
import { log } from 'three/src/nodes/TSL.js';
export default class SmoothScroller {
  constructor(obj) {}
  onInit(data) {
    console.log('%c Init %c %c SmoothScroll %c', 'color:white; background-color:#2870ed; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');

    this.rafCheck = false;
    this.data = data || document;
    this.wrapper = this.data.querySelector('.js-wrapper');
    this.content = this.data.querySelector('.js-page');

    this.lenis = new Lenis({
      wrapper: this.wrapper,
      content: this.content,
      duration: 1.0,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      direction: 'vertical', // vertical, horizontal
      gestureDirection: 'vertical', // vertical, horizontal, both
      smooth: false,
      mouseMultiplier: 1,
      smoothTouch: true,
      touchMultiplier: 2,
      infinite: false,
    });
    this.rafCheck = true;

    const self = this;
    console.log(document.querySelectorAll('.js-work__item'));

    function raf(time) {
      if (!self.rafCheck) return;

      self.lenis.raf(time);
      requestAnimationFrame(raf);

      _scroll = self.lenis.scroll;
      _velocity = Math.floor(self.lenis.velocity);

      // 進捗を0.0〜1.0で取得（%にするなら *100）
      const progress = _scroll / self.lenis.limit;
      const percent = Math.min(Math.max(progress, 0), 1) * 100;
      // console.log(percent);
      const items = document.querySelectorAll('.js-work__item');
      const navs = document.querySelectorAll('.js-work-nav__inner div span');
      const navsp = document.querySelectorAll('.js-work-nav__inner div p');
      const imgs = document.querySelectorAll('.js-work-image div');
      const itemsi = document.querySelectorAll('.js-work__item');

      // 進捗を0.0〜1.0で取得（%にするなら *100）

      // index を算出（0〜items.length - 1）
      const currentIndex = Math.min(Math.floor(progress * items.length), items.length - 1);

      // activeクラスの付け替え
      navsp.forEach((nav, i) => {
        if (i === currentIndex) {
          nav.classList.add('--active');
        } else {
          nav.classList.remove('--active');
        }
      });


      navs.forEach((nav, i) => {
        if (i === currentIndex) {
          nav.classList.add('--active');
        } else {
          nav.classList.remove('--active');
        }
      });
      imgs.forEach((img, i) => {
        if (i === currentIndex) {
          gsap.to(img.querySelector('.gl-i'), 0.635, { opacity: 1 });
          // img.classList.add('--active');
        } else {
          gsap.to(img.querySelector('.gl-i'),.635,{opacity:0});
          // img.classList.remove('--active');
        }
      });
      items.forEach((img, i) => {
        if (i === currentIndex) {
          img.classList.add('--active');
        } else {
          img.classList.remove('--active');
        }

        // img.stopPropagation(); // Lenis に伝播させない
        // img.preventDefault(); // デフォルトのスクロールも止める
      });
    }

    requestAnimationFrame(raf);
    //link
    document.querySelectorAll('a').forEach((anchor) => {
      if (anchor.hash) {
        function clickHandler(e) {
          e.preventDefault();
          self.lenis.scrollTo(anchor.hash);
        }
        anchor.addEventListener('click', clickHandler);
        anchor._clickHandler = clickHandler;
      }
    });
  }
  scrollTo(element) {
    this.lenis.scrollTo(element);
  }
  velocity() {
    if (_DETECT.touch || device.mobile()) return;
    if (_DETECT.isTransition) return;
    return Math.abs(this.lenis.velocity);
  }
  onStop() {
    if (_DETECT.touch || device.mobile()) return;
    // gsap.ticker.pause();
    this.lenis.stop();
    console.log('🌚      : ' + '%c 4-3.SmoothScroller-STOP', 'color:#0077AA;');
  }
  onStart() {
    if (_DETECT.touch || device.mobile()) return;
    this.lenis.start();
    console.log('🌞      : ' + '%c 4-3.SmoothScroller-START', 'color:#0077AA;');
  }
  onDestroy() {
    if (_DETECT.touch || device.mobile()) return;
    if (this.lenis) {
      document.querySelectorAll('a').forEach((anchor) => {
        if (anchor.hash) {
          // イベントリスナーを削除
          anchor.removeEventListener('click', anchor._clickHandler);
        }
      });
      this.rafCheck = false;
      this.lenis.destroy();
      delete this.lenis;
      console.log('%c DES %c %c SmoothScroller %c', 'color:white; background-color:#2a3354; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');
    }
  }
}
