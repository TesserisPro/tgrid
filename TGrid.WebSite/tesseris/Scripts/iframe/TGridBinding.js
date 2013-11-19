/// <reference path="../Scripts/typings/knockout/knockout.d.ts" />
/// <reference path="../Scripts/typings/extenders.d.ts" />
/// <reference path="../TGrid.ts" />
/// <reference path="../SortDescriptor.ts" />
var TGridBindingHandler = (function () {
    function TGridBindingHandler() {
        this.options = null;
    }
    TGridBindingHandler.prototype.init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var options = new TesserisPro.TGrid.Options(element, TesserisPro.TGrid.Framework.Knockout);

        options.parentViewModel = viewModel;

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
            options.isEnableVirtualScroll = true;
        } else {
            options.isEnableVirtualScroll = valueAccessor().enableVirtualScroll == "true" ? true : false;
        }

        if (valueAccessor().enableCollapsing == undefined) {
            options.isEnableCollapsing = true;
        } else {
            options.isEnableCollapsing = valueAccessor().enableCollapsing == "true" ? true : false;
        }

        if (valueAccessor().enableGrouping == undefined) {
            options.isEnableGrouping = true;
        } else {
            options.isEnableGrouping = valueAccessor().enableGrouping == "true" ? true : false;
        }

        if (valueAccessor().enableFiltering == undefined) {
            options.isEnableFiltering = true;
        } else {
            options.isEnableFiltering = valueAccessor().enableFiltering == "true" ? true : false;
        }

        // Create grid after all other bindings are ready
        setTimeout(function () {
            var grid = new TesserisPro.TGrid.Grid(element, options, valueAccessor().provider);
        }, 1);
    };

    TGridBindingHandler.prototype.update = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    };
    return TGridBindingHandler;
})();

ko.bindingHandlers.tgrid = new TGridBindingHandler();
//# sourceMappingURL=TGridBinding.js.map
