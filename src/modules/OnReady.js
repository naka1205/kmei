const OnReady =  {
    init(app) {
        let onReady = app.options.onReady
        if (typeof onReady == 'function') {
            Object.defineProperty(app, 'onReady', {
                value: onReady
            })
        }
        
    }
}

export default OnReady