import { destroy } from './init';
import { init }    from './init';
import { APP }     from './init';

export function enterAnimation(oldContainer, newContainer, done, data) {
  //set
  oldContainer.classList.add('js-old');
  newContainer.classList.add('js-new');

  //menu close
  // if (APP.koalaMenu.state.isOpen) {
  //   APP.koalaMenu.onClose();
  // }

  //Animation
  const anm = gsap.timeline();
  const onComplete = () => {
    document.querySelector('html').classList.remove('is-transition');
    return done();
  };
  anm.fromTo(oldContainer, 0.4, { opacity: 1 }, { opacity: 0 });
  anm.fromTo(newContainer, 1, { opacity: 0 }, { opacity: 1 }, '< 0.2');
  anm.to(oldContainer, 1.0, { onComplete: onComplete }, '');
}
