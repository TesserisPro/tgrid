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
        var options = new TesserisPro.TGrid.Options(element, TesserisPro.TGrid.Framework.Knockout);

        if (valueAccessor().groupBy != undefined) {
            for (var i = 0; i < valueAccessor().groupBy.length; i++) {
                options.groupBySortDescriptor.push(new TesserisPro.TGrid.SortDescriptor(valueAccessor().groupBy[i], true));
            }
        }

        if (valueAccessor().enablePaging == undefined) {
            options.isEnablePaging = false;
        } else {
            options.isEnablePaging = valueAccessor().enablePaging == "true" ? true : false;
        }

        var pageSizeAtt = valueAccessor().pageSize;
        options.pageSize = parseInt(pageSizeAtt);
        if (options.isEnablePaging) {
            options.pageSize = (isNaN(options.pageSize) || options.pageSize < 1) ? 10 : options.pageSize;
        }

        var editModeAtt = valueAccessor().selectMode;
        options.selectionMode = parseInt(editModeAtt);
        if (isNaN(options.selectionMode)) {
            options.selectionMode = 1;
        }

        if (valueAccessor().enableVirtualScroll == undefined) {
            options.isEnableVirtualScroll = false;
        } else {
            options.isEnableVirtualScroll = valueAccessor().enableVirtualScroll == "true" ? true : false;
        }

        if (valueAccessor().enableCollapsing == undefined) {
            options.isEnableCollapsing = false;
        } else {
            options.isEnableCollapsing = valueAccessor().enableCollapsing == "true" ? true : false;
        }

        if (valueAccessor().enableGrouping == undefined) {
            options.isEnableGrouping = false;
        } else {
            options.isEnableGrouping = valueAccessor().enableGrouping == "true" ? true : false;
        }

        var grid = new TesserisPro.TGrid.Grid(element, options, valueAccessor().provider);
    };

    TGridBindingHandler.prototype.update = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    };
    return TGridBindingHandler;
})();

ko.bindingHandlers.tgrid = new TGridBindingHandler();
//# sourceMappingURL=TGridBinding.js.map
