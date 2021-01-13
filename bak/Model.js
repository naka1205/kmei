import Observeable from './Observeable';

class Model extends Observeable {
    constructor(options) {
        super()
        this.options = options
    }

    change() {
        console.log('change')
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
                console.log(key)
                this.options[key] = val;
                this.change()
            }
        });
    }
}

export default Model