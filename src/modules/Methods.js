const Methods =  {
    init(app) {
        let methods = app.options.methods

        Object.keys(methods).forEach((key) => {
            Object.defineProperty(app, key, {
                value: methods[key]
            });
        })
    }
}

export default Methods