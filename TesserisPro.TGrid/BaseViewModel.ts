module TesserisPro.TGrid {
    export class BaseViewModel {
        constructor() {
            for (var i in this) {
                if (!this.hasOwnProperty(i) && typeof (this[i]) === "function" && i != "constructor") {
                    this[i] = this[i].bind(this);
                }
            }
        }
    }
}