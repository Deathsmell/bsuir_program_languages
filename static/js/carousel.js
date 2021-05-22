const leftSlide = document.getElementById('carousel-left-picture-id');
const rightSlide = document.getElementById('carousel-right-picture-id');
const centerSlide = document.getElementById('carousel-center-picture-id');
const buttonLeft = document.getElementById('carousel-left-button-id');
const buttonRight = document.getElementById('carousel-right-button-id');
const dotLeft = document.getElementById('carousel-dot-left-id');
const dotRight = document.getElementById('carousel-dot-right-id');

const LEFT_SIDE_MOTION = 'LEFT_SIDE_MOTION';
const RIGHT_SIDE_MOTION = 'RIGHT_SIDE_MOTION';

const ANIMATION_QUEUE = [];
let isMotionAnimationMoved = false;

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
    leftSlide.style.transition = transition;
    rightSlide.style.transition = transition;
    centerSlide.style.transition = transition;
}

const enableAnimation = () => {
    setCarouselTransition(ENABLE_TRANSITION)
}

const disableAnimation = () => {
    setCarouselTransition(DISABLE_TRANSITION)
}

const SLIDE_ELEMENT_BY = {
    [LEFT_SIDE_MOTION]: leftSlide,
    [RIGHT_SIDE_MOTION]: rightSlide,
}

const swapSoursPicture = (sideMotions) => {
    const element = SLIDE_ELEMENT_BY[sideMotions];
    const temp = centerSlide.src;
    centerSlide.src = element.src;
    leftSlide.src = temp;
    rightSlide.src = temp;
}

const restoreDefaultPosition = () => {
    moveSlideOn(leftSlide, LEFT_POSITION);
    moveSlideOn(centerSlide, CENTER_POSITION);
    moveSlideOn(rightSlide, RIGHT_POSITION);
}

const checkQueue = () => {
    if (ANIMATION_QUEUE.length) {
        const moveSlide = ANIMATION_QUEUE.shift();
        moveSlide();
    } else {
        isMotionAnimationMoved = false;
    }
}

const moveSlideOnLeft = () => {
    moveSlideOn(leftSlide, CENTER_POSITION)
    moveSlideOn(centerSlide, RIGHT_POSITION)
}

const moveSlideOnRight = () => {
    moveSlideOn(rightSlide, CENTER_POSITION)
    moveSlideOn(centerSlide, LEFT_POSITION)
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
    if (isMotionAnimationMoved) {
        ANIMATION_QUEUE.push(moveSlide(sideMotion));
    } else {
        isMotionAnimationMoved = true;
        moveSlide(sideMotion)();
    }
}

buttonRight.addEventListener('click', () => {
    moveOn(RIGHT_SIDE_MOTION);
})

buttonLeft.addEventListener('click', () => {
    moveOn(LEFT_SIDE_MOTION);
})


