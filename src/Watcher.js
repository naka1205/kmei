class Watcher {
    constructor(){
        this.objs = []
    }
    
    register(obs) {
        this.objs.push(obs);
    }

    remove(obs) {
        let idx = this.objs.findIndex(val => val.name === obs.name);
        if (idx > -1) this.objs.splice(idx, 1);
    }

    notify(...data) {
        this.objs.forEach(val => val.update(...data));
    }
}

export default Watcher