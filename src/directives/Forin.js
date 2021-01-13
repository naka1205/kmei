import Compile from '../Compile'
const Forin = {
    isUpdate:false,
    parentNode:null,
    value:null,
    before(){

        if(this.parentNode != null ){
            return
        }

        this.parentNode = this.node.parentNode
        this.placeholder = document.createComment(`:forin`)
        this.parentNode && this.parentNode.replaceChild(this.placeholder, this.node)

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
    },
    render(value) {

        if ( !Array.isArray(value) ) {
            return
        }

        const fragment = document.createDocumentFragment()

        value.map((item, index) => {
            const compiled = new Compile(this.node.cloneNode(true), {
                [this.itemName]: item,
                [this.indexName]: index,
            })
            fragment.appendChild(compiled.view)
        })

        this.value == value
        this.placeholder.parentNode.replaceChild(fragment, this.placeholder)
        
    }
}

export default Forin