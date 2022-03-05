'use strict';

const openButton = document.querySelector('.open-modal');
const openButton2 = document.querySelector('.open-modal-2');

class Modal {
    constructor(text) {
        this.text = text;

        this.init();
    }


    init() {
        this.show();
        this.modal = document.querySelector('#myModal');
        this.closeButton = this.modal.querySelector('.modal__close');
        this.attachEventClose();
    }

    show() {
        document.body.insertAdjacentHTML('afterbegin', `
            <div id="myModal" class="modal">
                    <div class="modal__place">
                        <div class="modal__text">${this.text}</div>
                        <button class="modal__close"><span class="visually-hidden">Закрыть модальное окно</span>❌</button>
                    </div>
            </div>
        `)
    }

    attachEventClose() {
        this.close = this.close.bind(this);
        this.windowClickHandler = this.windowClickHandler.bind(this);

        this.closeButton.addEventListener('click', this.close)
        window.addEventListener('click', this.windowClickHandler)
    }

    windowClickHandler(evt) {
        if (evt.target === this.modal) {
            this.close();
        }
    }

    close() {
        this.detachEventClose();
        this.modal.remove();
        this.modal = null;
    }

    detachEventClose() {
        this.closeButton.removeEventListener('click', this.close);
    }

}

openButton.addEventListener('click', () => new Modal('С Днюхой, вашевысокоблагородие!!'));
openButton2.addEventListener('click', () => new Modal('А ты хорош!!'));

