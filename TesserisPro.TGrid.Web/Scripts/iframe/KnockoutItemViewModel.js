var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TesserisPro;
(function (TesserisPro) {
    /// <reference path="../ItemViewModel.ts" />
    /// <reference path="../scripts/typings/knockout/knockout.d.ts"/>
    (function (TGrid) {
        var KnockoutItemViewModel = (function (_super) {
            __extends(KnockoutItemViewModel, _super);
            function KnockoutItemViewModel() {
                _super.apply(this, arguments);
            }
            KnockoutItemViewModel.prototype.setObservable = function (item) {
                this.item = ko.observable(item);
            };

            KnockoutItemViewModel.prototype.setItemValue = function (value) {
                this.item(value);
                this.item.valueHasMutated();
                this.item.notifySubscribers(value);
            };
            return KnockoutItemViewModel;
        })(TGrid.ItemViewModel);
        TGrid.KnockoutItemViewModel = KnockoutItemViewModel;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=KnockoutItemViewModel.js.map
