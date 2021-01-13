import {generate,config} from './Utils';
import Observer from './Observer';

class Directive extends Observer {
    constructor(options) {
        super()
        Object.assign(this, options)
        Object.assign(this, config[this.name])
        // this.update(this.compile.data)
    }

    update ( data ) {
        console.log('update')
        let value = generate(this.expression)(data)

        this.before(value)
        this.display(value)
    }
}

export default Directive