var TesserisPro;
(function (TesserisPro) {
    (function (TGrid) {
        var FilterPopupViewModel = (function () {
            function FilterPopupViewModel(container) {
                this.container = container;
            }
            FilterPopupViewModel.prototype.onApply = function () {
                var condition = (this.container.getElementsByTagName("select")[0]).selectedIndex;
                var value = (this.container.getElementsByTagName("input")[0]).value;
                var path = TGrid.Grid.getGridObject(this.container).options.filterPath;
                var filterDescriptor = new TGrid.FilterDescriptor(path, value, condition);
                TGrid.Grid.getGridObject(this.container).setFilters(filterDescriptor);
            };

            FilterPopupViewModel.prototype.onClear = function () {
                var condition = (this.container.getElementsByTagName("select")[0]).selectedIndex;
                var value = (this.container.getElementsByTagName("input")[0]).value;
                var path = TGrid.Grid.getGridObject(this.container).options.filterPath;
                var filterDescriptor = new TGrid.FilterDescriptor(path, value, condition);
                TGrid.Grid.getGridObject(this.container).removeFilters(filterDescriptor);
            };

            FilterPopupViewModel.prototype.onClose = function () {
                TGrid.Grid.getGridObject(this.container).hideElement(this.container);
            };
            return FilterPopupViewModel;
        })();
        TGrid.FilterPopupViewModel = FilterPopupViewModel;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=FilterPopupViewModel.js.map
