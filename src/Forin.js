import Observer from './Observer';

class Forin extends Observer {
    constructor () {
        super()
    }
    
    beforeUpdate() {
        this.placeholder = document.createComment(`:forin`)
        this.node.parentNode && this.node.parentNode.replaceChild(this.placeholder, this.node)

        this.itemName = `item`
        this.indexName = `index`
        this.dataName = this.expression

        if (this.expression.indexOf(' in ') != -1) {
            const bracketRE = /\(((?:.|\n)+?)\)/g;
            const [item, data] = this.expression.split(' in ')
            const matched = bracketRE.exec(item)

            if (matched) {
                const [item, index] = matched[1].split(',')
                index ? this.indexName = index.trim() : ''
                this.itemName = item.trim()
            } else {
                this.itemName = item.trim()
            }

            this.dataName = data.trim()
        }

        this.expression = this.dataName
    }
    
    update(data) {
        if (data && !Array.isArray(data)) return

        const fragment = document.createDocumentFragment()

        data.map((item, index) => {
            const compiled = Compile(this.node.cloneNode(true), {
                [this.itemName]: item,
                [this.indexName]: index,
            })
            fragment.appendChild(compiled.view)
        })
        
        this.placeholder.parentNode.replaceChild(fragment, this.placeholder)
    }
}

export default Forin