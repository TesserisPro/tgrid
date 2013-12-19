var TesserisPro;
(function (TesserisPro) {
    (function (TGrid) {
        var KnockoutFilterPopupViewModel = (function () {
            function KnockoutFilterPopupViewModel(container) {
                this.container = container;
            }
            KnockoutFilterPopupViewModel.prototype.onApply = function () {
                var condition = (this.container.getElementsByTagName("select")[0]).selectedIndex;
                var value = (this.container.getElementsByTagName("input")[0]).value;
                var path = TGrid.Grid.getGridObject(this.container).options.filterPath;
                var filterDescriptor = new TGrid.FilterDescriptor(path, value, condition);
                TGrid.Grid.getGridObject(this.container).setFilters(filterDescriptor);
            };

            KnockoutFilterPopupViewModel.prototype.onClear = function () {
                TGrid.Grid.getGridObject(this.container).removeFilters();
            };

            KnockoutFilterPopupViewModel.prototype.onClose = function () {
                TGrid.Grid.getGridObject(this.container).hideElement(this.container);
            };
            return KnockoutFilterPopupViewModel;
        })();
        TGrid.KnockoutFilterPopupViewModel = KnockoutFilterPopupViewModel;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=KnockoutFilterPopupViewModel.js.map
