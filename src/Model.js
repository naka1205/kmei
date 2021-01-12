import Observeable from './Observeable';

class Model extends Observeable {
    constructor(options) {
        super()
        this.options = options
    }

    change() {
        this.notify(this);
    }

    proxy(key){
        Object.defineProperty(this, key, {
            configurable: false,
            enumerable: true,
            get: () => {
                return this.options[key];
            },
            set: (val) => {
                this.options[key] = val;
                this.change()
            }
        });
    }
}

export default Model