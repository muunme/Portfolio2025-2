/*!
 * Koala-HorizonScroll
 *
 * @version: v0.0.1
 * @date   : 2024-5-7
 * @license: Copyright (c) 2024 KOALA
 *
 **/
export default class KoalaHorizonScroll {
  constructor(opts) {
    this.opts = {
      scrollWrap: opts?.scrollWrap ?? 'document',
      target: opts?.target ?? '.js-hr',
      wrap: opts?.wrap ?? '.js-hr__wrap',
      item: opts?.item ?? '.js-hr__item',
    };
  }

  onInit(data) {
    this.data = data || document;
    this.targets = [...this.data.querySelectorAll(this.opts.target)];

    if (!this.targets || this.targets.length === 0) return;
    console.log('%c Init %c %c KoalaHorizonScroll %c', 'color:white; background-color:#2870ed; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');
    this.sections = [];
    this.targets.forEach((target) => {
      const wrap = target.querySelector(this.opts.wrap);
      const items = [...target.querySelectorAll(this.opts.item)];

      const width = items.reduce((acc, item) => acc + item.clientWidth, 0);
      wrap.style.width = `${width}px`;
      target.style.height = `${width - _w + _h}px`;

      this.sections.push({ target, wrap, width });
    });

    // スクロールイベントを一括で管理
    const scrollElement = this.data.querySelector(this.opts.scrollWrap);
    scrollElement.addEventListener('scroll', () => this.onScroll());
  }

  onScroll() {
    this.sections.forEach(({ target, wrap, width }) => {
      const top = target.getBoundingClientRect().top;
      const end = width - _w;

      if (top <= 0 && Math.abs(top) <= end) {
        wrap.style.transform = `translateX(${top}px)`;
      }
    });
  }

  onDestroy() {
    const scrollElement = this.data.querySelector(this.opts.scrollWrap);
    if (scrollElement) {
      scrollElement.removeEventListener('scroll', this._scrollHandler);
    }

    // スタイルや内部状態の初期化
    if (this.sections) {
      this.sections.forEach(({ wrap }) => {
        if (wrap) {
          wrap.style.transform = '';
          wrap.style.width = '';
        }
      });
    }

    this.sections = [];
    this.targets = [];

    console.log('%c DES %c %c KoalaHorizonScroll %c', 'color:white; background-color:#2a3354; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');
    // TODO: scrollイベントのremoveやstate初期化
  }
}
