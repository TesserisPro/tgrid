/// <reference path="IGroup.ts" />

module TesserisPro.TGrid {

    export class ItemViewModel {
        public model: any;
        public item: any;
        public grid: any;
        public children: Array<ItemViewModel>;

        constructor(model: any, item: any, grid: any, isGroup: boolean) {
            this.model = model;
            this.item = item;
            this.grid = grid;

            if (isGroup) {
                if (item.items != null && item.items != undefined) {
                    var groupItem = <IGroup>item;
                    this.children = new Array<ItemViewModel>();
                    for (var i = 0; i < groupItem.items.length; i++) {
                        this.children.push(new ItemViewModel(model, groupItem.items[i], grid, true));
                    }
                }
            }
        }

        public getCellDetailFor(columnIndex:any): void {
            this.grid.options.showDetailFor.column = columnIndex;
            this.grid.options.showDetailFor.isApply = true;
        }
    }

}