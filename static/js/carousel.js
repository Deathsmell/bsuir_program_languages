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
            this._initialSliders();
            this._initialDots();
            this._initialArrows();
            if (this.options.disable) {
                this.disable();
            } else {
                this.enable();
            }
            this._checkArrowsVisibility();
            if (!this.options.showDots) {
                this.dotsElement.hideContainer();
            }
        }
    }

    _adjustSlidersClasses() {
        this._currentSlider.makeCenter();
        this._nextSlider.makeRight();
        if (this.previousSliderIndex !== this.currentSliderIndex) {
            this._previousSlider.makeLeft();
        }
        this._hideAnotherSliders();
    }

    _initialSliders() {
        for (let child of this.carouselElement.children) {
            this.sliders.push(new Slider(child));
        }
        this.currentSliderIndex = FIRST_ELEMENT_INDEX;
        this._adjustSlidersClasses();
    }

    _initialArrows() {
        this.buttonLeft = this._createArrowWith(BUTTON_LEFT_CLASS);
        this.buttonRight = this._createArrowWith(BUTTON_RIGHT_CLASS);

        this.buttonRight.addEventListener('click', this._moveSlidersOn(RIGHT_SIDE_MOTION));
        this.buttonLeft.addEventListener('click', this._moveSlidersOn(LEFT_SIDE_MOTION));

        this.carouselElement.appendChild(this.buttonLeft);
        this.carouselElement.appendChild(this.buttonRight);
    }

    _checkArrowsVisibility() {
        if (!this.options.infinite && !this.options.disable) {
            this.buttonLeft.style.display = this._isFirstSlider ? 'none' : null;
            this.buttonRight.style.display = this._isLastSlider ? 'none' : null;
        }
    }

    _createArrowWith(elementClass) {
        const a = document.createElement('a');
        a.classList.add(BUTTON_CLASS, elementClass);
        return a;
    }

    _initialDots() {
        this.dotsElement = new Dots(this.carouselElement);
        this.dotsElement.changeActiveDot(this.currentSliderIndex);
        this.dotsElement.addChangeDotListener(async ({ index }) => {
            this.currentSliderIndex = index;
            this._disableAnimation();
            this._adjustSlidersClasses();
            await this._changeAsyncAnimationState(this._enableAnimation);
        })
    }

    _moveSlidersOn(sideMotion) {
        return () => {
            if (this.ANIMATION_QUEUE.length > 5) {
                return;
            }
            if (this.isMotionAnimationContinuous) {
                this.ANIMATION_QUEUE.push(this._moveSlide(sideMotion));
            } else {
                this.isMotionAnimationContinuous = true;
                this._moveSlide(sideMotion)();
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

    get _nextSlider() {
        return this.sliders[this.nextSliderIndex];
    }

    get _previousSlider() {
        return this.sliders[this.previousSliderIndex];
    }

    get _currentSlider() {
        return this.sliders[this.currentSliderIndex];
    }

    get _anotherSliders() {
        return [...this._leftSliders, ...this._rightSliders];
    }

    get _activeSliders() {
        return this.sliders.slice(
            this._isFirstSlider ? FIRST_ELEMENT_INDEX : this.previousSliderIndex,
            this._isLastSlider ? this.sliders.length - 1 : this.nextSliderIndex + 1,
        );
    }

    get _rightSliders() {
        return this.sliders
            .slice(this.nextSliderIndex, this.sliders.length)
            .filter((slider) => !slider.isCenter);
    }

    get _leftSliders() {
        return this.sliders.slice(FIRST_ELEMENT_INDEX, this.previousSliderIndex)
            .filter((slider) => !slider.isCenter);
    }

    get _isFirstSlider() {
        return this.currentSliderIndex === FIRST_ELEMENT_INDEX;
    }

    get _isLastSlider() {
        return this.currentSliderIndex === this.sliders.length - 1;
    }

    _enableAnimation() {
        this.sliders.forEach((slider) => slider.enableAnimation());
    }

    _disableAnimation() {
        this.sliders.forEach((slider) => slider.disableAnimation());
    }

    _incrementIndex() {
        this.currentSliderIndex = this._isLastSlider ? FIRST_ELEMENT_INDEX : this.currentSliderIndex + 1;
    }

    _decrementIndex() {
        this.currentSliderIndex = this._isFirstSlider ? this.sliders.length - 1 : this.currentSliderIndex - 1;
    }

    _moveSlideBy(sideMotions) {
        if (sideMotions === RIGHT_SIDE_MOTION) {
            this._incrementIndex();
            this._previousSlider.makeLeft();
        } else if (sideMotions === LEFT_SIDE_MOTION) {
            this._decrementIndex();
            this._nextSlider.makeRight();
        }
        this._currentSlider.makeCenter();
    }

    _hideAnotherSliders() {
        this._leftSliders.forEach((slider) => slider.makeLeft());
        this._rightSliders.forEach((slider) => slider.makeRight());
    }

    _waitEndAnimation() {
        return new Promise((resolve) => setTimeout(resolve, DEFAULT_ANIMATION_DURATION))
    }

    _isCanMoveTo(sideMotions) {
        if (this.options.infinite) {
            return true;
        }
        if (sideMotions === RIGHT_SIDE_MOTION) {
            return !this._isLastSlider;
        }
        if (sideMotions === LEFT_SIDE_MOTION) {
            return !this._isFirstSlider;
        }
    }

    _changeAsyncAnimationState(animationHandler) {
        return new Promise((resolve) => {
            setTimeout(() => {
                animationHandler.call(this)
                resolve()
            }, DEFAULT_DELAY);
        });
    }

    async fixSlidersPositionBy(sideMotions) {
        this._disableAnimation();
        if (sideMotions === RIGHT_SIDE_MOTION) {
            this._nextSlider.makeRight();
        }
        if (sideMotions === LEFT_SIDE_MOTION) {
            this._previousSlider.makeLeft();
        }
        await this._changeAsyncAnimationState(this._enableAnimation);
    }

    _moveSlide(sideMotions) {
        return async () => {
            if (!this._isCanMoveTo(sideMotions)) {
                throw new Error(`Can not move in ${sideMotions}`);
            }
            await this._enableAnimation();
            if (this.options.infinite) {
                await this.fixSlidersPositionBy(sideMotions);
            }
            this._moveSlideBy(sideMotions);
            if (this.options.showDots) {
                this.dotsElement.changeActiveDot(this.currentSliderIndex);
            }
            this._checkArrowsVisibility();
            await this._waitEndAnimation(sideMotions);
            this._checkQueue();
        }
    }

    async _checkQueue() {
        if (this.ANIMATION_QUEUE.length) {
            const moveSlide = this.ANIMATION_QUEUE.shift();
            try {
               await moveSlide();
            } catch (e) {
                this.ANIMATION_QUEUE = [];
                this.isMotionAnimationContinuous = false;
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
        this.sliders.forEach((slider) => {
            slider.removeClasses(DEFAULT_SLIDE_CLASS, RIGHT_SLIDE_CLASS, LEFT_SLIDE_CLASS);
            slider.resetPositionStatus();
        });
    }

    enable() {
        this.options.disable = false;
        this.buttonLeft.style.display = null;
        this.buttonRight.style.display = null;
        if (this.options.showDots) {
            this.dotsElement.showContainer();
        }
        this.carouselElement.classList.add(DEFAULT_CAROUSEL_CONTAINER_CLASS);
        this.sliders.forEach((slider) => slider.addClasses(DEFAULT_SLIDE_CLASS));
        this._adjustSlidersClasses();
        this._checkArrowsVisibility();
    }
}
