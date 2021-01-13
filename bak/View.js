import Compile from './Compile';
import Observer from './Observer';

class View {
    constructor(template) {
        this.options = {}
        this.data = {}
        this.template = template
    }

    setData(data){
        this.data = data
    }

    setTemplat(template){
        this.template = template
    }

    compile(el){
        return new Compile(el,this.data).view
    }

    nodeToFragment (el) {
        var fragment = document.createDocumentFragment();
        var child = el.firstChild;
        while (child) {
            fragment.appendChild(child);
            child = el.firstChild
        }
        return fragment;
    }

}

export default View