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

        public toggleDetailsForCell(columnIndex: any) {
            if (this.grid.options.showCustomDetailFor.item != this.item || this.grid.options.showCustomDetailFor.item == this.item && this.grid.options.showDetailFor.column != columnIndex) {
                this.openDetailsForCell(columnIndex);
            } else {
                this.closeDetailsForCell(columnIndex);
            }
        }

        public openDetailsForCell(columnIndex: any): void {
            this.grid.options.showDetailFor.column = columnIndex;
            this.grid.options.showDetailFor.item = this.item;
            this.grid.updateRow(this.item, true);
            this.grid.options.showCustomDetailFor.item = this.item;
            this.grid.options.showCustomDetailFor.column = columnIndex;
            this.grid.options.shouldAddDetailsOnSelection = false;
        }

        public closeDetailsForCell(columnIndex: any): void {
            if (this.grid.options.showCustomDetailFor.item == this.item) {
                this.grid.updateRow(this.item, false);
                this.grid.options.showCustomDetailFor = new ShowDetail();
            }
        }

        public setItemValue(item: any): void {
            this.item = item;
        }
        
    }

}