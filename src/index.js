import App from './App';
import Control from './Control';
import Model from './Model';
import View from './View';

const Controls = {
    init(app) {
        app.control = new Control(app.options.methods);
        Object.keys(app.control.options).forEach((key) => {
            app.control.proxy(key)
        })

        Object.keys(app.control.options).forEach((key) => {
            Object.defineProperty(app, key, {
                value: app.control[key]
            });
        })
    }
}

const Models = {
    init(app) {
        app.model = new Model(app.options.data)

        Object.keys(app.model.options).forEach((key) => {
            app.model.proxy(key)
        })

        Object.keys(app.model.options).forEach((key) => {
            Object.defineProperty(app, key, {
                configurable: false,
                enumerable: true,
                get: () => {
                    return app.model[key];
                },
                set: (val) => {
                    app.model[key] = val
                }
            });
        })
    }
}

const Views =  {
    init(app) {
        app.view = new View(app.options.template);
    }
}

App.use([Controls, Models, Views])

new App('app',{
    methods: {
        hello(){
            return 'title'
        }
    },
    computed: {
        demo(){
            return 'computed demo'
        }
    },
    data: {
        title: 'App',
        description: 'this is template',
    },
    onReady(app) {
        console.log('onReady',this)
        app.hello()
    },
    onShow(app){
        console.log('onShow',app)
    }
})