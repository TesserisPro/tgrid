/// <reference path="../Scripts/typings/knockout/knockout.d.ts" />
/// <reference path="../Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../Scripts/typings/extenders.d.ts" />
/// <reference path="../TGrid.ts" />
/// <reference path="../SortDescriptor.ts" />
var TGridBindingHandler = (function () {
    function TGridBindingHandler() {
        this.options = null;
    }
    TGridBindingHandler.prototype.init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var options = new TesserisPro.TGrid.Options(element, valueAccessor(), TesserisPro.TGrid.Framework.Knockout);

        var grid = new TesserisPro.TGrid.Grid(element, options, valueAccessor().provider);
    };

    TGridBindingHandler.prototype.update = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    };
    return TGridBindingHandler;
})();

ko.bindingHandlers.tgrid = new TGridBindingHandler();
//# sourceMappingURL=TGridBinding.js.map