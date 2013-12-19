var TesserisPro;
(function (TesserisPro) {
    (function (TGrid) {
        var ItemViewModel = (function () {
            function ItemViewModel(model, item, grid, isGroupHeader) {
                this.model = model;
                this.item = item;
                this.grid = grid;
                this.isGroupHeader = isGroupHeader;
            }
            ItemViewModel.prototype.getCellDetailFor = function (columnIndex) {
                this.grid.options.showDetailFor.column = columnIndex;
                this.grid.options.showDetailFor.isDetailColumn = true;
            };
            return ItemViewModel;
        })();
        TGrid.ItemViewModel = ItemViewModel;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=ItemViewModel.js.map
