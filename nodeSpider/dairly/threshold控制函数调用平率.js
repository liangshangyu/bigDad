const yourFunc = function (func, threshold) {
    let timeOut;
    return function () {
        if(!timeOut){
            timeOut = setTimeout(()=> {
                timeOut = null;
                func.apply(this,arguments)
            },threshold)
        }
    }
};
const triggerSearch = yourFunc((val) => {
    const {
        onSearch(val)
    } = this.props
    onSearch(val)
},300);
triggerSearch(searchText)