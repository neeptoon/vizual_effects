class Parallax {
    constructor(elements, options = {}) {
        this.parallaxLayers = Array.from(elements).map((element) => {
            return new Parallax.Layer(element, options)
        });
    }

    destroy() {
        this.parallaxLayers.forEach((layer) => layer.destroyEvents());
    }
}

Parallax.Layer = class {
    constructor(element, options = {}) {
        this.containerNode = element;
        this.childrenNodes = element.children;

        this.x = 0;
        this.y = 0;
        this.mouseY = 0;
        this.mouseX = 0;

        this.depths = Array.from(this.childrenNodes).map((child) => {
            return child.dataset.depth ? Number(child.dataset.depth) : 0
        });

        this.resize = this.resize.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.animationFrame = this.animationFrame.bind(this);

        this.setParameters();
        this.setEvents();
    }

    setEvents() {
        this.debouncedResize = debounce(this.resize);
        window.addEventListener('resize', this.debouncedResize);
        this.containerNode.addEventListener('mousemove', this.mouseMove);
        this.animationId = window.requestAnimationFrame(this.animationFrame);
    }

    destroyEvents() {
        window.removeEventListener('resize', this.debouncedResize);
        this.containerNode.removeEventListener('mousemove', this.mouseMove);
        window.cancelAnimationFrame(this.animationId);
    }

    setParameters() {
        const coordsContainer = this.containerNode.getBoundingClientRect();
        this.width = Math.round(coordsContainer.width);
        this.height = Math.round(coordsContainer.height);
        this.offsetTop = this.containerNode.offsetTop;
        this.offsetLeft = this.containerNode.offsetLeft;

        this.widthCenter = this.width / 2;
        this.heightCenter = this.height / 2;
    }

    resize() {
        this.setParameters()
    }

    mouseMove(event) {
        const clientX = event.pageX - this.offsetLeft;
        const clientY = event.pageY - this.offsetTop;

        if (this.widthCenter && this.heightCenter) {
            this.mouseX = (clientX - this.widthCenter) / this.widthCenter;
            this.mouseY = (clientY - this.heightCenter) / this.heightCenter;
        }

    }

    animationFrame() {
        const scrollChange = window.scrollY - this.offsetTop;
        const positionX = this.mouseX * this.width / 10;
        const positionY = this.mouseY * this.height / 10 +  Math.max(scrollChange / 3, 0);

        this.x += (positionX - this.x) * 0.1;
        this.y += (positionY - this.y) * 0.1;


        for (let i = 0; i < this.childrenNodes.length; i++) {
            const layerNode = this.childrenNodes[i];
            const layerDepth = this.depths[i] || 0;
            const finalX = this.x * layerDepth * -1;
            const finalY = this.y * layerDepth * -1;

            this.setPosition(layerNode, finalX, finalY);

        }

        this.animationId = window.requestAnimationFrame(this.animationFrame);
    }

    setPosition(element, x, y) {
        element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }
}

function debounce(func, time = 100) {
    let timer;
    return function (event) {
        clearTimeout(timer);
        timer = setTimeout(func, time, event)
    }
}


