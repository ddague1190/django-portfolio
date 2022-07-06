class Preview {
    index;
    grid;
    item;
    elements = {}
    settings = {
        minHeight: 500,
        speed: .4,
        easing: 'ease',
        showVisitButton: true
    };

    constructor(index, grid) {
        this.index = index;
        this.grid = grid;
        this.item = this.grid.items[index]
        this.create();
        this.update(index);
    }

    create() {
        // store elements
        this.elements = {
            title: document.createElement('h3'),
            description: document.createElement('p'),
            link: document.createElement('a'),
            details: document.createElement('div'),
            loading: document.createElement('div'),
            fullImage: document.createElement('div'),
            largeImage: document.createElement('img'),
            closePreview: document.createElement('div'),
            previewInner: document.createElement('div'),
            previewEl: document.createElement('div')
        }
        // classify elements
        this.elements.details.classList.add('og-details');
        this.elements.loading.classList.add('og-loading');
        this.elements.fullImage.classList.add('og-fullimg');
        this.elements.closePreview.classList.add('og-close');
        this.elements.previewInner.classList.add('og-expander-inner');
        this.elements.previewEl.classList.add('og-expander');

        // structure elements
        this.elements.details.append(this.elements.title, this.elements.description, this.elements.link);
        this.elements.fullImage.append(this.elements.loading);
        this.elements.previewInner.append(this.elements.closePreview, this.elements.fullImage, this.elements.details);
        this.elements.previewEl.append(this.elements.previewInner);
        this.item.append(this.getEl())
        this.setTransition();

        // configure close button
        this.elements.closePreview.addEventListener('click', () => { this.grid.hidePreview() });
    }

    getEl() {
        return this.elements.previewEl
    }

    setTransition() {
        this.elements.previewEl.style.transition = 'height ' + this.settings.speed + 's ' + this.settings.easing;
        this.item.style.transition = 'height ' + this.settings.speed + 's ' + this.settings.easing;
    }

    update(index) {
        if (index) {
            this.item = this.grid.items[index]
        }
    
        // if already expanded remove class "og-expanded" from current item and add it to new item
        if (this.grid.current !== -1) {
            this.grid.items.forEach(item => {
                if(item.classList.contains('og-expanded')) {
                    item.classList.remove('og-expanded');
                }
            })
            this.grid.items[index].classList.add('og-expanded');
            // position the preview correctly
            this.positionPreview()
        }

        //update current value
        this.grid.current = index

        //update preview content
        let link = this.grid.items[index].querySelector('a');
        let data = {
            href: link.getAttribute('href'),
            largesrc: link.dataset.largesrc,
            title: link.dataset.title,
            description: link.dataset.description
        }


        this.elements.title.innerHTML = data.title;
        this.elements.description.innerHTML = data.description;
        this.elements.link.href = data.href;

        if (this.elements.fullImage.querySelector('img')) {
            this.elements.fullImage.removeChild('img');
        }
        if (this.elements.fullImage.style.display === 'block') {
            this.elements.loading.classList.add('og-loading--active');
            let newImg = document.createElement('img');
            newImg('load', () => {
                this.elements.loading.classList.remove('og-loading--active');
                let new_source = this.item.querySelector('a').getAttribute('src');
                let old_image = this.elements.fullImage.querySelector('img');
                this.elements.fullImage.removeChild(old_image);
                this.elements.fullImage.append(newImg);
            }).setAttribute('src', data.largesrc);
        }
    }
    open() {
        setTimeout(() => {
            // set the height for the preview and the item
            this.setHeights();
            // scroll to position the preview in the right place
            this.positionPreview();
        }, 25);
    }

    close() {
        const onEndFn = () => {
            this.item.removeEventListener('transitionend', onEndFn);
            this.item.classList.remove('og-expanded');
            this.elements.previewEl.remove();
        }
        setTimeout(() => {
            this.elements.previewEl.style.height = 0;
            const expandedItem = this.grid.items[this.index];
            expandedItem.addEventListener('transitionend', onEndFn);
            expandedItem.style.height = this.grid.itemsData[this.index].height + 'px';
        }, 25)

        return false;
    }

    calcHeight() {
        let heightPreview = this.grid.winsize.height - this.grid.itemsData[this.index].height - this.grid.marginExpanded;
        let itemHeight = this.grid.winsize.height;
        if (heightPreview < this.settings.minHeight) {
            heightPreview = this.settings.minHeight;
            itemHeight = this.settings.minHeight + this.grid.itemsData[this.index].height + this.grid.marginExpanded
        }
        return [heightPreview, itemHeight]
    }

    setHeights() {
        const onEndFn = () => {
            this.item.removeEventListener('transitionend', onEndFn);
            this.item.classList.add('og-expanded');
        }
        let [height, itemHeight] = this.calcHeight();
        this.elements.previewEl.style.height = height + 'px';
        this.item.style.height = itemHeight + 'px';
        this.item.addEventListener('transitionend', onEndFn);
    }

    positionPreview() {
        // scroll page
        // case 1 : preview height + item height fits in window´s height
        // case 2 : preview height + item height does not fit in window´s height and preview height is smaller than window´s height
        // case 3 : preview height + item height does not fit in window´s height and preview height is bigger than window´s height
        const position = this.grid.itemsData[this.index].top;
        const previewOffsetT = this.elements.previewEl.offsetTop - this.grid.scrollExtra;
        let [height, itemHeight] = this.calcHeight();
        const scrollVal = (height + this.grid.itemsData[this.index].height + this.grid.marginExpanded) <= this.grid.winsize.height ? previewOffsetT - (this.grid.winsize.height - height) : previewOffsetT;
        window.scroll({
            top: scrollVal,
            left: 0,
            behavior: 'smooth'
        });
    }
}


export class Grid {
    previewInstance = null;
    grid;
    items;
    itemsData = [];
    body;
    current = -1;
    previewPos = -1;
    scrollExtra = 0;
    winsize;
    marginExpanded = 0;
    showingPreview = false;

    constructor() {
        this.grid = document.getElementById('og-grid');
        this.items = [...this.grid.getElementsByTagName('li')];
        this.body = document.body;
        this.onImagesLoaded();
    }

    onImagesLoaded() {
        const images = this.grid.getElementsByTagName('img');
        let loaded = images.length;
        for (let i = 0; i < images.length; i++) {
            if (images[i].complete) {
                loaded--;
            }
            else {
                images[i].addEventListener("load", function () {
                    loaded--;
                    if (loaded == 0) {
                        this.init()
                    }
                });
            }
            if (loaded == 0) {
                this.init()
            }
        }
    }


    init() {
        // save item´s size and offset
        this.saveItemInfo();
        // get window´s size
        this.getWinSize();
        // initialize some events
        this.initEvents();
    }

    saveItemInfo() {
        this.items.forEach(item => {
            this.itemsData.push({
                top: item.offsetTop,
                height: item.getBoundingClientRect().height
            })
        })
    }

    getWinSize() {
        this.winsize = { width: window.innerWidth, height: window.innerHeight }
    }


    initEvents() {
        // when clicking an item, show the preview with the item´s info and large image.
        // close the item if already expanded.
        // also close if clicking on the item´s cross
        this.initItemsEvents();

        // reset on window resize
        window.addEventListener('resize', ()=>{
            this.scrollExtra = 0;
            this.previewPos = -1;
            this.saveItemInfo()
            this.getWinSize();
            if (this.showingPreview) {
                this.hidePreview();
            }
            this.items.forEach(item=>{
                if(item.classList.contains('og-expanded')) {
                    item.classList.remove('og-expanded');
                }
            })
        })
    }

    initItemsEvents() {
        this.items.forEach((item, index) => {
            let link = item.querySelector('a');
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (index === this.current) {
                    this.hidePreview()
                } else {
                    this.showPreview(index);
                }
                return false;
            })

        })
    }

    showPreview(index) {
        const position = this.itemsData[index].top;
        this.scrollExtra = 0;
        if (this.showingPreview) {
            if (position !== this.previewPos) {
                if (position > this.previewPos) {
                    this.scrollExtra = this.previewInstance.elements.previewEl.getBoundingClientRect().height;
                }
                this.hidePreview();
            } else {
                this.previewInstance.update(index)
                return false;
            }
        } 

        // update variables
        this.current = index;
        this.previewPos = position;
        this.showingPreview = true;
        // initialize new preview for clicked item
        this.previewInstance = new Preview(index, this);
        this.previewInstance.open();
    }

    hidePreview() {
        this.showingPreview = false;
        this.previewInstance.close();
        this.previewInstance = null;
        this.current = -1;

    }
}