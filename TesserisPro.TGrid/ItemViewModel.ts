module TesserisPro.TGrid {

    export class ItemViewModel {
        public model: any;
        public item: any;
        public grid: any;
        public isGroupHeader: boolean;
        public groupLevel: number;

        constructor(model: any, item: any, grid: any, isGroupHeader:boolean, groupLevel?: number) {
            this.model = model;
            this.item = item;
            this.grid = grid;
            this.isGroupHeader = isGroupHeader;
            this.groupLevel = groupLevel != undefined ? groupLevel : 0;
        }

        public getCellDetailFor(columnIndex:any): void {
            this.grid.options.showDetailFor.column = columnIndex;
            this.grid.options.showDetailFor.isDetailColumn = true;
        }
    }

}