const OnShow =  {
    init(app) {
        let onShow = app.options.onShow
        if (typeof onShow == 'function') {
            Object.defineProperty(app, 'onShow', {
                value: onShow
            })
        }
        
    }
}

export default OnShow