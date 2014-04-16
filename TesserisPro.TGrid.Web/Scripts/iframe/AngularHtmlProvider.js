//=====================================================================================
//
// The Tesseris Free License
//
// Copyright(c) 2014 Tesseris Pro LLC
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this
// software and associated documentation files(the "Software"), to deal in the Software
// without restriction, including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and / or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to the following
// conditions:
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TesserisPro;
(function (TesserisPro) {
    // 1. The above copyright notice and this permission notice shall be included in all
    //    copies or substantial portions of the Software.
    //
    // 2. Any software that fully or partially contains or uses materials covered by
    //    this license shall notify users about this notice and above copyright.The
    //    notification can be made in "About box" and / or site main web - page footer.The
    //    notification shall contain name of Tesseris Pro company and name of the Software
    //    covered by current license.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
    // INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
    // PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    // HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
    // OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
    // SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    //
    //=====================================================================================
    /// <reference path="../TGrid.ts" />
    /// <reference path="../IHtmlProvider.ts" />
    /// <reference path="../BaseHtmlProvider.ts" />
    /// <reference path="../ItemViewModel.ts" />
    /// <reference path="../scripts/typings/angularjs/angular.d.ts"/>
    /// <reference path="AngularFooterViewModel.ts" />
    /// <reference path="AngularItemViewModel.ts" />
    (function (TGrid) {
        var AngularHtmlProvider = (function (_super) {
            __extends(AngularHtmlProvider, _super);
            function AngularHtmlProvider() {
                _super.apply(this, arguments);
            }
            // Table Methods
            AngularHtmlProvider.prototype.getElementsSize = function (container, items) {
                var size = 0;
                var children = container.children;
                if (containsClass(container, "mobile")) {
                    children = container.children[0].children;
                }

                for (var i = 0; i < children.length; i++) {
                    var child = children.item(i);
                    if (!containsClass(child, "ng-hide")) {
                        var viewModel = angular.element(child).scope() != undefined ? angular.element(child).scope().item.originalModel : null;

                        if (isNotNoU(viewModel) && (items == null || items.indexOf(viewModel) >= 0)) {
                            size += child.offsetHeight;
                        }
                    }
                }

                return size;
            };

            AngularHtmlProvider.prototype.getFirstVisibleItem = function (container, items, scrollTop) {
                var size = 0;
                var children = container.children;

                if (containsClass(container, "mobile")) {
                    children = container.children[0].children;
                }

                for (var i = 0, j = 0; i < children.length; i++) {
                    var child = children.item(i);
                    if (!containsClass(child, "ng-hide")) {
                        var viewModel = angular.element(child).scope() != undefined ? angular.element(child).scope().item.originalModel : null;
                        if (isNotNoU(viewModel) && items.indexOf(viewModel) >= 0) {
                            size += child.offsetHeight;

                            if (size > scrollTop) {
                                return viewModel;
                            }
                        }
                    }
                }

                return null;
            };

            AngularHtmlProvider.prototype.getVisibleItemsCount = function (container, view, items, scrollTop) {
                var size = 0;
                var visibleItemsCount = 0;
                var children = container.children;
                if (containsClass(container, "mobile")) {
                    children = container.children[0].children;
                }
                var visibleItemsSize = 0;
                for (var i = 0; i < children.length; i++) {
                    var child = children.item(i);
                    if (!containsClass(child, "ng-hide")) {
                        var viewModel = angular.element(child).scope() != undefined ? angular.element(child).scope().item.originalModel : null;
                        if (isNotNoU(viewModel) && items.indexOf(viewModel) >= 0) {
                            size += child.offsetHeight;

                            if (size > scrollTop) {
                                visibleItemsCount++;
                                visibleItemsSize += child.offsetHeight;
                            }
                        }
                    }

                    if (visibleItemsSize >= view.clientHeight) {
                        break;
                    }
                }

                return visibleItemsCount;
            };

            AngularHtmlProvider.prototype.getTableElement = function (option) {
                var table = document.createElement("table");
                table.className = "tgrid-table";
                return table;
            };

            AngularHtmlProvider.prototype.getFooterViewModel = function (grid) {
                var angularFooterViewModel = new TesserisPro.TGrid.AngularFooterViewModel(grid);
                angularFooterViewModel.angularModuleName = 'tgrid-footer-module' + AngularHtmlProvider.moduleFooterCounter++;
                angular.module(angularFooterViewModel.angularModuleName, []).controller('tgrid-footer-controller', [
                    '$scope', function ($scope) {
                        angularFooterViewModel.setScope($scope);
                    }]);
                return angularFooterViewModel;
            };

            AngularHtmlProvider.prototype.getFilterPopupViewModel = function (container) {
                var angularFilterPopupViewModel = new TesserisPro.TGrid.AngularFilterPopupViewModel(container, this.onCloseFilterPopup);
                angularFilterPopupViewModel.angularModuleName = 'tgrid-filter-popup-module';
                var angularFilterModule = angular.module(angularFilterPopupViewModel.angularModuleName, []).controller('tgrid-filter-popup-controller', [
                    '$scope', function ($scope) {
                        angularFilterPopupViewModel.setScope($scope);
                    }]);
                return angularFilterPopupViewModel;
            };

            AngularHtmlProvider.prototype.updateTableHeadElement = function (option, header, groupByContainer, filterPopupContainer, columnsResized) {
                if (option.columns.length <= 0) {
                    var grid = TesserisPro.TGrid.Grid.getGridObject(header);
                    grid.setColumnsFromItemsProvider();
                }

                this.updateGroupByPanel(option, groupByContainer);

                // Create table header
                var head = document.createElement("tr");

                this.appendIndent(head, option.columns.length, true);
                this.showNeededIndents(head, option.groupBySortDescriptors.length, TesserisPro.TGrid.Grid.getGridObject(header));

                var hasNotSizedColumn = false;
                if (option.columns.length > 0) {
                    for (var i = 0; i < option.columns.length; i++) {
                        if (option.columns[i].device.indexOf("desktop") != -1) {
                            var headerCell = document.createElement("th");
                            headerCell.className = "tgrid-header-cell";
                            headerCell.draggable = false;

                            var headerMainContainer = document.createElement("div");
                            headerMainContainer.className = "tgrid-header-cell-container";
                            var headerContent = document.createElement("div");
                            var headerButtons = document.createElement("div");
                            headerContent.className = "tgrid-header-cell-content";
                            headerContent.style.overflow = "hidden";
                            headerButtons.className = "tgrid-header-cell-buttons";
                            headerMainContainer.appendChild(headerContent);
                            headerMainContainer.appendChild(headerButtons);
                            headerCell.appendChild(headerMainContainer);

                            if (!option.columns[i].notSized) {
                                headerCell.style.width = option.columns[i].width.toString() + "px";
                            } else {
                                option.columns[i].resizable = false;
                                hasNotSizedColumn = true;
                            }

                            if (option.columns[i].header != null) {
                                option.columns[i].header.applyTemplate(headerContent);
                            } else {
                                var headerText = option.columns[i].member != null ? option.columns[i].member : "";
                                this.buildDefaultHeader(headerContent, headerText);
                            }

                            if (option.enableSorting) {
                                // Method changing sorting
                                (function (i) {
                                    headerCell.onclick = function (e) {
                                        return TesserisPro.TGrid.Grid.getGridObject(e.target).sortBy(option.columns[i].sortMemberPath);
                                    };
                                })(i);

                                // Arrows
                                if (option.sortDescriptor.path == option.columns[i].sortMemberPath && option.columns[i].sortMemberPath != null) {
                                    this.addArrows(headerButtons, option, i);
                                }
                            }

                            //filter
                            this.addFilterButton(option, header, filterPopupContainer, headerButtons, i);

                            if (option.columns[i].resizable) {
                                var columnResize = document.createElement("div");
                                columnResize.className = "tgrid-header-column-resize";

                                columnResize.onclick = function (e) {
                                    return e.stopImmediatePropagation();
                                };

                                (function (i, headerCell, columnResize) {
                                    var documentMouseMove = null;
                                    var position = 0;
                                    columnResize.onmousedown = function (e) {
                                        e.stopImmediatePropagation();
                                        position = e.screenX;
                                        documentMouseMove = document.onmousemove;
                                        document.onmousemove = function (m) {
                                            if (position != 0) {
                                                option.columns[i].width = (parseInt(option.columns[i].width) + m.screenX - position).toString();
                                                position = m.screenX;
                                                columnsResized(option.columns[i]);
                                            }
                                        };
                                    };

                                    document.onmouseup = function (e) {
                                        document.onmousemove = documentMouseMove;
                                        position = 0;
                                    };
                                })(i, headerCell, columnResize);

                                headerButtons.appendChild(columnResize);
                            }
                            if (hasNotSizedColumn) {
                                header.parentElement.style.tableLayout = "fixed";
                            }
                            head.appendChild(headerCell);
                        }
                    }
                }

                var placeholderColumn = document.createElement("th");
                addClass(placeholderColumn, "tgrid-placeholder");
                if (hasNotSizedColumn) {
                    addClass(placeholderColumn, "tgrid-placeholder-width");
                }
                head.appendChild(placeholderColumn);

                header.innerHTML = "";
                header.appendChild(head);
            };

            AngularHtmlProvider.prototype.updateTableBodyElement = function (option, container, items, selected) {
                var appModule = angular.module("TGridTbody", []);
                this.angularItemsViewModel = new TesserisPro.TGrid.AngularItemsViewModel(items, option, selected);
                var itemsViewModel = this.angularItemsViewModel;
                appModule.controller("TableCtrl", [
                    '$scope', function ($scope) {
                        itemsViewModel.setScope($scope);
                    }]).directive('ngShowInFocus', function () {
                    return {
                        replace: true,
                        restrict: 'A',
                        link: function (scope, element, attr) {
                            scope.$watch(attr.ngShowInFocus, function (value) {
                                if (value) {
                                    element.css('display', 'block');
                                    element.focus();
                                } else {
                                    element.css('display', 'none');
                                }
                            });
                        }
                    };
                });
                var parentContainer = container.parentElement;
                parentContainer.innerHTML = "";
                container = parentContainer;
                var rowsContainer = document.createElement("tbody");
                rowsContainer.style.border = "none";
                rowsContainer.setAttribute("ng-controller", "TableCtrl");
                var row = this.appendTableElement(option, container, items, 0, selected);
                row.setAttribute("ng-repeat-start", "item in items");
                row.setAttribute("ng-class", "{'tgrid-table-body-row' : !item.isGroupHeader, 'tgrid-table-group-header':  item.isGroupHeader,'tgrid-table-body-row selected': !item.isGroupHeader && item.isSelected }");
                var action = "";
                if (isNull(option.rowClick)) {
                    action = "item.select($event, item, $parent.items)";
                } else {
                    action = "item.model.".concat(option.rowClick).concat("(item.item ,$event);");
                }
                row.setAttribute("ng-click", action);
                var detailsRow = this.buildDetailsRow(option);

                rowsContainer.appendChild(row);
                rowsContainer.appendChild(detailsRow);
                angular.bootstrap(rowsContainer, ["TGridTbody"]);
                container.appendChild(rowsContainer);

                //Hide table on mobile devices
                addClass(container, "desktop");
                return rowsContainer;
            };

            AngularHtmlProvider.prototype.appendTableElement = function (option, container, items, groupLevel, selected) {
                var row = document.createElement('tr');
                if (items.length > 0) {
                    if (option.enableGrouping) {
                        if (items[0].isGroupHeader) {
                            this.buildGroupHeaderRow(option, items[0].item, row);
                        }
                    }
                    this.buildRowElement(option, items[0], container, selected, row);
                }
                return row;
            };

            AngularHtmlProvider.prototype.buildRowElement = function (option, item, container, selected, row) {
                this.appendIndentRow(row, option.columns.length);
                var hasNotSizedColumn = false;
                for (var i = 0; i < option.columns.length; i++) {
                    if (option.columns[i].device.indexOf("desktop") != -1) {
                        if (option.columns[i].notSized) {
                            hasNotSizedColumn = true;
                        }
                        var cell = document.createElement("td");
                        cell.setAttribute("ng-hide", "item.isGroupHeader");
                        cell.className = "tgrid-table-data-cell";

                        var cellContent = document.createElement("div");
                        cellContent.className = "tgrid-cell-content";
                        cellContent.style.overflow = "hidden";
                        cell.appendChild(cellContent);

                        if (option.columns[i].cell != null) {
                            option.columns[i].cell.applyTemplate(cellContent);
                        } else {
                            if (option.columns[i].member != null) {
                                this.createDefaultCell(cellContent, option.columns[i].member);
                            }
                        }
                        row.appendChild(cell);
                    }
                }
                if (hasNotSizedColumn) {
                    container.style.tableLayout = "fixed";
                    container.parentElement.style.overflowY = "scroll";
                }

                row["dataContext"] = item.item;

                if (!hasNotSizedColumn) {
                    var placeholderColumn = document.createElement("td");
                    addClass(placeholderColumn, "tgrid-placeholder");
                    addClass(placeholderColumn, "tgrid-table-data-cell");
                    placeholderColumn.setAttribute("ng-hide", "item.isGroupHeader");
                    row.appendChild(placeholderColumn);
                }
            };

            AngularHtmlProvider.prototype.buildGroupHeaderRow = function (option, groupHeaderDescriptor, groupHeaderTr) {
                this.appendIndentGroupHeader(groupHeaderTr, option.columns.length);
                var groupHeaderTd = document.createElement("td");
                groupHeaderTd.setAttribute("colspan", "{{item.colspan}}");
                addClass(groupHeaderTd, "tgrid-table-group-header");
                groupHeaderTd.setAttribute("ng-hide", "!item.isGroupHeader");
                if (option.groupHeaderTemplate != null) {
                    option.groupHeaderTemplate.applyTemplate(groupHeaderTd);
                } else {
                    groupHeaderTd = this.createDefaultGroupHeader(groupHeaderTd);
                }

                if (option.enableCollapsing) {
                    addClass(groupHeaderTd, "collapsing");
                    groupHeaderTd.setAttribute("ng-click", "item.toggleGroupCollapsing($event, item); $event.stopPropagation();");
                }
                groupHeaderTr.appendChild(groupHeaderTd);
            };

            AngularHtmlProvider.prototype.buildDetailsRow = function (option) {
                var detailTr = document.createElement("tr");
                detailTr.setAttribute("ng-repeat-end", "");
                detailTr.setAttribute("ng-hide", "!item.showDetail");

                var indentsAreAppended = false;
                if (isNotNull(option.detailsTemplateHtml)) {
                    var detailTd = document.createElement("td");
                    this.appendIndentRow(detailTr, option.groupBySortDescriptors.length);
                    indentsAreAppended = true;
                    addClass(detailTr, "tgrid-details");
                    detailTd.setAttribute("colspan", "{{item.detailsColspan}}");
                    detailTd.setAttribute("ng-hide", "$parent.options.showDetailFor.item != item.item || $parent.options.showDetailFor.column != -1");
                    option.detailsTemplateHtml.applyTemplate(detailTd);
                    detailTr.appendChild(detailTd);
                }
                for (var i = 0; i < option.columns.length; i++) {
                    if (isNotNull(option.columns[i].cellDetail)) {
                        var detailTd = document.createElement("td");
                        if (!indentsAreAppended) {
                            this.appendIndentRow(detailTr, option.groupBySortDescriptors.length);
                            indentsAreAppended = true;
                        }

                        addClass(detailTr, "tgrid-details");
                        detailTd.setAttribute("colspan", "{{item.detailsColspan}}");
                        detailTd.setAttribute("ng-hide", "$parent.options.showDetailFor.item != item.item || $parent.options.showDetailFor.column !=".concat(i.toString()));
                        option.columns[i].cellDetail.applyTemplate(detailTd);
                        detailTr.appendChild(detailTd);
                    }
                }
                return detailTr;
            };

            AngularHtmlProvider.prototype.updateTableDetailRow = function (options, container, item, isDetailsAdded) {
                this.angularItemsViewModel.setItemSelection(item, options.isSelected(item), isDetailsAdded);
            };

            AngularHtmlProvider.prototype.updateTableFooterElement = function (option, footer, totalItemsCount, footerModel) {
                //if there isn't footer template in grid
                if (option.tableFooterTemplate == null && option.enablePaging) {
                    this.buildDefaultTableFooterElement(option, footer, totalItemsCount);
                } else if (option.tableFooterTemplate != null) {
                    if (!footer.hasChildNodes()) {
                        var footerContainer = document.createElement("div");
                        footerContainer.className = "tgrid-footer-container";
                        footerContainer.setAttribute("ng-controller", "tgrid-footer-controller");
                        option.tableFooterTemplate.applyTemplate(footerContainer);

                        angular.bootstrap(footerContainer, [footerModel.angularModuleName]);
                        footer.appendChild(footerContainer);
                    } else {
                        footerModel.apply();
                    }
                } else {
                    footer.innerHTML = "";
                }
            };

            AngularHtmlProvider.prototype.updateFilteringPopUp = function (option, filterPopup, filterPopupModel) {
                if (option.filterPopup == null) {
                    var filterPopupContainer = document.createElement("div");
                    filterPopupContainer.className = "tgrid-filter-popup-container";
                    filterPopupContainer.setAttribute("ng-controller", "tgrid-filter-popup-controller");
                    this.buildDefaultFilteringPopUp(option, filterPopupContainer);
                    angular.bootstrap(filterPopupContainer, [filterPopupModel.angularModuleName]);

                    filterPopup.appendChild(filterPopupContainer);
                } else {
                    var filterPopupContainer = document.createElement("div");
                    filterPopupContainer.className = "tgrid-filter-popup-container";
                    filterPopupContainer.setAttribute("ng-controller", "tgrid-filter-popup-controller");
                    option.filterPopup.applyTemplate(filterPopupContainer);
                    filterPopup.innerHTML = "";

                    angular.bootstrap(filterPopupContainer, [filterPopupModel.angularModuleName]);

                    filterPopup.appendChild(filterPopupContainer);
                }
            };

            //private methods
            AngularHtmlProvider.prototype.addArrows = function (sortArrowContainer, option, columnNumber) {
                if (option.sortDescriptor.asc) {
                    var up = document.createElement("div");
                    addClass(up, "tgrid-arrow-up");
                    sortArrowContainer.appendChild(up);
                }
                if (!option.sortDescriptor.asc) {
                    var down = document.createElement("div");
                    addClass(down, "tgrid-arrow-down");
                    sortArrowContainer.appendChild(down);
                }
                return sortArrowContainer;
            };

            AngularHtmlProvider.prototype.removeArrows = function (htmlNode) {
                var element = htmlNode.getElementsByClassName("tgrid-arrow-up");
                for (var i = 0; i < element.length; i++) {
                    element[i].parentNode.removeChild(element[i]);
                    i--;
                }
                var element = htmlNode.getElementsByClassName("tgrid-arrow-down");
                for (var i = 0; i < element.length; i++) {
                    element[i].parentNode.removeChild(element[i]);
                    i--;
                }
            };

            AngularHtmlProvider.prototype.removeFilterButtons = function (container) {
                var elements = container.getElementsByClassName("tgrid-filter-button");
                for (var i = 0; i < elements.length; i++) {
                    elements[i].parentNode.removeChild(elements[i]);
                    i--;
                }
                var elements = container.getElementsByClassName("tgrid-filter-button-active");
                for (var i = 0; i < elements.length; i++) {
                    elements[i].parentNode.removeChild(elements[i]);
                    i--;
                }
            };

            // Mobile Methods
            AngularHtmlProvider.prototype.updateMobileItemsList = function (option, container, items, selected) {
                var appModule = angular.module("TGridTbody", []);
                this.angularMobileItemsViewModel = new TesserisPro.TGrid.AngularItemsViewModel(items, option, selected);
                var itemsViewModel = this.angularMobileItemsViewModel;
                appModule.controller("TableCtrl", [
                    '$scope', function ($scope) {
                        itemsViewModel.setScope($scope);
                    }]).directive('ngShowInFocus', function () {
                    return {
                        replace: true,
                        restrict: 'A',
                        link: function (scope, element, attr) {
                            scope.$watch(attr.ngShowInFocus, function (value) {
                                if (value) {
                                    element.css('display', 'block');
                                    element.focus();
                                } else {
                                    element.css('display', 'none');
                                }
                            });
                        }
                    };
                });
                var rowsContainer = document.createElement('div');
                var mobileContainer = document.createElement('div');
                rowsContainer.setAttribute("ng-controller", "TableCtrl");
                mobileContainer = this.appendMobileTableElement(option, container, items, 0, selected);
                mobileContainer.setAttribute("ng-repeat-start", "item in items");
                mobileContainer.setAttribute("ng-class", "{'tgrid-mobile-row' : !item.isGroupHeader, 'tgrid-mobile-group-header':  item.isGroupHeader,'tgrid-mobile-row selected': !item.isGroupHeader && item.isSelected }");
                var action = "item.select($event, item, $parent.items)";
                if (isNotNull(option.rowClick)) {
                    action = "item.model.".concat(option.rowClick).concat("(item.item ,$event);");
                }
                mobileContainer.setAttribute("ng-click", "!item.isGroupHeader ? ".concat(action).concat(" : item.toggleGroupCollapsing($event, item)"));
                rowsContainer.appendChild(mobileContainer);
                var detailsRow = this.buildMobileDetailsRow(option);
                rowsContainer.appendChild(detailsRow);

                angular.bootstrap(rowsContainer, ["TGridTbody"]);
                container.appendChild(rowsContainer);

                //Hide table on mobile devices
                addClass(container, "mobile");
                option.showDetailFor.column = -1;
            };

            AngularHtmlProvider.prototype.appendMobileTableElement = function (option, container, items, groupLevel, selected) {
                var mobileRow = document.createElement('div');
                if (items.length > 0) {
                    if (option.enableGrouping) {
                        if (items[0].isGroupHeader) {
                            this.buildMobileGroupHeaderRow(option, items[0].item, mobileRow);
                        }
                    }
                    this.buildMobileRowElement(option, items[0].item, container, selected, mobileRow);
                }
                return mobileRow;
            };

            AngularHtmlProvider.prototype.updateMobileDetailRow = function (option, container, item, shouldAddDetails) {
                this.angularMobileItemsViewModel.setItemSelection(item, option.isSelected(item), shouldAddDetails);
            };

            AngularHtmlProvider.prototype.buildMobileGroupHeaderRow = function (option, item, mobileRow) {
                this.appendIndentMobileGroupHeader(mobileRow, option.columns.length);

                var headerDiv = document.createElement("div");
                headerDiv.setAttribute("ng-hide", "!item.isGroupHeader");

                if (option.groupHeaderTemplate != null) {
                    option.groupHeaderTemplate.applyTemplate(headerDiv);
                } else {
                    this.createDefaultGroupHeader(headerDiv);
                }

                addClass(headerDiv, 'tgrid-mobile-group-header-container');

                if (option.enableCollapsing) {
                    addClass(mobileRow, "collapsing");
                }
                mobileRow.appendChild(headerDiv);
            };
            AngularHtmlProvider.prototype.appendIndentMobileGroupHeader = function (target, level) {
                for (var i = 0; i < level; i++) {
                    var indentDiv = document.createElement("div");
                    indentDiv.className = "tgrid-mobile-group-indent-div";
                    indentDiv.setAttribute("ng-hide", "!item.isGroupHeader || ".concat(i.toString()).concat(" >= item.item.level"));
                    target.appendChild(indentDiv);
                }
            };

            AngularHtmlProvider.prototype.buildMobileRowElement = function (option, item, container, selected, mobileRow) {
                this.appendIndentMobileRow(mobileRow, option.groupBySortDescriptors.length);

                var rowTemplate = document.createElement("div");
                rowTemplate.setAttribute("ng-hide", "item.isGroupHeader");
                rowTemplate.className = "tgrid-mobile-div";

                if (option.mobileTemplateHtml != null) {
                    option.mobileTemplateHtml.applyTemplate(rowTemplate);
                } else {
                    rowTemplate = this.createDefaultMobileTemplate(rowTemplate, option);
                }
                mobileRow.appendChild(rowTemplate);

                mobileRow["dataContext"] = item.item;
            };

            AngularHtmlProvider.prototype.appendIndentMobileRow = function (target, level) {
                for (var i = 0; i < level; i++) {
                    var indentDiv = document.createElement("div");
                    indentDiv.className = "tgrid-mobile-row-indent-div";
                    indentDiv.setAttribute("ng-hide", "item.isGroupHeader || ".concat(i.toString()).concat(" >= item.item.level"));
                    target.appendChild(indentDiv);
                }
            };

            AngularHtmlProvider.prototype.buildMobileDetailsRow = function (option) {
                var mobileDetailsContainer = document.createElement("div");
                mobileDetailsContainer.setAttribute("ng-repeat-end", "");
                mobileDetailsContainer.setAttribute("ng-hide", "!item.showDetail");
                addClass(mobileDetailsContainer, "tgrid-mobile-details");
                var indentsAreAppended = false;
                if (isNotNull(option.detailsTemplateHtml)) {
                    var detailRowMobile = document.createElement("div");
                    this.appendIndentMobileRow(mobileDetailsContainer, option.groupBySortDescriptors.length);
                    indentsAreAppended = true;
                    detailRowMobile.setAttribute("ng-hide", "$parent.options.showDetailFor.item != item.item || $parent.options.showDetailFor.column != -1");
                    option.detailsTemplateHtml.applyTemplate(detailRowMobile);
                    mobileDetailsContainer.appendChild(detailRowMobile);
                }
                for (var i = 0; i < option.columns.length; i++) {
                    if (isNotNull(option.columns[i].cellDetail)) {
                        var detailCellMobile = document.createElement("div");
                        if (!indentsAreAppended) {
                            this.appendIndentMobileRow(mobileDetailsContainer, option.groupBySortDescriptors.length);
                            indentsAreAppended = true;
                        }

                        addClass(mobileDetailsContainer, "tgrid-details");
                        detailCellMobile.setAttribute("ng-hide", "$parent.options.showDetailFor.item != item.item || $parent.options.showDetailFor.column !=".concat(i.toString()));
                        option.columns[i].cellDetail.applyTemplate(detailCellMobile);
                        mobileDetailsContainer.appendChild(detailCellMobile);
                    }
                }
                return mobileDetailsContainer;
            };

            AngularHtmlProvider.prototype.createDefaultGroupHeader = function (tableRowElement) {
                var groupHeaderContainer = document.createElement("div");
                var groupHeaderName = document.createElement("span");
                groupHeaderName.innerHTML = "{{item.item.value}}";
                groupHeaderContainer.appendChild(groupHeaderName);
                tableRowElement.appendChild(groupHeaderContainer);
                return tableRowElement;
            };

            AngularHtmlProvider.prototype.createDefaultCell = function (cell, defaultCellBindingName) {
                var spanForCell = document.createElement("span");
                var textBinding = "{{item.item.".concat(defaultCellBindingName).concat("}}");
                spanForCell.innerHTML = textBinding;
                cell.appendChild(spanForCell);
            };

            AngularHtmlProvider.prototype.createDefaultMobileTemplate = function (rowTemplate, option) {
                for (var i = 0; i < option.columns.length; i++) {
                    if (option.columns[i].device.indexOf("mobile") != -1) {
                        var mobileColumnContainer = document.createElement("div");
                        var mobileColumnName = document.createElement("span");

                        if (option.columns[i].member != null) {
                            mobileColumnName.innerHTML = option.columns[i].member;
                        } else if (option.columns[i].sortMemberPath != null) {
                            mobileColumnName.innerHTML = option.columns[i].sortMemberPath;
                        } else if (option.columns[i].groupMemberPath != null) {
                            mobileColumnName.innerHTML = option.columns[i].groupMemberPath;
                        } else {
                            mobileColumnName.innerHTML = "";
                        }

                        var columnData = document.createElement("span");
                        if (option.columns[i].member != null) {
                            var columnBinding = document.createElement('span');
                            columnData.innerHTML = ": {{item.item." + option.columns[i].member + "}}";
                            columnData.appendChild(columnBinding);
                        } else {
                            columnData.innerHTML = ": ";
                        }
                        mobileColumnContainer.appendChild(mobileColumnName);
                        mobileColumnContainer.appendChild(columnData);
                        rowTemplate.appendChild(mobileColumnContainer);
                    }
                }
                return rowTemplate;
            };
            AngularHtmlProvider.prototype.buildDefaultFilteringPopUp = function (option, filterPopupContainer) {
                var columnNameContainer = document.createElement("div");
                var columnName = document.createElement("span");
                columnName.innerHTML = "{{path}}";
                columnNameContainer.appendChild(columnName);
                filterPopupContainer.appendChild(columnNameContainer);

                var filterCondition = document.createElement("select");

                // append filter conditions
                var selectOption = document.createElement("option");
                selectOption.value = 0 /* None */.toString();
                selectOption.text = "None";
                filterCondition.appendChild(selectOption);

                var selectOption = document.createElement("option");
                selectOption.value = 1 /* Equals */.toString();
                selectOption.text = "Equals";
                filterCondition.appendChild(selectOption);

                var selectOption = document.createElement("option");
                selectOption.value = 2 /* NotEquals */.toString();
                selectOption.text = "Not equals";
                filterCondition.appendChild(selectOption);

                // end append filter conditions
                filterPopupContainer.appendChild(filterCondition);
                filterCondition.selectedIndex = 1;

                var filterText = document.createElement("input");
                filterText.type = "text";
                filterText.className = 'tgrid-filter-input-text';
                filterText.setAttribute("value", "");
                filterText.style.width = '150px';
                filterPopupContainer.appendChild(filterText);

                filterPopupContainer.innerHTML += "<br>";

                var applyButton = document.createElement("div");
                applyButton.className = "tgrid-filter-popup-button";
                applyButton.style.width = '70px';
                applyButton.onclick = function (e) {
                    var grid = TesserisPro.TGrid.Grid.getGridObject(e.target);
                    grid.filterPopupViewModel.onApply();
                };
                applyButton.innerHTML = "OK";
                filterPopupContainer.appendChild(applyButton);

                var clearButton = document.createElement("div");
                clearButton.className = 'tgrid-filter-popup-button';
                clearButton.style.width = '70px';
                clearButton.onclick = function (e) {
                    var grid = TesserisPro.TGrid.Grid.getGridObject(e.target);
                    grid.filterPopupViewModel.onClose();
                    filterText.setAttribute("value", "");
                };
                clearButton.innerHTML = 'Cancel';
                filterPopupContainer.appendChild(clearButton);
            };

            AngularHtmlProvider.prototype.appendIndentRow = function (target, level) {
                for (var i = 0; i < level; i++) {
                    var cell = document.createElement("td");
                    cell.className = "tgrid-table-indent-cell";
                    cell.setAttribute("ng-hide", "item.isGroupHeader || $parent.options.groupBySortDescriptors.length <=".concat(i.toString()));
                    var indentContent = document.createElement("div");
                    indentContent.className = "tgrid-table-indent-cell-content";
                    cell.appendChild(indentContent);
                    target.appendChild(cell);
                }
            };
            AngularHtmlProvider.prototype.appendIndentGroupHeader = function (target, level) {
                for (var i = 0; i < level; i++) {
                    var cell = document.createElement("td");
                    cell.className = "tgrid-table-indent-cell";
                    cell.setAttribute("ng-hide", "!item.isGroupHeader || item.item.level <= ".concat(i.toString()));
                    var indentContent = document.createElement("div");
                    indentContent.className = "tgrid-table-indent-cell-content";
                    cell.appendChild(indentContent);
                    target.appendChild(cell);
                }
            };
            AngularHtmlProvider.moduleFooterCounter = 0;
            return AngularHtmlProvider;
        })(TesserisPro.TGrid.BaseHtmlProvider);
        TGrid.AngularHtmlProvider = AngularHtmlProvider;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=AngularHtmlProvider.js.map
