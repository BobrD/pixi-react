class Sorter {
    constructor() {
        this._list = [];

        this.compare = function(a, b){
            if(a > b) return 1;
            if(a < b) return -1;
            if(a === b) return 0;
        }
    }

    add(element) {
        this._list.push(element);
    }

    at(index) {
        return this._list[index];
    }

    get length() {
        return this._list.length;
    }

    toArray() {
        return this._list;
    }

    sort(indices) {
        indices.sort((a, b) => (a - b));
        for(let i = 0; i < indices.length; i++){
            for(let j = 0; j < indices.length; j++){
                let indexI = indices[i];
                let indexJ = indices[j];
                if(this.compare(this.at(indexI), this.at(indexJ)) < 0){
                    let temp = this.at(indexI);
                    this._array[indexI] = this.at(indexJ);
                    this._array[indexJ] = temp;
                }
            }
        }
    }

    setComparator(compareFunction) {
        this.compare = compareFunction;
    }
}