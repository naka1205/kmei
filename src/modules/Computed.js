const Computed =  {
    init(app) {
        let computed = app.options.computed

        if (typeof computed === 'object') {
            Object.keys(computed).forEach((key) => {
                Object.defineProperty(app.data, key, {
                    get: typeof computed[key] === 'function'  ? computed[key] : computed[key].get
                })
            })
        }
    }
}

export default Computed