/*

Import

--------------------------------------------------------------------*/

console.log('%c Set %c %c import.js %c', 'color:white; background-color:#56b2e3; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');

import device from 'current-device';
import gsap from 'gsap';
import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';
window.device = device;
window.gsap = gsap;
window.barba = barba;
window.barbaPrefetch = barbaPrefetch.default || barbaPrefetch;
