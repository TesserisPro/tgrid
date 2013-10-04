var TesserisPro;
(function (TesserisPro) {
    (function (TGrid) {
        var ItemViewModel = (function () {
            function ItemViewModel(model, item) {
                this.model = model;
                this.item = item;
            }
            return ItemViewModel;
        })();
        TGrid.ItemViewModel = ItemViewModel;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=ItemViewModel.js.map
