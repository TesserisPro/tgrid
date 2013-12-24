var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TesserisPro;
(function (TesserisPro) {
    (function (TGrid) {
        var AngularItemViewModel = (function (_super) {
            __extends(AngularItemViewModel, _super);
            function AngularItemViewModel() {
                _super.apply(this, arguments);
            }
            AngularItemViewModel.prototype.setScope = function (scope) {
                var _this = this;
                this.$scope = scope;
                this.$scope.model = this.model;
                this.$scope.item = this.item;
                this.$scope.grid = this.grid;
                this.$scope.isGroupHeader = this.isGroupHeader;
                this.$scope.showDetailForCell = function (columnIndex) {
                    return _this.showDetailForCell(columnIndex);
                };
            };
            return AngularItemViewModel;
        })(TGrid.ItemViewModel);
        TGrid.AngularItemViewModel = AngularItemViewModel;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=AngularItemViewModel.js.map
