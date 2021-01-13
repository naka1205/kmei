class Control {
    constructor(options) {
        this.options = options
    }

    proxy (key){
        Object.defineProperty(this, key, {
            value: this.options[key]
        });
    }
}

export default Control