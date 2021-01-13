# kmei

MVVM 

### 说明

```js
import App from './App';
import Modules from './modules';

App.use(Modules)

new App('app',{
    methods: {
        change(){
            console.log(this.data.title)
        }
    },
    computed: {
        content(){
            return 'this is template'
        }
    },
    data: {
        title: 'App',
        description: 'this is template',
        lists: [
            {id:1,value: `text`},
            {id:2,value: `show`},
            {id:3,value: `model`},
            {id:4,value: `forin`}
        ]
    },
    onReady() {
        console.log('onReady')
        // this.change()
    },
    onShow(){
        console.log('onShow')
        // this.data.title = 'title'
        // this.change()

        // this.data.lists = [{id:1,value: `title`}]
    }
})
```