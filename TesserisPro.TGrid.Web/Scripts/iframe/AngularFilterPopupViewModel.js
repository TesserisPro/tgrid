var TesserisPro;
(function (TesserisPro) {
    (function (TGrid) {
        var AngularFilterPopupViewModel = (function () {
            function AngularFilterPopupViewModel(container) {
                this.container = container;
            }
            AngularFilterPopupViewModel.prototype.setScope = function (scope) {
                var _this = this;
                this.$scope = scope;
                this.$scope.onApply = function () {
                    return _this.onApply();
                };
                this.$scope.onClear = function () {
                    return _this.onClear();
                };
                this.$scope.onClose = function () {
                    return _this.onClose();
                };
            };

            AngularFilterPopupViewModel.prototype.onApply = function () {
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
            };

            AngularFilterPopupViewModel.prototype.onClear = function () {
                TGrid.Grid.getGridObject(this.container).removeFilters(this.path);
                hideElement(this.container);
            };

            AngularFilterPopupViewModel.prototype.onClose = function () {
                hideElement(this.container);
            };

            AngularFilterPopupViewModel.prototype.onOpen = function (options, column) {
                TGrid.Grid.getGridObject(this.container).setDefaultFilterPopUpValues();
                this.path = column.filterMemberPath;
                this.columnInfo = column;
                for (var i = 0; i < options.filterDescriptors.length; i++) {
                    if (options.filterDescriptors[i].path == column.filterMemberPath) {
                        (this.container.getElementsByTagName("input")[0]).value = options.filterDescriptors[i].value;
                        (this.container.getElementsByTagName("select")[0]).selectedIndex = options.filterDescriptors[i].condition;
                    }
                }
            };

            AngularFilterPopupViewModel.prototype.getColumnInfo = function () {
                return this.columnInfo;
            };
            return AngularFilterPopupViewModel;
        })();
        TGrid.AngularFilterPopupViewModel = AngularFilterPopupViewModel;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=AngularFilterPopupViewModel.js.map
