import '../scss/app.scss';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);
function requireAll(r) {
  // get all svg
  r.keys().forEach(r);
}

requireAll(require.context('../images/svg/', true, /\.svg$/));
const preloader = document.querySelector('.preloader');
const preloaderText = document.querySelector('.preloader__text');
const preloaderLetter = document.querySelector('.preloader__text_letter');
const preloaderLetterWidth = preloaderLetter.getBoundingClientRect().width;
const preloaderTextHidden = document.querySelector('.preloader__text_hidden');
preloaderText.style.width = `${preloaderLetterWidth}px`;

setTimeout(() => {
  preloader.querySelector('.preloader__icon').classList.add('active');
  preloaderText.style.width = `${preloaderTextHidden.getBoundingClientRect().width + preloaderLetterWidth + 7}px`;
}, 500);

preloaderText.addEventListener('transitionend', () => {
  setTimeout(() => {
    const tl = gsap.timeline();
    tl.to(preloader, {
      yPercent: 3,
    });
    tl.to(preloader, {
      yPercent: -100,
      onComplete: function () {
        const i = document.querySelectorAll('.text');
        i.forEach((elem, index) => {
          setTimeout(() => {
            elem.style.transform = `translate3d(0px , 0%, 0px) rotate(0deg)`;
          }, 50 * (index + 1));
        });
        document.querySelector('.card-1').classList.add('active');
      },
    });
    tl.fromTo(
      '.opacity-show',
      {
        opacity: 0,
      },
      {
        opacity: 1,
        stagger: .3
      }
    );
  }, 400);
});
