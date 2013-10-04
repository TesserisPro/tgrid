/// <reference path="../Scripts/typings/knockout/knockout.d.ts" />
/// <reference path="../Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../Scripts/typings/extenders.d.ts" />
/// <reference path="../TGrid.ts" />


class TGridBindingHandler implements KnockoutBindingHandler  {
    constructor()
    {
        this.options = null;
    }
    
    public init(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: () => any, viewModel: any, bindingContext: KnockoutBindingContext): void
    {
        var options = new TesserisPro.TGrid.Options(element, TesserisPro.TGrid.Framework.Knockout);
        var grid = new TesserisPro.TGrid.Grid(element, options, valueAccessor().provider);
    }

    public update(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: () => any, viewModel: any, bindingContext: KnockoutBindingContext): void
    {

    }

    public options: any;  
}


ko.bindingHandlers.tgrid = new TGridBindingHandler();

    /*
ko.bindingHandlers.DPHeader = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var columns = valueAccessor().columns;

        var headerMarkup = "";
        for (var index = 0; index < columns.length; index++) {
            var column = columns[index];
            var widthStyle = isNotNoU(column.width) ? "min-width: " + column.width + "; max-width: " + column.width + "; width: " + column.width : "";

            // TODO: rework sort order so it changes to opposite only if column changed, otherwise make it equal 1.

            headerMarkup += "<span data-bind=\"click: function () { $root.gridConfig.sortOrder({ propertyName : '" + column.property +
            "', order: -$root.gridConfig.sortOrder().order}); " +
            "}\" style=\"" + widthStyle + "\" class=\"dp-inner-header\">" + column.header;

            // TODO: add arrow icons, leave css arrows.
            headerMarkup += "<span class=\"arrow-down\" data-bind=\"visible: $root.gridConfig.sortOrder().order == '-1' && $root.gridConfig.sortOrder().propertyName == '" +
            column.property + "'\"></span>";
            headerMarkup += "<span class=\"arrow-up\" data-bind=\"visible: $root.gridConfig.sortOrder().order == '1' && $root.gridConfig.sortOrder().propertyName == '" +
            column.property + "'\"></span>";

            headerMarkup += "</span>";
        }

        $(element).html(headerMarkup);
    },
    update: function (element, valueAccessor) {
    }
};

ko.bindingHandlers.DPContent = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var columns = valueAccessor().columns;
        var data = valueAccessor().data;
        var mobileHeader = valueAccessor().mobileHeader;
        var rowMarkup = "";
        for (var index = 0; index < columns.length; index++) {
            var column = columns[index];
            var value = data[column.property];

            var widthStyle = isNotNoU(column.width) ? "min-width: " + column.width + "; max-width: " + column.width + "; width: " + column.width : "";
            var mobileWidth = isNotNoU(mobileHeader.width) ? "min-width: " + mobileHeader.width + "; max-width: " + mobileHeader.width + "; width: " + mobileHeader.width : "";
            rowMarkup += "<div style=\"" + widthStyle + "\" class=\"dp-grid-cell\">";
            rowMarkup += "<span style=\"" + mobileWidth + "\" class=\"dp-grid-mobile-heading\">" + column.header + "</span>";
            rowMarkup += "<span class=\"dp-grid-cell-content\">" + value + "</span>";
            rowMarkup += "</div>";
        }

        $(element).html(rowMarkup);
    },
    update: function (element, valueAccessor) {
    }
};

ko.bindingHandlers.DPFooter = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var rowMarkup = "";
        rowMarkup += "<input class=\"dp-grid-paging-first\" type=\"button\" value=\"<<\" title=\"<<\"data-bind=\"click: function(){" +
        "$root.gridConfig.pageNumber(1);}\"/>"
        rowMarkup += "<input class=\"dp-grid-paging-previous\" type=\"button\" value=\"<\" title=\"<\"data-bind=\"click: " +
        "function(){var newPage = $root.gridConfig.pageNumber() - 1;" +
        "if (newPage != 0) " +
        "{$root.gridConfig.pageNumber(newPage);}}\"/>"
        rowMarkup += "Page:<input class=\"dp-grid-paging-page\" data-bind=\"value:$root.gridConfig.pageNumber\"/>" +
        " from <span data-bind=\"text:$root.gridConfig.pageCount()\"></span>"
        rowMarkup += "<input class=\"dp-grid-paging-next\" type=\"button\" value=\">\" title=\">\"data-bind=\"click: " +
        "function(){var newPage = $root.gridConfig.pageNumber() + 1;" +
        "if (newPage != $root.gridConfig.pageCount()+1) " +
        "{$root.gridConfig.pageNumber(newPage);}}\"/>"
        rowMarkup += "<input class=\"dp-grid-paging-last\" type=\"button\" value=\">>\" title=\">>\"data-bind=\"click: function(){" +
        "$root.gridConfig.pageNumber(" + valueAccessor().pageCount() + ");}\"/>"
        $(element).html(rowMarkup);
    },
    update: function (element, valueAccessor) {
    }
};

ko.bindingHandlers.MobileGridSorting = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var rowMarkup = "";
        rowMarkup += "Sorted: "
        + "<select data-bind=\"options: $root.gridConfig.columns, optionsText: 'property', value: $root.gridConfig.sortedColumn \"></select>"
        rowMarkup += "<span class=\"arrow-down\" data-bind=\"visible: $root.gridConfig.sortOrder().order == '-1',"
        + "click:function(){ var prop = $root.gridConfig.sortOrder().propertyName;  $root.gridConfig.sortOrder({ propertyName : prop, order: '1'}) }"
        + "\"></span>";
        rowMarkup += "<span class=\"arrow-up\" data-bind=\"visible: $root.gridConfig.sortOrder().order == '1',"
        + "click:function(){ var prop = $root.gridConfig.sortOrder().propertyName;  $root.gridConfig.sortOrder({ propertyName : prop, order: '-1'}) }"
        + "\"></span>";
        $(element).html(rowMarkup);
    },
    update: function (element, valueAccessor) {
    }
}


*/