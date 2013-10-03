var TesserisPro;
(function (TesserisPro) {
    /// <reference path="Scripts/typings/extenders.d.ts" />
    /// <reference path="Options.ts" />
    /// <reference path="IHtmlProvider.ts" />
    /// <reference path="IItemProvider.ts" />
    /// <reference path="ISortableItemProvider.ts" />
    /// <reference path="knockout/KnockoutHtmlProvider.ts" />
    /// <reference path="angular/AngularHtmlProvider.ts" />
    (function (TGrid) {
        var Grid = (function () {
            function Grid(element, option) {
                var _this = this;
                var htmlProvider;

                this.htmlProvider = this.getHtmlProvider(option);

                this.table = htmlProvider.getTableElement(option);
                this.table.appendChild(htmlProvider.getTableHeadElement(option));
                this.tableBody = document.createElement("tbody");
                this.table.appendChild(this.tableBody);

                this.itemProvider.getItems(this.getFirstItemNumber(), this.getPageSize(), function (items, first, count) {
                    return _this.updateItems(items, first, count);
                });

                this.table.appendChild(htmlProvider.getTableFooterElement(option));

                element.append(this.table);
            }
            Grid.prototype.sortBy = function (columnName) {
                // ((ISortableItemProvider)this.itemProvider).sort(columnName);
            };

            Grid.getGridObject = function (element) {
                if (element.grid == undefined || element.grid == null) {
                    if (element.parentElement == document.body) {
                        return null;
                    }

                    return Grid.getGridObject(element.parentElement);
                }

                return element.grid;
            };

            Grid.prototype.getFirstItemNumber = function () {
                return this.options.pageSize * this.options.currentPage;
            };

            Grid.prototype.getPageSize = function () {
                return this.options.pageSize;
            };

            Grid.prototype.updateItems = function (items, firstItem, itemsNumber) {
                this.htmlProvider.updateTableBodyElement(this.options, this.tableBody, items);
            };

            Grid.prototype.getHtmlProvider = function (options) {
                if (options.framework == TGrid.Framework.Knockout) {
                    return new TGrid.KnockoutHtmlProvider();
                }

                if (options.framework == TGrid.Framework.Angular) {
                    return new TGrid.AngularHtmlProvider();
                }
            };
            return Grid;
        })();
        TGrid.Grid = Grid;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=TGrid.js.map
