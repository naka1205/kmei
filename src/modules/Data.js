
const Data =  {
    init(app) {
        let data = app.options.data

        if (typeof data === 'object') {
            Object.keys(data).forEach((key) => {
                Object.defineProperty(app.data, key, {
                    configurable: false,
                    enumerable: true,
                    get: () => {
                        return data[key];
                    },
                    set: (val) => {
                        console.log(val)
                        data[key] = val
                        app.data.notify(app.data)
                    }
                });
            })
        }
    }
}

export default Data