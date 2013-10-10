var TesserisPro;
(function (TesserisPro) {
    /// <reference path="IGroup.ts" />
    (function (TGrid) {
        var ItemViewModel = (function () {
            function ItemViewModel(model, item, grid, isGroup) {
                this.model = model;
                this.item = item;
                this.grid = grid;

                if (isGroup) {
                    if (item.items != null && item.items != undefined) {
                        var groupItem = item;
                        this.children = new Array();
                        for (var i = 0; i < groupItem.items.length; i++) {
                            this.children.push(new ItemViewModel(model, groupItem.items[i], grid, true));
                        }
                    }
                }
            }
            ItemViewModel.prototype.getCellDetailFor = function (columnIndex) {
                this.grid.options.showDetailFor.column = columnIndex;
                this.grid.options.showDetailFor.isApply = true;
            };
            return ItemViewModel;
        })();
        TGrid.ItemViewModel = ItemViewModel;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=ItemViewModel.js.map
