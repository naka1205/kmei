import Configure from './Configure';
import Directive from './Directive';
import {walk,domify,parseText,hasInterpolation} from './Utils';

class Compile {
    constructor(template,data) {
        this.options = {}
        this.data = data
        
        if (template instanceof Node) {
            this.options.template = template
        } else if (typeof template === 'string') {
            this.options.template = domify(template)
        } else {
            console.error(`"template" only accept DOM node or string template`)
        }
        
        template = this.options.template
        
        walk(template, (node, next) => {
            if (node.nodeType === 1) {
                return next(this.elementNodes.call(this, node) === false)
            } else if (node.nodeType === 3) {
                this.textNodes.call(this, node)
            }
            next()
        })

        this.view = template
        template = null
    }

    bindPriority(node){
        for (let i = 0; i < Configure.priority.length; i++) {
            const directive = Configure.priority[i]
            let attributeValue = node.getAttribute(`${Configure.identifier.bind}${directive}`)
            
            if (attributeValue) {
                attributeValue = attributeValue.trim()
                if (!attributeValue) return false
    
                node.removeAttribute(`${Configure.identifier.bind}${directive}`)

                this.bindDirective({
                    node,
                    name: directive,
                    expression: attributeValue,
                });
    
                return true
            } 
        }
    
        return false
    }

    bindDirective(options){
        // let dis = new Directive({...options,compile: this,})

        this.data.register(new Directive({...options,compile: this,}))
    }

    bindAttribute(node, attribute){
        if (!hasInterpolation(attribute.value) || attribute.value.trim() == '') return false

        this.bindDirective({
            node,
            name: 'attribute',
            expression: parseText(attribute.value),
            attrName: attribute.name,
        })
    }

    textNodes(node){
        if (node.textContent.trim() === '') return false

        this.bindDirective({
            node,
            name: 'text',
            expression: parseText(node.textContent),
        })
    }

    elementNodes(node){
        if (node.hasAttributes() && this.bindPriority(node)) return false
    
        const attributes = [].slice.call(node.attributes)
        attributes.map(attribute => {
            const attributeName = attribute.name
            const attributeValue = attribute.value.trim()
            if (attributeName.indexOf(Configure.identifier.bind) === 0 && attributeValue !== '') {
                const directiveName = attributeName.slice(Configure.identifier.bind.length)

                this.bindDirective({
                    node,
                    expression: attributeValue,
                    name: directiveName,
                });
                node.removeAttribute(attributeName)
            } else {
                this.bindAttribute(node, attribute)
            }
        })
    }
}

export default Compile