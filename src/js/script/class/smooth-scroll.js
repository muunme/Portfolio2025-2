/*

SmoothScroll

--------------------------------------------------------------------*/
import Lenis from 'lenis';
export default class SmoothScroller {
  constructor(obj) {
    this.raf = this.raf.bind(this); // ← ★追加！外部から呼び出せるようにbind
  }
  onInit(data) {
    console.log('%c Init %c %c SmoothScroll %c', 'color:white; background-color:#2870ed; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');

    this.rafCheck = false;
    this.data = data || document;
    this.wrapper = this.data.querySelector('.js-wrapper');
    this.content = this.data.querySelector('.js-page');
    this.lenis = new Lenis({
      wrapper: this.wrapper,
      content: this.content,
      duration: 1.2,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      direction: 'vertical', // vertical, horizontal
      gestureDirection: 'vertical', // vertical, horizontal, both
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: true,
      touchMultiplier: 2,
      infinite: false,
    });
    this.rafCheck = true;

    //link
    document.querySelectorAll('a').forEach((anchor) => {
      if (anchor.hash) {
        const hash = anchor.hash;
        const clickHandler = (e) => {
          e.preventDefault();
          this.lenis.scrollTo(hash); // ← this は SmoothScroller インスタンス！
        };
        anchor.addEventListener('click', clickHandler);
        anchor._clickHandler = clickHandler;
      }
    });
  }
  scrollTo(element) {
    console.log(element);

    this.lenis.scrollTo(element);
  }
  raf(time) {
    if (!this.rafCheck) return;

    this.lenis.raf(time);
    window._scroll = this.lenis.scroll;
    window._velocity = Math.floor(this.lenis.velocity);
    if (_DETECT.guide) {
      document.querySelector('.nm-scroll').innerHTML = window._scroll;
      document.querySelector('.nm-scrollPow').innerHTML = window._velocity;
    }
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
