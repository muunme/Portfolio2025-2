/*

init

--------------------------------------------------------------------*/

console.log('%c Set %c %c init.js %c', 'color:white; background-color:#56b2e3; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');

import { initGlobals } from './init';
import { initOnce }    from './init';
import { initAPP }     from './init';
export { APP }         from './init';
import { onResize }    from './init';
import { onScroll }    from './init';

window.addEventListener('load', (e) => {
  //Barba.js
});
window.addEventListener('resize', (e) => {
  onResize();
});
window.addEventListener('scroll', () => {
  onScroll(document.querySelector('main').scrollY);
});
