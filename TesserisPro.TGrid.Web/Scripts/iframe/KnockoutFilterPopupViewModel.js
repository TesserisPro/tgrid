var TesserisPro;
(function (TesserisPro) {
    (function (TGrid) {
        var KnockoutFilterPopupViewModel = (function () {
            function KnockoutFilterPopupViewModel(container, onCloseFilterPopup) {
                this.container = container;
                this.onCloseFilterPopup = onCloseFilterPopup;
            }
            KnockoutFilterPopupViewModel.prototype.onCloseFilterPopup = function () {
            };

            KnockoutFilterPopupViewModel.prototype.onApply = function () {
                this.condition = (this.container.getElementsByTagName("select")[0]).selectedIndex;
                if (this.condition != TGrid.FilterCondition.None) {
                    this.value = (this.container.getElementsByTagName("input")[0]).value;
                    var filterDescriptor = new TGrid.FilterDescriptor(this.path, this.value, this.condition);
                    var grid = TGrid.Grid.getGridObject(this.container);
                    grid.setFilters(filterDescriptor, this.path);
                } else {
                    TGrid.Grid.getGridObject(this.container).removeFilters(this.path);
                }
                hideElement(this.container);
                this.onCloseFilterPopup();
            };

            KnockoutFilterPopupViewModel.prototype.onClear = function () {
                TGrid.Grid.getGridObject(this.container).removeFilters(this.path);
                hideElement(this.container);
                this.onCloseFilterPopup();
            };

            KnockoutFilterPopupViewModel.prototype.onClose = function () {
                hideElement(this.container);
                this.onCloseFilterPopup();
            };

            KnockoutFilterPopupViewModel.prototype.onOpen = function (options, column) {
                TGrid.Grid.getGridObject(this.container).setDefaultFilterPopUpValues();
                this.columnInfo = column;
                this.path = column.filterMemberPath;
                for (var i = 0; i < options.filterDescriptors.length; i++) {
                    if (options.filterDescriptors[i].path == column.filterMemberPath) {
                        (this.container.getElementsByTagName("input")[0]).value = options.filterDescriptors[i].value;
                        (this.container.getElementsByTagName("select")[0]).selectedIndex = options.filterDescriptors[i].condition;
                    }
                }
            };

            KnockoutFilterPopupViewModel.prototype.getColumnInfo = function () {
                return this.columnInfo;
            };
            return KnockoutFilterPopupViewModel;
        })();
        TGrid.KnockoutFilterPopupViewModel = KnockoutFilterPopupViewModel;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=KnockoutFilterPopupViewModel.js.map
