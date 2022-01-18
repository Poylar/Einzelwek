import '../scss/app.scss';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import imagesLoaded from 'imagesloaded';
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
  }, 400);
});

{
  class Slide {
    constructor(el) {
      this.DOM = { el: el };
      this.DOM.slideImg = this.DOM.el.querySelector('.slide__img');
      this.bgImage = this.DOM.slideImg.style.backgroundImage;
      this.layout();
    }
    layout() {
      this.DOM.slideImg.innerHTML = `<div class='glitch__img' style='background-image: ${this.DOM.slideImg.style.backgroundImage};'></div>`.repeat(5);
      this.DOM.glitchImgs = Array.from(this.DOM.slideImg.querySelectorAll('.glitch__img'));
    }
    changeBGImage(bgimage, pos = 0, delay = 0) {
      setTimeout(() => (this.DOM.glitchImgs[pos].style.backgroundImage = bgimage), delay);
    }
  }

  class GlitchSlideshow {
    constructor(el) {
      this.DOM = { el: el };
      this.DOM.slides = Array.from(this.DOM.el.querySelectorAll('.slide'));
      this.slidesTotal = this.DOM.slides.length;
      this.slides = [];
      this.DOM.slides.forEach((slide) => this.slides.push(new Slide(slide)));
      this.current = 0;
      this.glitchTime = 1800;
      this.totalGlitchSlices = 5;
    }
    glitch(slideFrom, slideTo) {
      return new Promise((resolve, reject) => {
        slideFrom.DOM.slideImg.classList.add('glitch--animate');

        const slideFromBGImage = slideFrom.bgImage;
        const slideToBGImage = slideTo.bgImage;

        for (let i = this.totalGlitchSlices - 1; i >= 0; --i) {
          slideFrom.changeBGImage(slideToBGImage, i, (this.glitchTime / (this.totalGlitchSlices + 1)) * (this.totalGlitchSlices - i - 1) + this.glitchTime / (this.totalGlitchSlices + 1));
        }

        setTimeout(() => {
          slideFrom.DOM.slideImg.classList.remove('glitch--animate');

          // reset bgimages.
          for (let i = this.totalGlitchSlices - 1; i >= 0; --i) {
            slideFrom.changeBGImage(slideFromBGImage, i, 0);
          }

          resolve();
        }, this.glitchTime);
      });
    }
    navigate(dir) {
      if (this.isAnimating) return;
      this.isAnimating = true;

      const newCurrent = dir === 'next' ? (this.current < this.slidesTotal - 1 ? this.current + 1 : 0) : this.current > 0 ? this.current - 1 : this.slidesTotal - 1;

      this.glitch(this.slides[this.current], this.slides[newCurrent]).then(() => {
        this.DOM.slides[this.current].classList.remove('slide--current');
        this.current = newCurrent;
        this.DOM.slides[this.current].classList.add('slide--current');
        this.isAnimating = false;
      });
    }
  }

  // Preload all the images in the page..
  imagesLoaded(document.querySelectorAll('.slide__img'), { background: true }, () => {
    document.body.classList.remove('loading');
    const slideshow = new GlitchSlideshow(document.querySelector('.slides'));
  
    setInterval(() => {
      slideshow.navigate('next');
    }, 4000);
  });
}
