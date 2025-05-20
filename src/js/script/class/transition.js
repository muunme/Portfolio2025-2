/*

PageTransition

--------------------------------------------------------------------*/
import { APP } from '../init';
import { initAPP } from '../init';
import { initOnce } from '../init';
import { onDestroy } from '../init';
import { enterAnimation } from '../animaton';

export default class PageTransition {
  constructor() {
    console.log('%c Set %c %c pageTransition %c', 'color:white; background-color:#56b2e3; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');

    //--setting
    const _this                = this;
    this.prefix          = 'data-xhr';
    this.timeout         = 5000;
    this.previousPageURL = null;
    this.currentPageURL  = null;
    this.barbaDebug      = true; // <=debug

    /*--------------------------------------

      Start

    --------------------------------------*/
    barba.use(barbaPrefetch);
    barba.init({
      debug: this.barbaDebug,
      schema: { prefix: this.prefix, timeout: this.timeout },
      transitions: [
        {
          once(data) {
            console.log('%c PAGE %c %c Once %c', 'color:white; background-color:#de9e1d; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');
            _this.pageInfo(data);
            _this.sameLink(data);
            setTimeout(() => {
              initOnce(data);
              initAPP(data);
            }, 50);
          },
          /*--------------------------------------
          ここからサイクル
          --------------------------------------*/
          before(data) {
            _DETECT.isTransition = true;
            console.log('%c PAGE %c %c Before %c', 'color:white; background-color:#de9e1d; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');
            document.querySelector('html').classList.add('is-transition');
          },
          beforeLeave(data) {
            console.log('%c PAGE %c %c BeforeLeave %c', 'color:white; background-color:#de9e1d; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');
          },
          beforeOnce(data) {
            console.log('%c PAGE %c %c BeforeOnce %c', 'color:white; background-color:#de9e1d; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');
          },
          leave(data) {
            console.log('%c PAGE %c %c Leave %c', 'color:white; background-color:#de9e1d; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');
          },
          /*--------------------------------------
          ここからNext
          --------------------------------------*/
          beforeEnter(data) {
            console.log('%c PAGE %c %c BeforeEnter %c', 'color:white; background-color:#de9e1d; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');
            const oldContainer = data.current.container;
            const oldContainerName = data.current.namespace;
            const newContainer = data.next.container;
            const newContainerName = data.next.namespace;
            // _this.pageInfo(data);
            // _this.sameLink(data);
            onDestroy(data);
            initAPP(data);
          },
          async enter(data) {
            console.log('%c PAGE %c %c Enter %c', 'color:white; background-color:#de9e1d; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');
            const done = this.async();
            enterAnimation(data.current.container, data.next.container, done, data);
          },
          async afterEnter(data) {
            console.log('%c PAGE %c %c AfterEnter %c', 'color:white; background-color:#de9e1d; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');
            const oldContainer = data.current.container;
            const oldContainerName = data.current.namespace;
            const newContainer = data.next.container;
            const newContainerName = data.next.namespace;
            setTimeout(() => {
              oldContainer.classList.remove('js-old');
              newContainer.classList.remove('js-new');
            }, 500);
          },
          /*--------------------------------------
          Before消滅
          --------------------------------------*/
          async after(data) {
            console.log('%c PAGE %c %c After %c', 'color:white; background-color:#de9e1d; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');
            this.previousPageURL = data.current.url.href;
            this.currentPageURL  = data.next.url.href;
            _DETECT.isTransition = false;
            document.querySelector('html').classList.remove('is-transition');
          },
        },
      ],
    });

    /*-------------------------------------- 
    
     ブラウザボタンを利用した際にスクロールいちを復元しない設定 / Head更新 / 
    
    --------------------------------------*/
    this.scPosY = 0;
    history.scrollRestoration = 'manual';
    barba.hooks.enter((data) => {
      if (data.trigger !== 'back') {
        this.scPosY = barba.history.current.scroll.y;
      }
    });
    barba.hooks.after((data) => {
      if (data.trigger !== 'back') {
        window.scrollTo(0, 0);
      }
    });

    /*-------------------------------------- 
    
      Tags update  
    
    --------------------------------------*/
    // const replaceHead = function (data) {
    //   const head = document.head;
    //   const newPageRawHead = data.next.html.match(/]*>([\s\S.]*)<\/head>/i)[0];
    //   const newPageHead = document.createElement('head');
    //   newPageHead.innerHTML = newPageRawHead;
    //   const removeHeadTags = ['meta[name="keywords"]', 'meta[name="description"]', 'meta[property^="og"]', 'meta[name^="twitter"]', 'meta[itemprop]', 'link[itemprop]', 'link[rel="prev"]', 'link[rel="next"]', 'link[rel="canonical"]', 'link[rel="alternate"]'].join(',');
    //   const headTags = head.querySelectorAll(removeHeadTags);
    //   const newHeadTags = newPageHead.querySelectorAll(removeHeadTags);
    //   for (let i = 0; i < headTags.length; i++) {
    //     head.removeChild(headTags[i]);
    //   }
    //   for (let i = 0; i < newHeadTags.length; i++) {
    //     head.appendChild(newHeadTags[i]);
    //   }
    // };
  }
  /*-------------------------------------- 
  
  PageInfo
  
  --------------------------------------*/
  pageInfo(data) {
    if (data.next.namespace === '404') return;
    _DETECT.page = data.next.namespace;
    // koalaUI.onNavTransition(); //animation

    let headerNav = document.querySelectorAll('.js-link');
    let addNavi = document.querySelectorAll(`[data-to=${data.next.namespace}]`);
    for (let index = 0; index < headerNav.length; index++) {
      const element = headerNav[index];
      element.classList.remove('is-nav');
    }
    for (let index = 0; index < addNavi.length; index++) {
      const element = addNavi[index];
      element.classList.add('is-nav');
    }
  }
  /*-------------------------------------- 
  
  SameLink
  
  --------------------------------------*/
  sameLink(data) {
    const links = document.querySelectorAll('a[href]');
    const removeTrailingSlash = (url) => {
      return url.endsWith('/') ? url.substr(0, url.length - 1) : url;
    };
    const eventDelete = (e) => {
      removeTrailingSlash(e.currentTarget.href);
      if (removeTrailingSlash(e.currentTarget.href) === removeTrailingSlash(window.location.href)) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    };
    links.forEach((link) => {
      link.addEventListener(
        'click',
        (e) => {
          eventDelete(e);
        },
        false
      );
    });
  }
}
