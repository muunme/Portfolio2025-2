/*!
 * KoalaCurrentChecker
 *
 * @version: v0.1.2
 * @date   : 2025-04-1
 * @license: Copyright (c) 2025 KOALA
 *.js-current-trigger というDOMがあればそれをトリガー位置として使い、なければビューポート中央が基準になります。これでより柔軟な判定
 **/

 export default class KoalaCurrentChecker {
    constructor(opts) {
      this.opts = {
        targetWrap : opts?.targetWrap ?? '.js-current',
        targetItem : opts?.targetItem ?? '.js-current__item',
        mode       : opts?.mode ?? 'default',                       // 'default', 'nav', 'header'
        nav        : opts?.nav ?? '.js-current__nav',
        triggerItem: opts?.nav ?? '.js-current-trigger',
        header     : opts?.header ?? null,
        scrollY    : opts?.scrollY ?? (() => window.pageYOffset),
        checkFn    : opts?.checkFn ?? null,
      };
      this.items = [];
      this.current = null;
    }
  
    onInit(data) {
      this.data = data || document;
  
      // data-theme 属性を持つ要素を取得
      this.targetWrap = this.data.querySelectorAll(this.opts.targetWrap);
      if (!this.targetWrap || this.targetWrap.length === 0) return;
      console.log('%c Init %c %c KoalaCurrentChecker %c', 'color:white; background-color:#2870ed; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');
      this.items = [...this.data.querySelectorAll(this.opts.targetItem)];
      if (this.opts.mode === 'nav') {
        this.navItems = [...this.data.querySelectorAll(this.opts.nav)];
      }
      this.firstTop = this.items[0].getBoundingClientRect().top;
      this.scrollHandler = this.scrollHandler.bind(this);
      this.raf = null;
      // window.addEventListener('scroll', this.scrollHandler);
      this.data.querySelector('.js-wrapper').addEventListener('scroll', this.scrollHandler); //lenisに持たせる場合はlenisに
    }
    scrollHandler() {
      if (!this.raf) {
        this.raf = requestAnimationFrame(() => {
          this.checkCurrentThemeBasedOnHeight();
          this.raf = null;
        });
      }
    }
  
    checkCurrentThemeBasedOnHeight() {
  
      if (!this.items.length) return;
      let newCurrent = null;
  
      const wrapRect = this.data.querySelector(this.opts.targetWrap)?.getBoundingClientRect();
      const isWrapInView = wrapRect?.top < window.innerHeight && wrapRect?.bottom > 0;
  
      if (isWrapInView) {
        const triggerPos = document.querySelector(this.opts.triggerItem)?.getBoundingClientRect().top ?? window.innerHeight / 2;
  
        this.items.forEach((element, index) => {
          const rect = element.getBoundingClientRect();
          if (rect.top <= triggerPos && rect.bottom >= triggerPos) {
            newCurrent = String(index + 1);
          }
        });
      }
  
      if (newCurrent !== this.current || !isWrapInView) {
        if (!isWrapInView) {
          this.navItems.forEach((element) => {
            element.classList.remove('is-active');
          });
          this.current = null;
          return;
        }
        this.current = newCurrent;
  
        if (this.opts.mode === 'nav') {
          this.navItems.forEach((element, index) => {
            const id = String(index + 1);
            if (id === this.current) {
              element.classList.add('is-active');
            } else {
              element.classList.remove('is-active');
            }
          });
        }
  
        if (this.opts.mode === 'header' && this.opts.header) {
          const theme = this.items.find((el) => el.dataset.items === this.current)?.dataset.theme ?? 'light';
          const header = document.querySelector(this.opts.header);
          if (header) {
            header.dataset.theme = theme;
          }
        }
      }
    }
  
    onDestroy() {
      window.removeEventListener('scroll', this.scrollHandler);
      this.items = [];
      this.navItems = [];
      this.current = null;
      this.data = null;
      console.log('%c DES %c %c KoalaCurrentChecker %c', 'color:white; background-color:#2a3354; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');
  
    }
  }
  