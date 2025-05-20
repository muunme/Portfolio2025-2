/*

initClass

--------------------------------------------------------------------*/

console.log('%c Set %c %c initClass.js %c', 'color:white; background-color:#56b2e3; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');

import KoalaGuide from './class/koala-guide'; // Template ✔︎
// import KoalaImageLoader    from './class/koala-image-loader';     // Template ✔︎
import KoalaVisibleChecker from './class/koala-visible-checker'; // Template ✔︎
import KoalaMarquee from './class/koala-marquee.js';
import KoalaFunHover from './class/koala-fun-hover';
import PageTransition from './class/transition';
import SmoothScroller from './class/smooth-scroll';
import KoalaThree from './class/koala-three.js';
import { Pane } from 'tweakpane';


// import { Pane } from 'https://cdn.jsdelivr.net/npm/tweakpane@4.0.5/dist/tweakpane.min.js';

// import KoalaMenu           from './class/koala-menu';             // Template ✔︎
// import KoalaAccordion      from './class/koala-accordion';        // Template ✔︎
// import KoalaParallax       from './class/koala-parallax';         // Template ✔︎
// import KoalaMarquee        from './class/koala-marquee';          // Template ✔︎
// import KoalaCurrentChecker from './class/koala-current-checker';  // Template ✔︎
// import KoalaHorizonScroll  from './class/koala-horizon-scroll';   // Template ✔︎
// import KoalaUI            from './class/Koala-ui';
// import KoalaLang          from './class/Koala-lang.js';

const APP = {
  koalaGuide: new KoalaGuide({ visible: _DETECT.guide ?? true }),
  pageTransition: new PageTransition(),
  smoothScroller: new SmoothScroller(),
  // koalaImageLoader   : new KoalaImageLoader({ imageElem: '.js-img', imageBg: 'js-bg', imageAdd: 'is-loaded', flagWebp: _DETECT.webp, flagRetina: _DETECT.retina }),
  koalaVisibleChecker: new KoalaVisibleChecker({ target: '.js-visible', delayItem: '.js-visible__d', delayMode: true, delayTime: 0.03, first: true }),
  koalaFunHover: new KoalaFunHover({ triggerWrap: 'body', targetWrap: '.js-box__inner' }),
  // koalaMenu          : new KoalaMenu({ menuWrap: '.js-menu__wrap', menuBtn: '.js-menu__button' }),
  // koalaAccordion     : new KoalaAccordion({ section: '.js-accordion', trigger: '.js-accordion__trigger', content: '.js-accordion__content', inner: '.js-accordion__inner' }),
  // koalaParallax      : new KoalaParallax({ targetElements: '.js-p__wrap', imgElement: '.js-p__item', mobileEnabled: true, posPow: 0.2, scalePow: -0.1 }),
  koalaMarquee       : new KoalaMarquee({ targetWrap: '.js-marquee', item: '.js-marquee__item', inner: '.js-marquee__inner', auto: true, autoSpeed: 0.8, drag: true, dragSpeed: 1.5, scroll: true, }),
  // koalaCurrentChecker: new KoalaCurrentChecker({ mode: 'nav', /*"default" "nav" "header"*/ targetWrap: '.js-current', targetItem: '.js-current__item', nav: '.js-current__nav', triggerItem: 'js-current__trigger', scrollY: () => _scroll, /*window.pageYOffset or 任意 */ checkFn: null, }),
  // koalaHorizonScroll : new KoalaHorizonScroll({ scrollWrap: '.js-wrapper', target: '.js-hr', wrap: '.js-hr__wrap', item: '.js-hr__item' })
  koalaThree: new KoalaThree(),
};

export function once(data) {
  APP.koalaGuide.onInit();
  APP.koalaMarquee.app = APP;
  // APP.koalaMarquee.setApp(APP);
  // APP.koalaMenu.onInit();
}
export function init(data) {
  console.log(data.next.container);
  
  setTimeout(() => {
    APP.smoothScroller.onInit(data.next.container);
    setTimeout(() => {
      // APP.koalaImageLoader.onInit(data.next.container);
      APP.koalaThree.onInit(data.next.container);
    }, 50);
    APP.koalaFunHover.onInit(data.next.container);
    // APP.koalaHorizonScroll.onInit(data.next.container)
    APP.koalaVisibleChecker.onInit(data.next.container);
    APP.koalaMarquee.onInit(data.next.container);
    // APP.koalaCurrentChecker.onInit(data.next.container)
    // APP.koalaParallax.onInit(data.next.container);
    // APP.koalaAccordion.onInit(data.next.container);

    /*

  NoiseCanvas

  --------------------------------------------------------------------*/
    // const canvas = document.getElementById('noiseCanvas');
    // const ctx = canvas.getContext('2d');

    // // ノイズ生成用キャンバス（小さめ）
    // const noiseCanvas = document.createElement('canvas');
    // const noiseCtx = noiseCanvas.getContext('2d');
    // noiseCanvas.width = 1920;
    // noiseCanvas.height = 1920;

    // const imageData = noiseCtx.createImageData(noiseCanvas.width, noiseCanvas.height);
    // const buffer = new Uint32Array(imageData.data.buffer);

    // function resizeCanvas() {
    //   canvas.width = window.innerWidth;
    //   canvas.height = window.innerHeight;
    // }
    // resizeCanvas();
    // window.addEventListener('resize', resizeCanvas);

    // // フレーム制御
    // let frameCount = 0;
    // const drawEveryNFrames = 3;

    // function drawNoise() {
    //   // ノイズ生成（グレー中心）
    //   for (let i = 0; i < buffer.length; i++) {
    //     const gray = 128 + (Math.random() * 60 - 30);
    //     buffer[i] = (255 << 24) | (gray << 16) | (gray << 8) | gray;
    //   }
    //   noiseCtx.putImageData(imageData, 0, 0);

    //   // メイン描画
    //   ctx.clearRect(0, 0, canvas.width, canvas.height);
    //   ctx.imageSmoothingEnabled = false;
    //   ctx.globalAlpha = 0.07 * window.devicePixelRatio;
    //   ctx.drawImage(noiseCanvas, 0, 0, canvas.width, canvas.height);
    // }

    // // アニメーションループ
    // function animate() {
    //   if (frameCount % drawEveryNFrames === 0) {
    //     drawNoise();
    //   }
    //   frameCount++;
    //   requestAnimationFrame(animate);
    // }
    // animate();

    /*

  panel

  --------------------------------------------------------------------*/

    const PARAMS = {
      bg: '#f5f5f5', // 初期値はCSSと合わせる
      font: '#8ab884', // 初期値はCSSと合わせる
      fontA: '#ffffff', // 初期値はCSSと合わせる
      box: '#ffffff', // 初期値はCSSと合わせる
    };

    const pane = new Pane();
    pane.addBinding(PARAMS, 'bg', { label: 'Main Color' }).on('change', (ev) => {
      document.documentElement.style.setProperty('--bg', ev.value);
    });
    pane.addBinding(PARAMS, 'font', { label: 'font Color' }).on('change', (ev) => {
      document.documentElement.style.setProperty('--font', ev.value);
    });
    pane.addBinding(PARAMS, 'box', { label: 'box Color' }).on('change', (ev) => {
      document.documentElement.style.setProperty('--box', ev.value);
    });
    pane.addBinding(PARAMS, 'fontA', { label: 'fontA' }).on('change', (ev) => {
      document.documentElement.style.setProperty('--fontA', ev.value);
    });

    /*

  random

  --------------------------------------------------------------------*/
    const h1s = document.querySelectorAll('h1');
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const minDistance = 100; // 距離の最小値（px）

    const positions = [];

    function isTooClose(x, y) {
      return positions.some((pos) => {
        const dx = pos.x - x;
        const dy = pos.y - y;
        return Math.sqrt(dx * dx + dy * dy) < minDistance;
      });
    }

    h1s.forEach((h1) => {
      let x, y;
      let tries = 0;

      do {
        x = (Math.random() - 0.5) * vw;
        // x = Math.random() * (vw - h1.offsetWidth);
        // y = Math.random() * (vh - h1.offsetHeight);
        tries++;
        if (tries > 1000) break; // 無限ループ防止
      } while (isTooClose(x, y));

      positions.push({ x, y });
      h1.style.left = `${x}px`;
      h1.style.top = `${y}px`;
    });

    /*

  NoiseCanvas

  --------------------------------------------------------------------*/
    // const canvasLine = document.getElementById('noiseLineCanvas');
    // const ctxLine = canvasLine.getContext('2d');
    // canvasLine.width = window.innerWidth;
    // canvasLine.height = window.innerHeight;

    // const origin = { x: canvasLine.width / 2, y: canvasLine.height / 2 };
    // let target = { x: origin.x, y: origin.y };
    // // const h2El = document.querySelector('h1');
    // // const h2Rect = h2El.getBoundingClientRect();
    // // target = {
    // //   x: h2Rect.left + h2Rect.width / 2,
    // //   y: h2Rect.top + h2Rect.height / 2,
    // // };
    // window.addEventListener('mousemove', (e) => {
    //   target.x = e.clientX;
    //   target.y = e.clientY;
    // });

    // function drawNoisyLine(start, end, time) {
    //   const segments = 40;
    //   const dx = end.x - start.x;
    //   const dy = end.y - start.y;

    //   ctxLine.beginPath();
    //   ctxLine.moveTo(start.x, start.y);

    //   for (let i = 1; i <= segments; i++) {
    //     const t = i / segments;
    //     const x = start.x + dx * t;
    //     const y = start.y + dy * t;

    //     const angle = Math.atan2(dy, dx);
    //     const noiseStrength = 10;
    //     const offset = Math.random(time * 0.002 + i * 0.3) * noiseStrength * (1 - Math.abs(0.5 - t) * 2); // 中央ほど強く

    //     const offsetX = -Math.sin(angle) * offset * (Math.random() * 10);
    //     const offsetY = Math.cos(angle) * offset;

    //     ctxLine.lineTo(x + offsetX, y + offsetY);
    //   }

    //   ctxLine.strokeStyle = '#8ab884';
    //   ctxLine.lineWidth = 1;
    //   ctxLine.stroke();
    // }

    // function animate(time) {
    //   ctxLine.clearRect(0, 0, canvasLine.width, canvasLine.height);

    //   drawNoisyLine(origin, target, time);

    //   requestAnimationFrame(animate);
    // }

    // animate();
    //rotate random
    // if (!document.querySelector('.g-w'))return
    //   for (let index = 0; index < document.querySelectorAll('.g-w').length; index++) {
    //     const element = document.querySelectorAll('.g-w')[index];
    //     element.style.transform = `rotate(${Math.random() * 2 - 1}deg)`;
    //   }

    /*

  Animation

  --------------------------------------------------------------------*/
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
    tl.fromTo('h1 .t', { y: '100%' }, { y: '-100%', duration: 1.5, ease: 'expo.out', stagger: 0.02 });
  }, 50);
  //setting
  const images = document.querySelectorAll('.js-work__item');
  const count = images.length;
  images.forEach((img, i) => {
    console.log(img);

    img.style.position = 'absolute';
    img.style.top = `${(100 / count) * i}%`;
  });
  
  
  
  
  
  //
  const imgs = document.querySelectorAll('.js-work-image div');
  imgs.forEach((img, i) => {
     gsap.set(img.querySelector('.gl-i'), { opacity: 0 });
    
  });

  
}
export function destroy(data) {
  APP.koalaVisibleChecker.onDestroy();
  APP.smoothScroller.onDestroy();
  APP.koalaThree.onDestroy()
  // APP.koalaHorizonScroll.onDestroy();
  // APP.koalaMarquee.onDestroy();
}
export { APP };
