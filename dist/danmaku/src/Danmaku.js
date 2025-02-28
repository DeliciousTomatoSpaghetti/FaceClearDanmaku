export class Danmaku {
    constructor(track, text) {
        this.parentTrack = track;
        this.element = document.createElement('div');
        this.element.style.position = 'absolute';
        this.element.style.left = `${this.parentTrack.width}px`;
        this.element.style.top = `${this.parentTrack.index * this.parentTrack.height}px`;
        this.element.innerText = text;
    }
    startMove() {
        this.element.style.transition = `transform 5s linear`;
        this.element.style.transform = `translateX(-${this.parentTrack.width}px)`;
    }
}
