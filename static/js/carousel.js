const LEFT_SIDE_MOTION = 'LEFT_SIDE_MOTION';
const RIGHT_SIDE_MOTION = 'RIGHT_SIDE_MOTION';

const LEFT_POSITION = '-100%';
const RIGHT_POSITION = '100%';
const CENTER_POSITION = '0';

const DEFAULT_ANIMATION_DURATION = 1500;
const DISABLE_TRANSITION = 'none';
const ENABLE_TRANSITION = `all ${DEFAULT_ANIMATION_DURATION}ms`;

const DEFAULT_CAROUSEL_CONTAINER_CLASS = 'carousel-container'

const DEFAULT_SLIDE_CLASS = 'carousel-slide';
const LEFT_SLIDE_CLASS = 'left-carousel-slide';
const RIGHT_SLIDE_CLASS = 'right-carousel-slide';
const CENTER_SLIDE_CLASS = 'center-carousel-slide';
const ANOTHER_SLIDE_CLASS = 'hide-carousel-slide';

const BUTTON_CLASS = 'carousel-button';
const BUTTON_LEFT_CLASS = 'carousel-button-left';
const BUTTON_RIGHT_CLASS = 'carousel-button-right';

const DOTS_CONTAINER_HIDE_CLASS = 'carousel-dots-container-hide';

const DOTS_CONTAINER_CLASS = 'carousel-dots-container';
const DOT_CLASS = 'carousel-dot';
const DOT_ACTIVE_CLASS = 'carousel-active-dot';

const FIRST_ELEMENT_INDEX = 0;
const SECOND_ELEMENT_INDEX = 1;

const DEFAULT_DELAY = 50;

class SliderUtil {
    static isLeft(slider) {
        return slider.isLeft;
    }

    static isRight(slider) {
        return slider.isRight;
    }
}

class Slider {
    element;

    isLeft = false;
    isCenter = false;
    isRight = false;

    constructor(element) {
        this.element = element;
        this.element.classList.add()
    }


    addClasses(...classes) {
        this.element.classList.add(...classes);
    }

    removeClasses(...classes) {
        this.element.classList.remove(...classes)
    }

    moveOn(side) {
        this.element.style.transform = `translateX(${side})`;
    }

    enableAnimation() {
        this.element.style.transition = ENABLE_TRANSITION;
    }

    disableAnimation() {
        this.element.style.transition = DISABLE_TRANSITION;
    }

    makeHide() {
        this.addClasses(ANOTHER_SLIDE_CLASS);
    }

    makeVisible() {
        this.removeClasses(ANOTHER_SLIDE_CLASS);
    }

    makeCenter() {
        this.resetPositionStatus();
        this.isCenter = true;
        this.addClasses(CENTER_SLIDE_CLASS);
        this.removeClasses(LEFT_SLIDE_CLASS, RIGHT_SLIDE_CLASS);
    }

    makeLeft() {
        this.resetPositionStatus();
        this.isLeft = true;
        this.addClasses(LEFT_SLIDE_CLASS);
        this.removeClasses(CENTER_SLIDE_CLASS, RIGHT_SLIDE_CLASS);
    }

    makeRight() {
        this.resetPositionStatus();
        this.isRight = true;
        this.addClasses(RIGHT_SLIDE_CLASS);
        this.removeClasses(CENTER_SLIDE_CLASS, LEFT_SLIDE_CLASS);
    }

    resetPositionStatus() {
        this.isCenter = false;
        this.isLeft = false;
        this.isRight = false;
    }
}

class Dots {
    container;
    dots = [];
    currentActive = FIRST_ELEMENT_INDEX;
    handlers = [];

    constructor(element) {
        this.container = document.createElement('div');
        this.container.classList.add(DOTS_CONTAINER_CLASS);
        for (let slide of element.children) {
            const dot = this.createDot();
            this.container.appendChild(dot);
            this.dots.push(dot);
            const currentDotIndex = this.dots.length - 1;
            dot.addEventListener('click', () => {
                this.changeActiveDot(currentDotIndex)
                this.triggerHandlers()
            })
        }
        this.changeActiveDot(FIRST_ELEMENT_INDEX);
        element.appendChild(this.container);
    }

    createDot() {
        const span = document.createElement('span');
        span.classList.add(DOT_CLASS);
        return span;
    }

    hideContainer() {
        this.container.classList.add(DOTS_CONTAINER_HIDE_CLASS);
    }

    showContainer() {
        this.container.classList.remove(DOTS_CONTAINER_HIDE_CLASS);
    }

    changeActiveDot(index) {
        if (this.dots[index].classList.contains(DOT_ACTIVE_CLASS)) {
            return;
        }
        const previousActive = this.currentActive;
        this.currentActive = index;
        this.dots[previousActive].classList.remove(DOT_ACTIVE_CLASS);
        this.dots[this.currentActive].classList.add(DOT_ACTIVE_CLASS);
    }

    triggerHandlers() {
        this.handlers.forEach((handler) => {
            handler({
                current: this.dots[this.currentActive],
                index: this.currentActive,
            })
        })
    }

    addChangeDotListener(handler) {
        this.handlers.push(handler)
    }
}

class Carousel {
    ANIMATION_QUEUE = [];

    isMotionAnimationContinuous = false;

    carouselElement;
    buttonLeft;
    buttonRight;
    dotsElement;

    sliders = [];

    options = {
        infinite: false,
        showDots: false,
        disable: false,
    };

    currentSliderIndex;

    constructor(element, options) {
        this.carouselElement = element instanceof HTMLElement ? element : document.getElementById(element);
        this.options = { ...this.options, ...options };
        if (this.carouselElement.children.length >= 2) {
            this.initialSliders();
            this.initialDots();
            this.initialArrows();
            if (this.options.disable) {
                this.disable();
            } else {
                this.enable();
            }
            this.checkArrowsVisibility();
            if (!this.options.showDots) {
                this.dotsElement.hideContainer();
            }
        }
    }

    adjustSlidersClasses() {
        this.hideAnotherSliders();
        this.currentSlider.makeCenter();
        this.nextSlider.makeRight();
        if (this.previousSliderIndex !== this.currentSliderIndex) {
            this.previousSlider.makeLeft();
        }
    }

    initialSliders() {
        for (let child of this.carouselElement.children) {
            this.sliders.push(new Slider(child));
        }
        this.currentSliderIndex = FIRST_ELEMENT_INDEX;
        this.adjustSlidersClasses();
    }

    initialArrows() {
        this.buttonLeft = this.createArrowWith(BUTTON_LEFT_CLASS);
        this.buttonRight = this.createArrowWith(BUTTON_RIGHT_CLASS);

        this.buttonRight.addEventListener('click', this.moveSlidersOn(RIGHT_SIDE_MOTION));
        this.buttonLeft.addEventListener('click', this.moveSlidersOn(LEFT_SIDE_MOTION));

        this.carouselElement.appendChild(this.buttonLeft);
        this.carouselElement.appendChild(this.buttonRight);
    }

    checkArrowsVisibility() {
        if (!this.options.infinite) {
            this.buttonLeft.style.display = this.isFirstSlider ? 'none' : null;
            this.buttonRight.style.display = this.isLastSlider ? 'none' : null;
        }
    }

    createArrowWith(elementClass) {
        const a = document.createElement('a');
        a.classList.add(BUTTON_CLASS, elementClass);
        return a;
    }

    initialDots() {
        this.dotsElement = new Dots(this.carouselElement);
        this.dotsElement.changeActiveDot(this.currentSliderIndex);
        this.dotsElement.addChangeDotListener(async ({ index }) => {
            this.currentSliderIndex = index;
            this.disableAnimation();
            this.adjustSlidersClasses();
            await this.changeAsyncAnimationState(this.enableAnimation);
        })
    }

    moveSlidersOn(sideMotion) {
        return () => {
            if (this.isMotionAnimationContinuous) {
                this.ANIMATION_QUEUE.push(this.moveSlide(sideMotion));
            } else {
                this.isMotionAnimationContinuous = true;
                this.moveSlide(sideMotion)();
            }
        }
    }

    get nextSliderIndex() {
        if (this.options.infinite) {
            return this.currentSliderIndex === this.sliders.length - 1
                ? FIRST_ELEMENT_INDEX
                : this.currentSliderIndex + 1;
        }
        return this.currentSliderIndex === this.sliders.length - 1
            ? this.sliders.length - 1
            : this.currentSliderIndex + 1;
    }

    get previousSliderIndex() {
        if (this.options.infinite) {
            return this.currentSliderIndex <= FIRST_ELEMENT_INDEX
                ? this.sliders.length - 1
                : this.currentSliderIndex - 1;
        }
        return this.currentSliderIndex <= FIRST_ELEMENT_INDEX
            ? FIRST_ELEMENT_INDEX
            : this.currentSliderIndex - 1;
    }

    get nextSlider() {
        return this.sliders[this.nextSliderIndex];
    }

    get previousSlider() {
        return this.sliders[this.previousSliderIndex];
    }

    get currentSlider() {
        return this.sliders[this.currentSliderIndex];
    }

    get anotherSliders() {
        return [...this.leftSliders, ...this.rightSliders];
    }

    get activeSliders() {
        return this.sliders.slice(
            this.isFirstSlider ? FIRST_ELEMENT_INDEX : this.previousSliderIndex,
            this.isLastSlider ? this.sliders.length - 1 : this.nextSliderIndex + 1,
        );
    }

    get rightSliders() {
        return this.sliders.slice(this.nextSliderIndex, this.sliders.length);
    }

    get leftSliders() {
        return this.sliders.slice(FIRST_ELEMENT_INDEX, this.previousSliderIndex);
    }

    get isFirstSlider() {
        return this.currentSliderIndex === FIRST_ELEMENT_INDEX;
    }

    get isLastSlider() {
        return this.currentSliderIndex === this.sliders.length - 1;
    }

    enableAnimation() {
        this.sliders.forEach((slider) => slider.enableAnimation());
    }

    disableAnimation() {
        this.sliders.forEach((slider) => slider.disableAnimation());
    }

    incrementIndex() {
        this.currentSliderIndex = this.isLastSlider ? FIRST_ELEMENT_INDEX : this.currentSliderIndex + 1;
    }

    decrementIndex() {
        this.currentSliderIndex = this.isFirstSlider ? this.sliders.length - 1 : this.currentSliderIndex - 1;
    }

    moveSlideBy(sideMotions) {
        if (sideMotions === RIGHT_SIDE_MOTION) {
            this.incrementIndex();
            this.previousSlider.makeLeft();
        } else if (sideMotions === LEFT_SIDE_MOTION) {
            this.decrementIndex();
            this.nextSlider.makeRight();
        }
        this.currentSlider.makeCenter();
    }

    hideAnotherSliders() {
        this.leftSliders.forEach((slider) => slider.makeLeft());
        this.rightSliders.forEach((slider) => slider.makeRight());
    }

    waitEndAnimation() {
        return new Promise((resolve) => setTimeout(resolve, DEFAULT_ANIMATION_DURATION))
    }

    isCanMoveTo(sideMotions) {
        if (this.options.infinite) {
            return true;
        }
        if (sideMotions === RIGHT_SIDE_MOTION) {
            return !this.isLastSlider;
        }
        if (sideMotions === LEFT_SIDE_MOTION) {
            return !this.isFirstSlider;
        }
    }

    changeAsyncAnimationState(animationHandler) {
        return new Promise((resolve) => {
            setTimeout(() => {
                animationHandler.call(this)
                resolve()
            }, DEFAULT_DELAY);
        });
    }

    async fixSlidersPositionBy(sideMotions) {
        this.disableAnimation();
        if (sideMotions === RIGHT_SIDE_MOTION) {
            this.nextSlider.makeRight();
        }
        if (sideMotions === LEFT_SIDE_MOTION) {
            this.previousSlider.makeLeft();
        }
        await this.changeAsyncAnimationState(this.enableAnimation);
    }

    moveSlide(sideMotions) {
        return async () => {
            if (!this.isCanMoveTo(sideMotions)) {
                throw new Error(`Can not move in ${sideMotions}`);
            }
            await this.enableAnimation();
            if (this.options.infinite) {
                await this.fixSlidersPositionBy(sideMotions);
            }
            this.moveSlideBy(sideMotions);
            if (this.options.showDots) {
                this.dotsElement.changeActiveDot(this.currentSliderIndex);
            }
            this.checkArrowsVisibility();
            await this.waitEndAnimation(sideMotions);
            this.checkQueue();
        }
    }

    checkQueue() {
        if (this.ANIMATION_QUEUE.length) {
            const moveSlide = this.ANIMATION_QUEUE.shift();
            try {
                moveSlide();
            } catch (e) {
                this.checkQueue()
            }
        } else {
            this.isMotionAnimationContinuous = false;
        }
    }

    disable() {
        this.options.disable = true;
        this.buttonLeft.style.display = 'none';
        this.buttonRight.style.display = 'none';
        this.dotsElement.hideContainer();
        this.carouselElement.classList.remove(DEFAULT_CAROUSEL_CONTAINER_CLASS);
        this.sliders.forEach((slider) => slider.removeClasses(DEFAULT_SLIDE_CLASS));
    }

    enable() {
        this.options.disable = false;
        this.buttonLeft.style.display = null;
        this.buttonRight.style.display = null;
        this.dotsElement.showContainer();
        this.carouselElement.classList.add(DEFAULT_CAROUSEL_CONTAINER_CLASS);
        this.sliders.forEach((slider) => slider.addClasses(DEFAULT_SLIDE_CLASS));
    }
}

const requireStyle = document.createElement('style');
requireStyle.innerHTML = `
.carousel {
    position: relative;
    display: inline-flex;
    overflow: hidden;
    margin: auto;
    width: 100%;
}

.carousel-container {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
}

.carousel-slide {
    position: absolute;
    display: inline-block;
    white-space: normal;
}

.left-carousel-slide {
    transform: translateX(-100%);
}

.right-carousel-slide {
    transform: translateX(100%);
}

.carousel-button {
    cursor: pointer;
    position: absolute;
    top: 50%;
    transition: 600ms ease;
    user-select: none;
}

.carousel-button-left {
    left: 25px;
    width: 0;
    height: 0;
    border-top: 25px solid transparent;
    border-bottom: 25px solid transparent;
    border-right: 25px solid gray;
}

.carousel-button-right {
    right: 25px;
    width: 0;
    height: 0;
    border-top: 25px solid transparent;
    border-bottom: 25px solid transparent;
    border-left: 25px solid gray;
}

.carousel-dots-container {
    text-align: center;
    position: absolute;
    width: 100%;
    bottom: 50px;
}

.carousel-dots-container-hide {
    display: none;
}

.carousel-dot {
    display: inline-block;
    cursor: pointer;
    height: 15px;
    width: 15px;
    margin: 0 5px;
    background-color: #FFFDFD;
    border-radius: 50%;
    transition: background-color 600ms ease;
}

.carousel-active-dot {
    background-color: #464547;
}

.hide-element {
    display: none;
}
            `;
document.head.appendChild(requireStyle);