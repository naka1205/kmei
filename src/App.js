import Compile from './Compile'
import Watcher from './Watcher'

class App {
    static modules = []
    constructor(name,options) {
        this.name = name
        this.options = options
        this.data = new Watcher
        this.init()
    }

    static use(module) {
        Array.isArray(module) ? module.map(item => App.use(item)) : App.modules.push(module)
    }

    initModules() {
        App.modules.map(module => module.init && typeof module.init == 'function' && module.init(this))
    }
    
    init() {
        this.initModules()
        this.onReady && this.onReady()
        this.compile()
        this.onShow && this.onShow()
    }

    compile(){
        let el = document.getElementById(this.name)
        return new Compile(el,this.data).view
    }

    
}

export default App