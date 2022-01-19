import '../scss/app.scss';
import { gsap } from 'gsap';
import Swiper, { EffectFade, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-fade';
Swiper.use([EffectFade, Autoplay]);

function requireAll(r) {
  // get all svg
  r.keys().forEach(r);
}
requireAll(require.context('../images/svg/', true, /\.svg$/));
const preloader = document.querySelector('.preloader');
const preloaderText = document.querySelector('.preloader__text');
const preloaderLetter = document.querySelector('.preloader__text_letter');
const preloaderLetterWidth = getComputedStyle(preloaderLetter).width;
const preloaderTextHidden = document.querySelector('.preloader__text_hidden');
preloaderText.style.width = preloaderLetterWidth;
preloader.querySelector('.preloader__icon').classList.add('active');
const hiddenTextWidth = getComputedStyle(preloaderTextHidden).width;
preloaderText.style.width = `calc(${hiddenTextWidth} + ${preloaderLetterWidth} + 7px)`;

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
        }, 50 * (index + 1));
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
  tl.fromTo('.content', { scale: 0 }, { scale: 1 });
  tl.fromTo(
    '.button',
    {
      opacity: 0,
    },
    {
      opacity: 1,
    }
  );
  tl.fromTo(
    '.slider',
    {
      opacity: 0,
    },
    {
      opacity: 1,
      onComplete: function () {
        const slider = new Swiper('.slider', {
          speed: 1000,
          effect: 'fade',
          fadeEffect: {
            crossFade: true,
          },
          autoplay: {
            delay: 2555,
            disableOnInteraction: false,
          },
        });
        if (window.innerWidth >= 1024) {
          slider.autoplay.stop();
          const sliderContainer = document.querySelector('.slider');
          sliderContainer.addEventListener('mouseenter', () => {
            slider.autoplay.start();
          });
          sliderContainer.addEventListener('mouseleave', () => {
            slider.autoplay.stop();
          });
        }
      },
    }
  );
});
