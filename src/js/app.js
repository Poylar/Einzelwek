import '../scss/app.scss';
import { gsap } from 'gsap';

function requireAll(r) {
  // get all svg
  r.keys().forEach(r);
}
requireAll(require.context('../images/svg/', true, /\.svg$/));
window.onload = () => {
  const preloader = document.querySelector('.preloader');
  const preloaderText = document.querySelector('.preloader__text');
  const preloaderLetter = document.querySelector('.preloader__text_letter');
  const preloaderLetterWidth = getComputedStyle(preloaderLetter).width;
  const preloaderTextHidden = document.querySelector('.preloader__text_hidden');
  console.log(preloaderLetter, preloaderLetterWidth);
  preloaderText.style.width = preloaderLetterWidth;
  preloader.querySelector('.preloader__text_hidden').classList.add('active');
  const hiddenTextWidth = getComputedStyle(preloaderTextHidden).width;
  setTimeout(() => {
    preloaderText.style.width = `calc(${hiddenTextWidth} + ${preloaderLetterWidth} + 7px)`;
    preloader.querySelector('.preloader__icon').classList.add('active');
  }, 1000);
  preloaderText.addEventListener('transitionend', () => {
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
          }, 70 * (index + 1));
        });
        document.querySelectorAll('.card__item').forEach((elem) => {
          elem.classList.add('active');
        });
      },
    });
    tl.fromTo(
      '.opacity-show',
      {
        opacity: 0,
      },
      {
        opacity: 1,
        stagger: 0.3,
      }
    );
    tl.fromTo(
      '.content',
      { scale: 0 },
      {
        scale: 1,
        onComplete: () => {
          document.querySelector('.inner__video').play();
        },
      }
    );
  });
};

document.addEventListener('click', (e) => {
  if (e.target.closest('.header__lang')) {
    document.querySelector('.header__lang').classList.toggle('open');
  }
});
