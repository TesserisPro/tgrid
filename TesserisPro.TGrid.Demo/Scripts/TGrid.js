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
            function Grid(element, options, provider) {
                element.grid = this;
                this.targetElement = element;
                this.options = options;
                this.itemProvider = provider;
                this.htmlProvider = this.getHtmlProvider(this.options);

                this.table = this.htmlProvider.getTableElement(this.options);

                this.table.appendChild(this.htmlProvider.getTableHeadElement(this.options, this.isSortable()));

                this.tableBody = document.createElement("tbody");
                this.table.appendChild(this.tableBody);

                this.tableFooter = document.createElement("tfoot");
                this.table.appendChild(this.tableFooter);

                element.appendChild(this.table);

                this.refreshTableBody();
                this.refreshTableFooter();
            }
            Grid.prototype.sortBy = function (name) {
                if (this.isSortable()) {
                    if (name == this.options.sortDescriptor.column) {
                        this.options.sortDescriptor.asc = !this.options.sortDescriptor.asc;
                    } else {
                        this.options.sortDescriptor.column = name;
                        this.options.sortDescriptor.asc = false;
                    }
                    (this.itemProvider).sort(this.options.sortDescriptor);
                    this.refreshTableBody();
                }
            };

            Grid.prototype.isSortable = function () {
                return (this.itemProvider).sort != undefined ? true : false;
            };

            Grid.prototype.selectPage = function (page) {
                this.options.currentPage = page;
                this.refreshTableBody();
                this.refreshTableFooter();
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

            Grid.prototype.updateItems = function (items, firstItem, itemsNumber, total) {
                var _this = this;
                this.tableBody.innerHTML = "";

                var itemModels = [];

                for (var i = 0; i < items.length; i++) {
                    itemModels.push(new TGrid.ItemViewModel(null, items[i]));
                }
                setTimeout(function () {
                    return _this.htmlProvider.updateTableBodyElement(_this.options, _this.tableBody, itemModels);
                }, 1);
            };

            Grid.prototype.getHtmlProvider = function (options) {
                if (options.framework == TGrid.Framework.Knockout) {
                    return new TGrid.KnockoutHtmlProvider();
                }

                if (options.framework == TGrid.Framework.Angular) {
                    return new TGrid.AngularHtmlProvider();
                }
            };

            Grid.prototype.refreshTableBody = function () {
                var _this = this;
                this.itemProvider.getItems(this.getFirstItemNumber(), this.getPageSize(), function (items, first, count, total) {
                    return _this.updateItems(items, first, count, total);
                });
            };

            Grid.prototype.refreshTableFooter = function () {
                var _this = this;
                this.itemProvider.getTotalItemsCount(function (total) {
                    _this.tableFooter.innerHTML = "";
                    _this.totalItemsCount = total;
                    _this.htmlProvider.getTableFooterElement(_this.options, _this.tableFooter, _this.totalItemsCount);
                });
            };
            return Grid;
        })();
        TGrid.Grid = Grid;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=TGrid.js.map
