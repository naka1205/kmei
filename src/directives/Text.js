
const Text = {
    isUpdate:false,
    value:null,
    before(){

    },
    render(value) {

        this.value = value
        this.node.textContent = value
    }
}

export default Text