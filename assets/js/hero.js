class Hero {
    element;
    prevElement;
    prevElementTop;
    scrollingFn = false;
    scrolling = false;
    resetOpacity;
    constructor(element) {
        this.element = element
        this.initRevealingHero();
    }

    initRevealingHero() {
        this.element.style.bottom = Math.min(0, window.innerHeight - this.element.offsetHeight) + 'px';
        this.createPrevElement();
        this.element.addEventListener('update-reveal-hero', () => {
            this.element.style.bottom = Math.min(0, window.innerHeight - this.element.offsetHeight) + 'px';
            this.prevElementTop = this.prevElement.getBoundingClientRect().top + window.scrollY;

        });
        // set initial status
        this.animateRevealingHero.bind(this)();

        const observer = new IntersectionObserver(this.revealingHeroCallback.bind(this));
        observer.observe(this.prevElement);
    }

    revealingHeroCallback(entries, observer) {
        if(entries[0].isIntersecting) {
            // scrolling event already added
            if(this.scrollingFn) return;
            this.revealingHeroInitEvent.bind(this)();
        } else {
            // scrolling event already removed
            if(!this.scrollingFn) return;
            window.removeEventListener('scroll', this.scrollingFn);
            this.updateOpacityValue.bind(this)(0);
            this.scrollingFn = false;
        }
    }

    revealingHeroInitEvent() {
        this.scrollingFn = this.revealingHeroScrolling.bind(this);
        window.addEventListener('scroll', this.scrollingFn);
        return;
    }

    revealingHeroScrolling() {
        if(this.scrolling) return;
        this.scrolling = true;
        window.requestAnimationFrame(this.animateRevealingHero.bind(this));
    }

    createPrevElement() {
        const newElement = document.createElement('div');
        newElement.setAttribute('aria-hidden', 'true');
        this.element.parentElement.insertBefore(newElement, this.element);
        this.prevElement = this.element.previousElementSibling;
        this.prevElement.style.opacity = '0';
        //distance to very top of document
        this.prevElementTop = this.prevElement.getBoundingClientRect().top + window.scrollY;
    }

    animateRevealingHero() {

        // if prevElement is in frame or above 
        if (this.prevElementTop - window.scrollY < window.innerHeight) {
            let opacity = (1 - (window.innerHeight + window.scrollY - this.prevElementTop) / window.innerHeight).toFixed(2);
            if (opacity > 0) {
                this.resetOpacity = false;
                this.updateOpacityValue.bind(this)(opacity);
            } else if (!this.resetOpacity) {
                this.resetOpacity = true
                this.updateOpacityValue.bind(this)(0);
            }
        }
        this.scrolling = false;
    }

    updateOpacityValue(value) {
        this.element.style.setProperty('--revealing-hero-overlay-opacity', value);
    }
}

export default class HeroReveals {
    arr = [];
    heroArr = [];
    customEvent;
    resizingId;

    constructor() {
        this.arr =  [...document.getElementsByClassName('js-revealing-hero')];
        
        if(this.arr.length === 0) return;

        for (let i = 0; i < this.arr.length; i++) {
            this.heroArr.push(new Hero(this.arr[i]));
        };

        this.customEvent = new CustomEvent('update-reveal-hero');
        window.addEventListener('resize', () => {
            clearTimeout(this.resizingId);
            this.resizingId = setTimeout(this.doneResizing.bind(this), 100);
        });

    }

    doneResizing() {
        this.arr.forEach((el, index) => {
            el.dispatchEvent(this.customEvent);
        });
    }
}