/// <reference path="../Scripts/typings/knockout/knockout.d.ts" />
/// <reference path="../Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../TGrid.ts" />
var TGridBindingHandler = (function () {
    function TGridBindingHandler() {
        this.options = null;
    }
    TGridBindingHandler.prototype.init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $element = $(element);
        var options = new TesserisPro.TGrid.Options($element, TesserisPro.TGrid.Framework.Knockout);
        var grid = new TesserisPro.TGrid.Grid($element, options);
        //element.tgrid = grid;
    };

    TGridBindingHandler.prototype.update = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    };
    return TGridBindingHandler;
})();

ko.bindingHandlers.tgrid = new TGridBindingHandler();
