import Observer from './Observer';

class Attribute extends Observer {
    constructor () {
        super()
    }
    
    update (value) {
        console.log(value)
        this.node.setAttribute(this.attrName, value)
    }
}

export default Attribute