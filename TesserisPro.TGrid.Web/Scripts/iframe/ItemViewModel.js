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
            ItemViewModel.prototype.toggleDetailsForCell = function (columnIndex) {
                if (this.grid.options.showCustomDetailFor.item != this.item || this.grid.options.showCustomDetailFor.item == this.item && this.grid.options.showDetailFor.column != columnIndex) {
                    this.openDetailsForCell(columnIndex);
                } else {
                    this.closeDetailsForCell(columnIndex);
                }
            };

            ItemViewModel.prototype.openDetailsForCell = function (columnIndex) {
                this.grid.options.showDetailFor.column = columnIndex;
                this.grid.options.showDetailFor.item = this.item;
                this.grid.updateRow(this.item, true);
                this.grid.options.showCustomDetailFor.item = this.item;
                this.grid.options.showCustomDetailFor.column = columnIndex;
                this.grid.options.shouldAddDetailsOnSelection = false;
            };

            ItemViewModel.prototype.closeDetailsForCell = function (columnIndex) {
                if (this.grid.options.showCustomDetailFor.item == this.item) {
                    this.grid.updateRow(this.item, false);
                    this.grid.options.showCustomDetailFor = new TGrid.ShowDetail();
                }
            };

            ItemViewModel.prototype.setItemValue = function (item) {
                this.item = item;
            };
            return ItemViewModel;
        })();
        TGrid.ItemViewModel = ItemViewModel;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=ItemViewModel.js.map
