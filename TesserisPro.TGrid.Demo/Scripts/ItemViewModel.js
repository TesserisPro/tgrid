var TesserisPro;
(function (TesserisPro) {
    (function (TGrid) {
        var ItemViewModel = (function () {
            function ItemViewModel(model, item, grid) {
                this.model = model;
                this.item = item;
                this.grid = grid;
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
