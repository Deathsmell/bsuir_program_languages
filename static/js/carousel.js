const slideLeft = document.getElementById('carousel-left-picture-id');
const slideRight = document.getElementById('carousel-right-picture-id');
const slideCenter = document.getElementById('carousel-center-picture-id');
const buttonLeft = document.getElementById('carousel-left-button-id');
const buttonRight = document.getElementById('carousel-right-button-id');
const dotLeft = document.getElementById('carousel-dot-left-id');
const dotRight = document.getElementById('carousel-dot-right-id');

const LEFT_SIDE_MOTION = 'LEFT_SIDE_MOTION';
const RIGHT_SIDE_MOTION = 'RIGHT_SIDE_MOTION';

const ANIMATION_QUEUE = [];
let isMotionAnimationContinious = false;

const LEFT_POSITION = '-100%';
const RIGHT_POSITION = '100%';
const CENTER_POSITION = '0';

const DEFAULT_ANIMATION_DURATION = 1500;
const DISABLE_TRANSITION = 'none';
const ENABLE_TRANSITION = `all ${DEFAULT_ANIMATION_DURATION}ms`;

const ACTIVE_DOT_CLASS = 'active-dot'

const moveSlideOn = (element, side) => {
    element.style.transform = `translateX(${side})`;
}

const setCarouselTransition = (transition) => {
    slideLeft.style.transition = transition;
    slideRight.style.transition = transition;
    slideCenter.style.transition = transition;
}

const enableAnimation = () => {
    setCarouselTransition(ENABLE_TRANSITION)
}

const disableAnimation = () => {
    setCarouselTransition(DISABLE_TRANSITION)
}

const SLIDE_ELEMENT_BY = {
    [LEFT_SIDE_MOTION]: slideLeft,
    [RIGHT_SIDE_MOTION]: slideRight,
}

const swapSoursPicture = (sideMotions) => {
    const element = SLIDE_ELEMENT_BY[sideMotions];
    const temp = slideCenter.src;
    slideCenter.src = element.src;
    slideLeft.src = temp;
    slideRight.src = temp;
}

const restoreDefaultPosition = () => {
    moveSlideOn(slideLeft, LEFT_POSITION);
    moveSlideOn(slideCenter, CENTER_POSITION);
    moveSlideOn(slideRight, RIGHT_POSITION);
}

const checkQueue = () => {
    if (ANIMATION_QUEUE.length) {
        const moveSlide = ANIMATION_QUEUE.shift();
        moveSlide();
    } else {
        isMotionAnimationContinious = false;
    }
}

const moveSlideOnLeft = () => {
    moveSlideOn(slideLeft, CENTER_POSITION)
    moveSlideOn(slideCenter, RIGHT_POSITION)
}

const moveSlideOnRight = () => {
    moveSlideOn(slideRight, CENTER_POSITION)
    moveSlideOn(slideCenter, LEFT_POSITION)
}

const MOVE_SLIDE_BY = {
    [LEFT_SIDE_MOTION]: moveSlideOnLeft,
    [RIGHT_SIDE_MOTION]: moveSlideOnRight,
}

const changeActiveDot = () => {
    if (dotLeft.classList.contains(ACTIVE_DOT_CLASS)) {
        dotLeft.classList.remove(ACTIVE_DOT_CLASS)
        dotRight.classList.add(ACTIVE_DOT_CLASS)
    } else {
        dotRight.classList.remove(ACTIVE_DOT_CLASS)
        dotLeft.classList.add(ACTIVE_DOT_CLASS)
    }
}

const moveSlide = (sideMotions) => () => {
    enableAnimation();
    changeActiveDot();
    MOVE_SLIDE_BY[sideMotions]();
    setTimeout(() => {
        disableAnimation();
        swapSoursPicture(sideMotions);
        restoreDefaultPosition();
        setTimeout(() => checkQueue(), 100);
    }, DEFAULT_ANIMATION_DURATION)
}

const moveOn = (sideMotion) => {
    if (isMotionAnimationContinious) {
        ANIMATION_QUEUE.push(moveSlide(sideMotion));
    } else {
        isMotionAnimationContinious = true;
        moveSlide(sideMotion)();
    }
}

buttonRight.addEventListener('click', () => {
    moveOn(RIGHT_SIDE_MOTION);
})

buttonLeft.addEventListener('click', () => {
    moveOn(LEFT_SIDE_MOTION);
})


