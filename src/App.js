class App {
    static modules = []
    constructor(name,options) {
        this.options = options
        this.init(document.getElementById(name))
        // this.show(document.getElementById(name))
    }

    static use(module) {
        Array.isArray(module) ? module.map(item => App.use(item)) : App.modules.push(module)
    }

    init(el) {
        this.initModules()

        let computed = this.options.computed

        if (typeof computed === 'object') {
            Object.keys(computed).forEach((key) => {
                Object.defineProperty(this.model, key, {
                    get: typeof computed[key] === 'function'  ? computed[key] : computed[key].get
                })
            })
        }


        this.view.setData(this.model)
        // this.model.register(this.view)
        this.options.onReady(this)

        this.view.compile(el)
    }

    show(dom){
        const body = this.view.compile(el)
        dom.innerHTML = body.innerHTML
        this.options.onShow(this)
    }

    initModules() {
        App.modules.map(module => module.init && typeof module.init == 'function' && module.init(this))
    }
}

export default App