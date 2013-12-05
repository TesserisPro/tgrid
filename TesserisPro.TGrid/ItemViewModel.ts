module TesserisPro.TGrid {

    export class ItemViewModel {
        public model: any;
        public item: any;
        public grid: any;
        public isGroupHeader: boolean;

        constructor(model: any, item: any, grid: any, isGroupHeader:boolean) {
            this.model = model;
            this.item = item;
            this.grid = grid;
            this.isGroupHeader = isGroupHeader;
        }

        public showDetailForCell(columnIndex: any): void {
            this.grid.options.showDetailFor.column = columnIndex;
            this.grid.options.showDetailFor.isDetailColumn = true;
        }
    }

}