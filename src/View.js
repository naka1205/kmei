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

    compile(){
        return new Compile(this.template,this.data).view
    }

}

export default View