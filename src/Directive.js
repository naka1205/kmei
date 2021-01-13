import {generate,firstToUpper} from './Utils';
import Observer from './Observer'
import Directives from './directives'

class Directive extends Observer {
    constructor(options) {
        super()
        Object.assign(this, options);
        Object.assign(this, Directives[firstToUpper(this.name)]);
        
        this.update(this.compile.data)
    }

    update(data){
        this.before && this.before()
        this.render && this.render(generate(this.expression)(data))
    }

}

export default Directive