var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TesserisPro;
(function (TesserisPro) {
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
            AngularHtmlProvider.prototype.getElemntsSize = function (container, items) {
                var size = 0;
                var children = container.children;
                if (items == null) {
                    for (var i = 0; i < children.length; i++) {
                        var child = children.item(i);
                        size += child.clientHeight;
                    }
                } else {
                    for (var i = 0; i < children.length; i++) {
                        var child = children.item(i);
                        var viewModel = (items[i]);

                        if (viewModel != null && items.indexOf(viewModel) > 0) {
                            size += child.clientHeight;
                        }
                    }
                }

                return size;
            };

            AngularHtmlProvider.prototype.getFirstVisibleItem = function (container, items, scrollTop) {
                var size = 0;
                var children = container.children;
                for (var i = 0; i < children.length; i++) {
                    if (size > scrollTop) {
                        return viewModel;
                    }
                    var child = children.item(i);
                    var viewModel = (items[i]);
                    if (viewModel != null && items.indexOf(viewModel) >= 0) {
                        size += child.clientHeight;
                    }
                }

                return null;
            };

            AngularHtmlProvider.prototype.getTableElement = function (option) {
                var table = document.createElement("table");
                table.className = "tgrid-table";
                return table;
            };

            AngularHtmlProvider.prototype.getFooterViewModel = function (grid) {
                var angularFooterViewModel = new TGrid.AngularFooterViewModel(grid);
                angularFooterViewModel.angularModuleName = 'tgrid-footer-module' + AngularHtmlProvider.moduleFooterCounter++;
                angular.module(angularFooterViewModel.angularModuleName, []).controller('tgrid-footer-controller', [
                    '$scope',
                    function ($scope) {
                        angularFooterViewModel.setScope($scope);
                    }
                ]);
                return angularFooterViewModel;
            };

            AngularHtmlProvider.prototype.getFilterPopupViewModel = function (container) {
                var angularFilterPopupViewModel = new TGrid.AngularFilterPopupViewModel(container);
                angularFilterPopupViewModel.angularModuleName = 'tgrid-filter-popup-module';
                var angularFilterModule = angular.module(angularFilterPopupViewModel.angularModuleName, []).controller('tgrid-filter-popup-controller', [
                    '$scope',
                    function ($scope) {
                        angularFilterPopupViewModel.setScope($scope);
                    }
                ]);
                return angularFilterPopupViewModel;
            };

            AngularHtmlProvider.prototype.updateTableHeadElement = function (option, header, groupByContainer, filterPopupContainer, columnsResized) {
                this.updateGroupByPanel(option, groupByContainer);

                if (header.innerHTML != null && header.innerHTML != "") {
                    //add indents for groupBy
                    this.showNeededIndents(header, option.groupBySortDescriptors.length, TGrid.Grid.getGridObject(header));

                    if (option.enableSorting) {
                        this.removeArrows(header);
                        var element = header.getElementsByTagName("th");
                        var indendsQuantity = option.columns.length;
                        var columnsQuantity = option.columns.length;
                        var headerElementsQuantity = element.length;
                        for (var headerElementNumber = indendsQuantity, j = 0; headerElementNumber < headerElementsQuantity, j < columnsQuantity; headerElementNumber, j++) {
                            if (option.columns[j].device.indexOf("desktop") != -1) {
                                if (option.sortDescriptor.path == option.columns[j].sortMemberPath && option.columns[j].sortMemberPath != null) {
                                    this.addArrows(element[headerElementNumber].getElementsByClassName("tgrid-header-cell-buttons")[0], option, headerElementNumber);
                                }
                                headerElementNumber++;
                            }
                        }
                    }
                } else {
                    // Create table header
                    var head = document.createElement("tr");

                    this.appendIndent(head, option.columns.length, true);
                    this.showNeededIndents(head, option.groupBySortDescriptors.length, TGrid.Grid.getGridObject(header));

                    for (var i = 0; i < option.columns.length; i++) {
                        if (option.columns[i].device.indexOf("desktop") != -1) {
                            var headerCell = document.createElement("th");
                            headerCell.setAttribute("width", option.columns[i].width);

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
                                        return TGrid.Grid.getGridObject(e.target).sortBy(option.columns[i].sortMemberPath);
                                    };
                                })(i);

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
                                        console.log("test");
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
                            head.appendChild(headerCell);
                        }
                    }
                    var placeholderColumn = document.createElement("th");
                    placeholderColumn.classList.add("tgrid-placeholder");
                    head.appendChild(placeholderColumn);

                    header.appendChild(head);
                }
            };

            AngularHtmlProvider.prototype.updateTableBodyElement = function (option, container, items, selected) {
                if (!option.showDetailFor.isDetailColumn) {
                    option.showDetailFor.column = -1;
                }

                var angularModule = angular.module(AngularHtmlProvider.angularModuleName, []);

                for (var i = 0; i < items.length; i++) {
                    this.appendTableElement(option, container, items[i], 0, selected, AngularHtmlProvider.angularModuleName, angularModule);
                }

                //Hide table on mobile devices
                var bodyClass = container.getAttribute("class");
                if (bodyClass == null || bodyClass == undefined || bodyClass == '') {
                    bodyClass = "desktop";
                } else {
                    if (bodyClass.indexOf("desktop") == -1) {
                        bodyClass += " desktop";
                    }
                }
                container.setAttribute('class', bodyClass);
            };

            AngularHtmlProvider.prototype.addDetailRow = function (option, container) {
            };

            AngularHtmlProvider.prototype.updateTableDetailRow = function (options, container, item) {
                var detailRow = container.getElementsByClassName("tgrid-details");
                if (detailRow.length > 0) {
                    detailRow[0].parentNode.removeChild(detailRow[0]);
                }

                var targetRow;

                for (var i = 0; i < container.children.length; i++) {
                    if ((container.children.item(i))["dataContext"] == item) {
                        targetRow = container.children.item(i);
                        break;
                    }
                }

                if (targetRow != null) {
                    if (options.isSelected(item)) {
                        targetRow.classList.add("selected");
                    } else {
                        targetRow.classList.remove("selected");
                    }

                    var detailsTemplate = this.getActualDetailsTemplate(options);

                    if (detailsTemplate != null) {
                        var details = this.buildDetailsRow(options, item, detailsTemplate);
                        insertAfter(targetRow, details);
                    }
                }
            };

            AngularHtmlProvider.prototype.updateTableFooterElement = function (option, footer, totalItemsCount, footerModel) {
                if (option.tableFooterTemplate == null && option.enablePaging) {
                    this.buildDefaultTableFooterElement(option, footer, totalItemsCount);
                } else if (option.tableFooterTemplate != null) {
                    var footerContainer = document.createElement("div");
                    footerContainer.className = "tgrid-footer-container";
                    footerContainer.setAttribute("ng-controller", "tgrid-footer-controller");
                    option.tableFooterTemplate.applyTemplate(footerContainer);
                    footer.innerHTML = "";

                    angular.bootstrap(footerContainer, [(footerModel).angularModuleName]);
                    footer.appendChild(footerContainer);
                }
            };

            AngularHtmlProvider.prototype.updateFilteringPopUp = function (option, filterPopup, filterPopupModel) {
                if (option.filterPopup == null) {
                    this.buildDefaultFiltringPopUp(option, filterPopup);
                } else {
                    var filterPopupContainer = document.createElement("div");
                    filterPopupContainer.className = "tgrid-filter-popup-container";
                    filterPopupContainer.setAttribute("ng-controller", "tgrid-filter-popup-controller");
                    option.filterPopup.applyTemplate(filterPopupContainer);
                    filterPopup.innerHTML = "";

                    angular.bootstrap(filterPopupContainer, [(filterPopupModel).angularModuleName]);

                    filterPopup.appendChild(filterPopupContainer);
                }
            };

            //private methods
            AngularHtmlProvider.prototype.appendTableElement = function (option, container, item, groupLevel, selected, angularModuleName, angularModule) {
                var itemWithDetails;
                var rowWithDetail;

                if (item.isGroupHeader) {
                    var groupHeader = this.buildGroupHeaderRow(option, item.item);
                    container.appendChild(groupHeader);
                } else {
                    var row = this.buildRowElement(option, item, container, selected, angularModuleName, angularModule);
                    container.appendChild(row);
                }
            };

            AngularHtmlProvider.prototype.buildRowElement = function (option, item, container, selected, angularModuleName, angularModule) {
                var row = document.createElement("tr");
                row.classList.add("table-body-row");

                if (option.isSelected(item.item)) {
                    row.classList.add("selected");
                }
                var angularItemViewModel = new TGrid.AngularItemViewModel(item.model, item.item, item.grid, item.isGroupHeader);
                angularItemViewModel.angularControllerName = 'tgrid-row-controller' + AngularHtmlProvider.controllerItemCounter++;

                var appModule = angular.module(AngularHtmlProvider.angularModuleName, []);
                appModule.controller(angularItemViewModel.angularControllerName, [
                    '$scope',
                    function ($scope) {
                        angularItemViewModel.setScope($scope);
                    }
                ]).directive('ngShowInFocus', function () {
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
                row.setAttribute("ng-controller", angularItemViewModel.angularControllerName);

                this.appendIndent(row, option.groupBySortDescriptors.length, false);

                for (var i = 0; i < option.columns.length; i++) {
                    if (option.columns[i].device.indexOf("desktop") != -1) {
                        var cell = document.createElement("td");

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
                angular.bootstrap(row, [angularModuleName]);

                row["dataContext"] = item.item;

                var placeholderColumn = document.createElement("td");
                placeholderColumn.classList.add("tgrid-placeholder");
                row.appendChild(placeholderColumn);

                (function (item) {
                    row.onclick = function (e) {
                        if (option.selectionMode != TGrid.SelectionMode.None) {
                            selected(item, e.ctrlKey);
                        }
                    };
                })(item);

                return row;
            };

            AngularHtmlProvider.prototype.buildDetailsRow = function (option, item, template) {
                var detailTr = document.createElement("tr");
                var detailTd = document.createElement("td");

                this.appendIndent(detailTr, option.groupBySortDescriptors.length, false);

                detailTr.classList.add("tgrid-details");
                detailTd.setAttribute("colspan", (option.columns.length + 1).toString());
                template.applyTemplate(detailTd);

                var angularItemViewModel = new TGrid.AngularItemViewModel(null, item, null, null);
                angularItemViewModel.angularControllerName = 'tgrid-detail-controller' + AngularHtmlProvider.controllerItemCounter++;
                angular.module(AngularHtmlProvider.angularModuleName, []).controller(angularItemViewModel.angularControllerName, [
                    '$scope',
                    function toGridDetailsController($scope) {
                        angularItemViewModel.setScope($scope);
                    }
                ]);
                detailTd.setAttribute("ng-controller", angularItemViewModel.angularControllerName);
                detailTr.appendChild(detailTd);
                angular.bootstrap(detailTd, [AngularHtmlProvider.angularModuleName]);

                return detailTr;
            };

            AngularHtmlProvider.prototype.buildGroupHeaderRow = function (option, groupHeaderDescriptor) {
                var headerTr = document.createElement("tr");
                var headerTd = document.createElement("td");

                this.appendIndent(headerTr, groupHeaderDescriptor.level, false);

                var colspan = option.columns.length + 1 + option.groupBySortDescriptors.length - groupHeaderDescriptor.level;
                headerTd.setAttribute("colspan", colspan.toString());
                headerTd.classList.add("tgrid-table-group-header");
                headerTr.classList.add("tgrid-table-group-header");
                if (option.groupHeaderTemplate != null) {
                    option.groupHeaderTemplate.applyTemplate(headerTd);
                } else {
                    headerTd = this.createDefaultGroupHeader(headerTd);
                }

                if (option.enableCollapsing) {
                    if (!groupHeaderDescriptor.collapse) {
                        headerTd.onclick = function (e) {
                            TesserisPro.TGrid.Grid.getGridObject(e.target).setCollapsedFilters(groupHeaderDescriptor.filterDescriptor);
                        };
                    } else {
                        headerTd.onclick = function (e) {
                            TesserisPro.TGrid.Grid.getGridObject(e.target).removeCollapsedFilters(groupHeaderDescriptor.filterDescriptor);
                        };
                    }
                }

                var angularGroupViewModel = new TGrid.AngularItemViewModel(null, groupHeaderDescriptor.value, null, null);
                angularGroupViewModel.angularControllerName = 'tgrid-groupHeader-controller' + AngularHtmlProvider.controllerItemCounter++;
                angular.module(AngularHtmlProvider.angularGroupModuleName, []).controller(angularGroupViewModel.angularControllerName, [
                    '$scope',
                    function toGridGroupHeaderController($scope) {
                        angularGroupViewModel.setScope($scope);
                    }
                ]);

                headerTd.setAttribute("ng-controller", angularGroupViewModel.angularControllerName);
                headerTr.appendChild(headerTd);
                angular.bootstrap(headerTd, [AngularHtmlProvider.angularGroupModuleName]);

                return headerTr;
            };

            AngularHtmlProvider.prototype.addArrows = function (sortArrowContainer, option, columnNumber) {
                if (option.sortDescriptor.asc) {
                    var up = document.createElement("div");
                    up.classList.add("tgrid-arrow-up");
                    sortArrowContainer.appendChild(up);
                }
                if (!option.sortDescriptor.asc) {
                    var down = document.createElement("div");
                    down.classList.add("tgrid-arrow-down");
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

            // Mobile Methods
            AngularHtmlProvider.prototype.updateMobileItemsList = function (option, container, items, selected) {
                if (!option.showDetailFor.isDetailColumn) {
                    option.showDetailFor.column = -1;
                }

                for (var i = 0; i < items.length; i++) {
                    this.appendMobileElement(option, container, items[i], 0, selected);
                }

                //Hide table on mobile devices
                var bodyClass = container.getAttribute("class");
                if (bodyClass == null || bodyClass == undefined || bodyClass == '') {
                    bodyClass = "mobile";
                } else {
                    if (bodyClass.indexOf("mobile") == -1) {
                        bodyClass += " mobile";
                    }
                }
                container.setAttribute("class", bodyClass);
                option.showDetailFor.isDetailColumn = false;
            };

            AngularHtmlProvider.prototype.updateMobileDetailRow = function (options, container, item) {
                var detailRow = container.getElementsByClassName("tgrid-mobile-details");
                if (detailRow.length > 0) {
                    detailRow[0].parentNode.removeChild(detailRow[0]);
                }

                var targetRow;

                for (var i = 0; i < container.children.length; i++) {
                    if (container.children.item(i)['dataContext'] == item) {
                        targetRow = container.children.item(i);
                        break;
                    }
                }

                if (targetRow != null) {
                    if (options.isSelected(item)) {
                        targetRow.classList.add("selected");
                    } else {
                        targetRow.classList.remove("selected");
                    }

                    var detailsTemplate = this.getActualDetailsTemplate(options);

                    if (detailsTemplate != null) {
                        var details = this.buildMobileDetailsRow(options, item, detailsTemplate);
                        insertAfter(targetRow, details);
                    }
                }
            };

            AngularHtmlProvider.prototype.appendMobileElement = function (option, container, item, groupLevel, selected) {
                var itemWithDetails;
                var rowWithDetail;
                if (item.isGroupHeader) {
                    var mobileGroupHeader = this.buildGroupMobileHeaderRow(option, item.item);
                    container.appendChild(mobileGroupHeader);
                } else {
                    var row = this.buildMobileRowElement(option, item, container, selected);

                    container.appendChild(row);
                }
            };

            AngularHtmlProvider.prototype.buildMobileRowElement = function (option, item, container, selected) {
                var row = document.createElement("div");
                row.classList.add("tgrid-mobile-row");

                if (option.isSelected(item.item)) {
                    row.classList.add("selected");
                }

                for (var i = 0; i < option.groupBySortDescriptors.length; i++) {
                    row.innerHTML += "<div class='tgrid-mobile-indent-div'></div>";
                }

                var rowTemplate = document.createElement("div");
                rowTemplate.classList.add('tgrid-mobile-div');

                if (option.mobileTemplateHtml != null) {
                    option.mobileTemplateHtml.applyTemplate(rowTemplate);
                } else {
                    rowTemplate = this.createDefaultMobileTemplate(rowTemplate, option);
                }
                row.appendChild(rowTemplate);

                var angularItemViewModel = new TGrid.AngularItemViewModel(item.model, item.item, item.grid, item.isGroupHeader);
                angularItemViewModel.angularControllerName = 'tgrid-mobile-row-controller' + AngularHtmlProvider.controllerItemCounter++;
                angular.module(AngularHtmlProvider.angularModuleName).controller(angularItemViewModel.angularControllerName, [
                    '$scope',
                    function toGridFooterController($scope) {
                        angularItemViewModel.setScope($scope);
                    }
                ]);

                row.setAttribute("ng-controller", angularItemViewModel.angularControllerName);
                angular.bootstrap(row, [AngularHtmlProvider.angularModuleName]);
                row["dataContext"] = item.item;

                var placeholderColumn = document.createElement("td");
                placeholderColumn.classList.add("tgrid-placeholder");
                row.appendChild(placeholderColumn);

                (function (item) {
                    row.onclick = function (e) {
                        if (option.selectionMode != TGrid.SelectionMode.None) {
                            var s = container;
                            selected(item, e.ctrlKey);
                        }
                    };
                })(item);

                return row;
            };

            AngularHtmlProvider.prototype.createDefaultGroupHeader = function (tableRowElement) {
                var groupHeaderContainer = document.createElement("div");
                var groupHeaderName = document.createElement("span");
                groupHeaderName.innerHTML = "{{item}}";
                groupHeaderName.setAttribute("style", "color: green;");
                groupHeaderContainer.appendChild(groupHeaderName);
                tableRowElement.appendChild(groupHeaderContainer);
                return tableRowElement;
            };

            AngularHtmlProvider.prototype.buildMobileDetailsRow = function (option, item, template) {
                var detailDiv = document.createElement("div");

                detailDiv.classList.add("tgrid-mobile-details");

                template.applyTemplate(detailDiv);

                var angularItemViewModel = new TGrid.AngularItemViewModel(null, item, null, null);
                angularItemViewModel.angularControllerName = 'tgrid-detail-controller' + AngularHtmlProvider.controllerItemCounter++;
                angular.module(AngularHtmlProvider.angularModuleName, []).controller(angularItemViewModel.angularControllerName, [
                    '$scope',
                    function toGridFooterController($scope) {
                        angularItemViewModel.setScope($scope);
                    }
                ]);

                detailDiv.setAttribute("ng-controller", angularItemViewModel.angularControllerName);

                angular.bootstrap(detailDiv, [AngularHtmlProvider.angularModuleName]);

                return detailDiv;
            };

            AngularHtmlProvider.prototype.bindMobileGroupHeader = function (headerContainer, item, headerDiv) {
                var angularGroupViewModel = new TGrid.AngularItemViewModel(null, item, null, null);
                angularGroupViewModel.angularControllerName = 'tgrid-groupHeader-controller' + AngularHtmlProvider.controllerItemCounter++;
                angular.module(AngularHtmlProvider.angularGroupModuleName, []).controller(angularGroupViewModel.angularControllerName, [
                    '$scope',
                    function toGridGroupHeaderController($scope) {
                        angularGroupViewModel.setScope($scope);
                    }
                ]);

                headerDiv.setAttribute("ng-controller", angularGroupViewModel.angularControllerName);
                headerContainer.appendChild(headerDiv);
                angular.bootstrap(headerDiv, [AngularHtmlProvider.angularGroupModuleName]);
            };

            AngularHtmlProvider.prototype.createDefaultCell = function (cell, defaultCellBindingName) {
                var spanForCell = document.createElement("span");
                var textBinding = "{{item.".concat(defaultCellBindingName).concat("}}");
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
                            columnData.innerHTML = " : {{item." + option.columns[i].member + "}}";
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
            AngularHtmlProvider.moduleFooterCounter = 0;

            AngularHtmlProvider.controllerItemCounter = 0;

            AngularHtmlProvider.angularModuleName = 'tgrid-row-module';
            AngularHtmlProvider.angularGroupModuleName = 'tgrid-group-module';
            return AngularHtmlProvider;
        })(TGrid.BaseHtmlProvider);
        TGrid.AngularHtmlProvider = AngularHtmlProvider;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=AngularHtmlProvider.js.map
