
const Model = {
    isUpdate:false,
    value:null,
    before(){

    },
    render(value) {

        this.value = typeof value == 'undefined' ? '' : value;

        this.node.value = this.value;
        this.node.addEventListener('input', (e) => {

            if (value === e.target.value) {
                return;
            }

            this.value = e.target.value
            this.compile.data[this.expression] = e.target.value;
            
        });

    },
}

export default Model