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

                this.mobileHeader = document.createElement("div");
                this.mobileHeader.setAttribute("class", "tgrid-mobile-header mobile");
                this.targetElement.appendChild(this.mobileHeader);

                this.tableHeader = document.createElement("thead");
                this.tableHeader.setAttribute("class", "tgrid-table-header desktop");
                this.table.appendChild(this.tableHeader);

                this.tableBody = document.createElement("tbody");
                this.table.appendChild(this.tableBody);
                this.targetElement.appendChild(this.table);

                this.mobileContainer = document.createElement("div");
                this.mobileContainer.setAttribute("class", "tgrid-mobile-container mobile");
                this.targetElement.appendChild(this.mobileContainer);

                this.tableFooter = document.createElement("div");
                this.tableFooter.setAttribute("class", "tgrid-footer");
                this.targetElement.appendChild(this.tableFooter);

                this.refereshTableHeader();
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
                    this.refereshTableHeader();
                    this.refreshTableBody();
                }
            };

            Grid.prototype.isSortable = function () {
                return (this.itemProvider).sort != undefined ? true : false;
            };

            Grid.prototype.selectPage = function (page) {
                this.options.currentPage = page;
                this.refereshTableHeader();
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
                var itemModels = [];

                for (var i = 0; i < items.length; i++) {
                    itemModels.push(new TGrid.ItemViewModel(null, items[i], this));
                }

                setTimeout(function () {
                    _this.tableBody.innerHTML = "";
                    _this.htmlProvider.updateTableBodyElement(_this.options, _this.tableBody, itemModels, function (x, m) {
                        return _this.selectItem(x, m);
                    });
                }, 1);

                setTimeout(function () {
                    _this.mobileContainer.innerHTML = "";
                    _this.htmlProvider.updateMobileItemsList(_this.options, _this.mobileContainer, itemModels, function (x, m) {
                        return _this.selectItem(x, m);
                    });
                }, 1);
            };

            Grid.prototype.selectItem = function (item, multi) {
                if (this.options.editMode == TGrid.EditMode.Multi) {
                    if (multi) {
                        for (var i = 0; i < this.options.selection.length; i++) {
                            if (item.item == this.options.selection[i]) {
                                this.options.selection.splice(i, 1);
                                this.refreshTableBody();
                                return false;
                            }
                        }

                        this.options.selection.push(item.item);
                    } else {
                        this.options.selection = [item.item];
                    }
                } else if (this.options.editMode == TGrid.EditMode.Single) {
                    this.options.selection = [item.item];
                } else {
                    this.options.selection = null;
                }
                this.refreshTableBody();
                return true;
            };

            Grid.prototype.getHtmlProvider = function (options) {
                if (options.framework == TGrid.Framework.Knockout) {
                    return new TGrid.KnockoutHtmlProvider();
                }

                if (options.framework == TGrid.Framework.Angular) {
                    return new TGrid.AngularHtmlProvider();
                }
            };

            Grid.prototype.refereshTableHeader = function () {
                this.htmlProvider.updateTableHeadElement(this.options, this.tableHeader, this.isSortable());
                this.htmlProvider.updateMobileHeadElement(this.options, this.mobileHeader, this.isSortable());
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
                    _this.htmlProvider.updateTableFooterElement(_this.options, _this.tableFooter, _this.totalItemsCount);
                });
            };
            return Grid;
        })();
        TGrid.Grid = Grid;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=TGrid.js.map
