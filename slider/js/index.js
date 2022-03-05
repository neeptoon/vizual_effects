const sliderMain = new Swiper('.slider__main', {
    freeMode: true,
    centeredSlides: true,
    mousewheel: true,
    parallax: true,
    breakpoints: {
        0: {
            slidesPerView: 2.5,
            spaceBetween: 20,
        },
        680: {
            slidesPerView: 3.5,
            spaceBetween: 40,
        }
    }
})

const sliderBg = new Swiper('.slider__bg', {
    freeMode: true,
    centeredSlides: true,
    mousewheel: true,
    parallax: true,
    breakpoints: {
        0: {
            slidesPerView: 2.5,
            spaceBetween: 20,
        },
        680: {
            slidesPerView: 3.5,
            spaceBetween: 40,
        }
    }
});

sliderMain.controller.control = sliderBg;

