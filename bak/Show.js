import Observer from './Observer';

class Show extends Observer {
    constructor () {
        super()
    }
    
    update (value) {
        this.node.style.display = value ? `block` : `none`
    }
}

export default Show