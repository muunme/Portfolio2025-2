/*!
 * Koala-marquee
 *
 * @version: v0.2.1
 * @date   : 2025-03-31
 * @license: Copyright (c) 2024 KOALA
 * @description
 * 画像を無限に流すことのできるスクリプト
 * 自動/スクロール/dragに対応
 * @require
 * GSAP
 **/

import { log } from "three/src/nodes/TSL.js";

export default class KoalaMarquee {
  constructor(opts) {
    this.opts = {
      targetWrap: opts?.targetWrap ?? '.js-marquee',
      item      : opts?.item ?? '.js-marquee__item',
      inner     : opts?.inner ?? '.js-marquee__inner',
      auto      : opts?.auto ?? true,
      autoSpeed : opts?.autoSpeed ?? 0.3,
      drag      : opts?.drag ?? true,
      dragSpeed : opts?.dragSpeed ?? 1.5,
      scroll    : opts?.scroll ?? true,
      infinite  : opts?.infinite ?? true,                //未実装
      useLenis  : opts?.useLenis ?? false,
      useWheel  : opts?.useWheel ?? true,
    };
    
    
  }
  onInit(data) {
    this.data = data || document;
    this.slider = [...this.data.querySelectorAll(this.opts.targetWrap)];
    if (!this.slider || this.slider.length === 0) return;
    console.log('%c Init %c %c KoalaMarquee %c', 'color:white; background-color:#2870ed; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');
    this.onSet();
  }
  onSet() {
    this.slider.forEach((element) => {
      this.slide = element.querySelectorAll(this.opts.item);
      this.slideLength = this.slide.length;
      this.sliderBottom = element.getBoundingClientRect().bottom;
      this.slideWidth = element.querySelector(this.opts.item).clientWidth;
      this.slideHeight = element.querySelector(this.opts.item).clientHeight;
      // addClone
      Array.from({ length: 1 }).forEach(() => {
        this.slide.forEach((slide) => {
          const clone = slide.cloneNode(true);
          element.append(clone);
        });
      });
      // addPos
      this.slide = element.querySelectorAll(this.opts.item);
      
      this.set = new KoalaMarqueeFunc(
        {
          slider     : element,
          slide      : this.slide,
          slideWidth : this.slideWidth,
          slideHeight: this.slideHeight,
          slideLength: this.slideLength,
          auto       : this.opts.auto,
          autoSpeed  : this.opts.autoSpeed,
          drag       : this.opts.drag,
          dragSpeed  : this.opts.dragSpeed,
          scroll     : this.opts.scroll,
          itemClass  : this.opts.item,
          useLenis   : this.opts.useLenis,
          useWheel   : this.opts.useWheel,
        },
        this.app
      );
    });
  }
  onDestroy() {
    this.set.onDestroy()
    delete this.set;
    console.log('%c DES %c %c KoalaMarquee %c', 'color:white; background-color:#2a3354; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');

  }
  setApp(app) {
    this.app = app;
    
  }
}

class KoalaMarqueeFunc {
  constructor(obj, app) {
    this.app = app;
    // this.velocity = this.app?.smoothScroller?.velocity?.() || 0;
    // console.log(this.velocity);
    
    //set
    _DETECT.click            = true;
    this.slider              = obj.slider;
    this.slide               = obj.slide;
    this.slideWidth          = obj.slideWidth;
    this.slideHeight         = obj.slideHeight;
    this.slideLength         = obj.slideLength;
    this.autoSlide           = obj.auto;
    this.autoSpeed           = obj.autoSpeed;
    this.drag                = obj.drag;
    this.dragSpeed           = obj.dragSpeed;
    this.scroll              = obj.scroll;
    this.itemClass           = obj.itemClass;
    this.useLenis            = obj.useLenis;
    this.useWheel            = obj.useWheel;
    this.nm                  = 0;
    this.nmTarget            = 0;
    this.onView              = false;
    this.nmPw                = 0.5;
    this.dragPw              = { x: 0 };
    this.slider.style.height = `${this.slideHeight}px`;
    this.isTouchDevice       = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    for (let index = 0; index < this.slide.length; index++) {
      const element = this.slide[index];
    }
    //Set
    this.raf = this.raf.bind(this);
    this.slideWidthVW = this.getPxByVw(this.slideWidth);

    //Drag
    if (this.drag) {
      if (this.isTouchDevice) {
        this.addTouchEvents(this.slider);
      } else {
        this.addMouseEvents(this.slider);
      }
    }

    //viewCheck
    //lenisの場合はlenisから回す
    this.handleIntersection = this.handleIntersection.bind(this);
    this.observer = new IntersectionObserver(this.handleIntersection);
    this.observer.observe(this.slider);
    gsap.ticker.fps(60);
    gsap.ticker.lagSmoothing(1000, 16);
    gsap.ticker.add(this.raf);

    if (this.scroll && this.useWheel) {
      this.handleWheel = this.handleWheel.bind(this);
      window.addEventListener('wheel', this.handleWheel);
    }

    //event
    window.addEventListener('resize', () => {
      this.onResize();
    });
  }
  getPxByVw(px = 0, width = window.innerWidth) {
    const fvw = px / (width / 100);
    return fvw;
  }
  raf() {
    if (!this.onView) return;
    this.nm += (this.nmTarget - this.nm) * .08; // linear interpolation
    if (this.autoSlide) {
      
      if (this.isTouchDevice) {
        this.nm -= this.autoSpeed;
      } else {
        if (this.scroll) {
          if (this.useLenis) {
            this.velocity = this.app?.smoothScroller?.velocity?.() || 0;
            this.nmTarget -= this.autoSpeed + this.velocity * 1.5;
          } else {
            this.nmTarget -= this.autoSpeed;
          }
        }
      }
    }
    for (let index = 0; index < this.slide.length; index++) {
      let element = this.slide[index];
      let firstPos = this.slideWidth * index - this.slideWidth * this.slideLength;
      let maxPos = this.slideWidth * this.slide.length;
      let current = ((firstPos + ((this.nm + this.dragPw.x) % maxPos)) / window.innerWidth) * 100;

      const currentPos = () => {
        if (current < this.slideWidthVW * this.slideLength * -1) {
          current = current + this.getPxByVw(maxPos);
          return current;
        } else if (current > 100 + this.slideWidthVW) {
          current = current - this.getPxByVw(maxPos);
          return current;
        } else {
          return current;
        }
      };

      element.style.transform = `translate3d(${Math.round(currentPos() * 100) / 100}vw,0,0)`;
    }
  }
  handleIntersection(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.onView = true;
      } else {
        this.onView = false;
      }
    });
  }
  addMouseEvents(elm) {
    //
    this.start = false;
    this.startPos = 0;
    this.endPos = 0;
    this.ing = 0;
    this.min = 0;
    this.max = 0;

    const onMousedown = (e) => {
      this.start = true;
      this.startPos = e.clientX;
      this.slider.classList.add('is-dragging');
    };
    const onMousemove = (e) => {
      if (this.start) {
        var x = this.endPos + (e.clientX - this.startPos);
        this.ing = x;
        gsap.to(this.dragPw, { ease: 'expo.out', duration: 1, x: this.ing * this.dragSpeed });
        if (Math.abs(this.ing) > 20) {
          _DETECT.click = false;
        }
      }
    };

    const onMouseup = (e) => {
      this.start = false;
      setTimeout(() => {
        _DETECT.click = true;
      }, 200);
      this.slider.classList.remove('is-dragging');
      this.endPos = this.ing;
    };
    const onMouseleave = (e) => {
      this.start = false;
      this.slider.classList.remove('is-dragging');
      this.endPos = this.ing;
      setTimeout(() => {
        _DETECT.click = true;
      }, 200);
    };

    this.slider.addEventListener('mousedown', onMousedown);
    this.slider.addEventListener('mousemove', onMousemove);
    this.slider.addEventListener('mouseup', onMouseup);
    this.slider.addEventListener('mouseleave', onMouseleave);
  }
  addTouchEvents(elm) {
    //
    this.start = false;
    this.startPos = 0;
    this.endPos = 0;
    this.ing = 0;
    this.min = 0;
    this.max = 0;

    const onTouchstart = (e) => {
      this.start = true;
      this.startPos = e.touches[0].clientX;
      this.slider.classList.add('is-dragging');
    };
    const onTouchmove = (e) => {
      if (this.start) {
        var x = this.endPos + (e.touches[0].clientX - this.startPos);
        this.ing = x;
        _DETECT.click = false;
        gsap.to(this.dragPw, { ease: 'expo.out', duration: 1, x: this.ing * 1.5 });
      }
    };
    const onTouchend = (e) => {
      this.start = false;
      setTimeout(() => {
        _DETECT.click = true;
      }, 200);
      this.slider.classList.remove('is-dragging');
      this.endPos = this.ing;
    };

    this.slider.addEventListener('touchstart', onTouchstart);
    this.slider.addEventListener('touchmove', onTouchmove);
    this.slider.addEventListener('touchend', onTouchend);
  }
  onResize() {
    // console.log(this.slideHeight);
    this.slideWidth = this.slider.querySelector(this.itemClass).clientWidth;
    this.slideHeight = this.slider.querySelector(this.itemClass).clientHeight;
    this.slider.style.height = `${this.slideHeight}px`;
    console.log('%c Event %c %c onResize %c  %c KoalaMarquee %c', 'color:white; background-color:#439160; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#439160; border:1px solid #439160; padding:0px 1px;  border-radius:4px;', '', 'color:#91e5ff;', '');
  }
  handleWheel(e) {
    const delta = e.deltaY || e.wheelDeltaY || (-e.wheelDelta);
    const direction = delta > 0 ? -1 : 1;
    // this.nmTarget += direction * this.slideWidth * .01;
    this.nmTarget += direction - delta;

    // const maxDelta = this.slideWidth * 0.05; // 最大移動幅
    // const movement = direction * this.slideWidth * 0.03;
    // const clampedMovement = Math.max(-maxDelta, Math.min(movement, maxDelta));
    // this.nmTarget += clampedMovement;
  }
  onDestroy() {
    // this.app=null
    // this.slider.removeEventListener('mousedown', this.onMousedown);
    // this.slider.removeEventListener('mousemove', this.onMousemove);
    // this.slider.removeEventListener('mouseup', this.onMouseup);
    // this.slider.removeEventListener('mouseleave', this.onMouseleave);
    // this.slider.removeEventListener('touchstart', this.onTouchstart);
    // this.slider.removeEventListener('touchmove', this.onTouchmove);
    // this.slider.removeEventListener('touchend', this.onTouchend);
    // window.removeEventListener('resize', this.onResize);
    if (this.handleWheel) {
      window.removeEventListener('wheel', this.handleWheel);
    }
    gsap.ticker.remove(this.raf);
    this.observer.disconnect();
    console.log('%c DES %c %c KoalaMarqueeFunc %c', 'color:white; background-color:#2a3354; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');

  }
}
