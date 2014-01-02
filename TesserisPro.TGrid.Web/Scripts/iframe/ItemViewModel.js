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
            ItemViewModel.prototype.showDetailForCell = function (columnIndex) {
                this.grid.options.showDetailFor.column = columnIndex;
                this.grid.options.showDetailFor.isDetailColumn = true;
                this.grid.options.showDetailFor.item = this.item;
                this.grid.updateRow(this.item);
            };

            ItemViewModel.prototype.setItemValue = function (item) {
                this.item = item;
                this.model.editingItem = null;
            };
            return ItemViewModel;
        })();
        TGrid.ItemViewModel = ItemViewModel;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=ItemViewModel.js.map
