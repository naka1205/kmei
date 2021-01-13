import Observer from './Observer';

class Text {
    constructor () {
        // super()
    }
    
    update (value) {
        this.node.textContent = value
    }
}

export default Text