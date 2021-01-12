import Observer from './Observer';

class Each extends Observer {
    constructor () {
        super()
    }
    
    beforeUpdate() {
        this.placeholder = document.createComment(`:each`)
        this.node.parentNode && this.node.parentNode.replaceChild(this.placeholder, this.node)
    }
    
    update(data) {
        if (data && !Array.isArray(data)) return

        const fragment = document.createDocumentFragment()

        data.map((item, index) => {
            const compiled = Compile(this.node.cloneNode(true), { item:item, index:index })
            fragment.appendChild(compiled.view)
        })
        
        this.placeholder.parentNode.replaceChild(fragment, this.placeholder)
    }
}

export default Each