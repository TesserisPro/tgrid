module TesserisPro.TGrid {

    export class ItemViewModel {
        public model: any;
        public item: any;
        public grid: any;

        constructor(model: any, item: any, grid: any) {
            this.model = model;
            this.item = item;
            this.grid = grid;
        }
    }

}