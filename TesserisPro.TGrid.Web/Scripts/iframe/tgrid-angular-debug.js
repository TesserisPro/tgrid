//!=====================================================================================
//!
//! The Tesseris Free License
//!
//! Copyright(c) 2014 Tesseris Pro LLC
//!
//! Permission is hereby granted, free of charge, to any person obtaining a copy of this 
//! software and associated documentation files(the "Software"), to deal in the Software 
//! without restriction, including without limitation the rights to use, copy, modify,
//! merge, publish, distribute, sublicense, and / or sell copies of the Software, and to 
//! permit persons to whom the Software is furnished to do so, subject to the following
//! conditions:
//!
//! 1. The above copyright notice and this permission notice shall be included in all 
//!    copies or substantial portions of the Software.
//!
//! 2. Any software that fully or partially contains or uses materials covered by 
//!    this license shall notify users about this notice and above copyright.The 
//!    notification can be made in "About box" and / or site main web - page footer.The 
//!    notification shall contain name of Tesseris Pro company and name of the Software 
//!    covered by current license.
//!
//! THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
//! INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
//! PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
//! HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION 
//! OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
//! SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//!
//!=====================================================================================
;
var __extends = this.__extends || function(d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d
        }
        __.prototype = b.prototype;
        d.prototype = new __
    };
var TesserisPro;
(function(TesserisPro) {
    (function(TGrid) {
        var AngularHtmlProvider = (function(_super) {
                __extends(AngularHtmlProvider, _super);
                function AngularHtmlProvider() {
                    _super.apply(this, arguments)
                }
                AngularHtmlProvider.prototype.getElementsSize = function(container, items) {
                    var size = 0;
                    var children = container.children;
                    if (containsClass(container, "mobile")) {
                        children = (container.children[0]).children
                    }
                    for (var i = 0; i < children.length; i++) {
                        var child = children.item(i);
                        if (!containsClass(child, "ng-hide")) {
                            var viewModel = angular.element(child).scope() != undefined ? (angular.element(child).scope()).item.originalModel : null;
                            if (isNotNoU(viewModel) && (items == null || items.indexOf(viewModel) >= 0)) {
                                size += child.offsetHeight
                            }
                        }
                    }
                    return size
                };
                AngularHtmlProvider.prototype.getFirstVisibleItem = function(container, items, scrollTop) {
                    var size = 0;
                    var children = container.children;
                    if (containsClass(container, "mobile")) {
                        children = (container.children[0]).children
                    }
                    for (var i = 0, j = 0; i < children.length; i++) {
                        var child = children.item(i);
                        if (!containsClass(child, "ng-hide")) {
                            var viewModel = angular.element(child).scope() != undefined ? (angular.element(child).scope()).item.originalModel : null;
                            if (isNotNoU(viewModel) && items.indexOf(viewModel) >= 0) {
                                size += child.offsetHeight;
                                if (size > scrollTop) {
                                    return viewModel
                                }
                            }
                        }
                    }
                    return null
                };
                AngularHtmlProvider.prototype.getVisibleItemsCount = function(container, view, scrollTop, skipGroupHeaders) {
                    var size = 0;
                    var visibleItemsCount = 0;
                    var children = container.children;
                    if (containsClass(container, "mobile")) {
                        children = (container.children[0]).children
                    }
                    var visibleItemsSize = 0;
                    for (var i = 0; i < children.length; i++) {
                        var child = children.item(i);
                        if (!containsClass(child, "ng-hide")) {
                            size += child.offsetHeight;
                            if (size > scrollTop) {
                                if (!skipGroupHeaders || !containsClass(child, "tgrid-table-group-header")) {
                                    visibleItemsCount++
                                }
                                visibleItemsSize += child.offsetHeight
                            }
                        }
                        if (visibleItemsSize >= view.clientHeight) {
                            break
                        }
                    }
                    return visibleItemsCount
                };
                AngularHtmlProvider.prototype.getTableElement = function(option) {
                    var table = document.createElement("table");
                    table.className = "tgrid-table";
                    return table
                };
                AngularHtmlProvider.prototype.getFooterViewModel = function(grid) {
                    var angularFooterViewModel = new TGrid.AngularFooterViewModel(grid);
                    angularFooterViewModel.angularModuleName = 'tgrid-footer-module' + AngularHtmlProvider.moduleFooterCounter++;
                    angular.module(angularFooterViewModel.angularModuleName, []).controller('tgrid-footer-controller', ['$scope', function($scope) {
                            angularFooterViewModel.setScope($scope)
                        }]);
                    return angularFooterViewModel
                };
                AngularHtmlProvider.prototype.getFilterPopupViewModel = function(container) {
                    var angularFilterPopupViewModel = new TGrid.AngularFilterPopupViewModel(container, this.onCloseFilterPopup);
                    angularFilterPopupViewModel.angularModuleName = 'tgrid-filter-popup-module';
                    var angularFilterModule = angular.module(angularFilterPopupViewModel.angularModuleName, []).controller('tgrid-filter-popup-controller', ['$scope', function($scope) {
                                angularFilterPopupViewModel.setScope($scope)
                            }]);
                    return angularFilterPopupViewModel
                };
                AngularHtmlProvider.prototype.updateTableHeadElement = function(option, header, groupByContainer, filterPopupContainer, columnsResized) {
                    if (option.columns.length <= 0) {
                        var grid = TesserisPro.TGrid.Grid.getGridObject(header);
                        grid.setColumnsFromItemsProvider()
                    }
                    this.updateGroupByPanel(option, groupByContainer);
                    var head = document.createElement("tr");
                    this.appendIndent(head, option.columns.length, true);
                    this.showNeededIndents(head, option.groupBySortDescriptors.length, TGrid.Grid.getGridObject(header));
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
                                headerButtons.className = "tgrid-header-cell-buttons";
                                headerMainContainer.appendChild(headerContent);
                                headerMainContainer.appendChild(headerButtons);
                                headerCell.appendChild(headerMainContainer);
                                if (!option.columns[i].notSized) {
                                    headerCell.style.width = option.columns[i].width.toString() + "px"
                                }
                                else {
                                    option.columns[i].resizable = false
                                }
                                if (option.columns[i].header != null) {
                                    option.columns[i].header.applyTemplate(headerContent)
                                }
                                else {
                                    var headerText = option.columns[i].member != null ? option.columns[i].member : "";
                                    this.buildDefaultHeader(headerContent, headerText)
                                }
                                if (option.enableSorting && option.columns[i].enableSorting) {
                                    (function(i) {
                                        headerCell.onclick = function(e) {
                                            return TGrid.Grid.getGridObject(e.target).sortBy(option.columns[i].sortMemberPath)
                                        }
                                    })(i);
                                    if (option.sortDescriptor.path == option.columns[i].sortMemberPath && option.columns[i].sortMemberPath != null) {
                                        this.addArrows(headerButtons, option, i)
                                    }
                                }
                                if (option.enableFiltering && option.columns[i].enableFiltering) {
                                    this.addFilterButton(option, header, filterPopupContainer, headerButtons, i)
                                }
                                if (option.columns[i].resizable) {
                                    var columnResize = document.createElement("div");
                                    columnResize.className = "tgrid-header-column-resize";
                                    columnResize.onclick = function(e) {
                                        return e.stopImmediatePropagation()
                                    };
                                    var self = this;
                                    (function(i, headerCell, columnResize) {
                                        var documentMouseMove = null;
                                        var position = 0;
                                        columnResize.onmousedown = function(e) {
                                            e.stopImmediatePropagation();
                                            position = e.screenX;
                                            documentMouseMove = document.onmousemove;
                                            document.onmousemove = function(m) {
                                                if (position != 0) {
                                                    if (option.columns[i].width.indexOf("%") == -1) {
                                                        var width = parseInt(option.columns[i].width)
                                                    }
                                                    else {
                                                        var gridWidth = self.getGridWidth(header);
                                                        var percentInt = parseInt(option.columns[i].width.substring(0, option.columns[i].width.indexOf("%")));
                                                        var width = gridWidth * percentInt / 100
                                                    }
                                                    option.columns[i].width = (width + m.screenX - position).toString();
                                                    position = m.screenX;
                                                    columnsResized(option.columns[i])
                                                }
                                            }
                                        };
                                        document.onmouseup = function(e) {
                                            document.onmousemove = documentMouseMove;
                                            position = 0
                                        }
                                    })(i, headerCell, columnResize);
                                    headerButtons.appendChild(columnResize)
                                }
                                if (option.hasAnyNotSizedColumn) {
                                    header.parentElement.style.tableLayout = "fixed"
                                }
                                head.appendChild(headerCell)
                            }
                        }
                    }
                    var placeholderColumn = document.createElement("th");
                    if (option.hasAnyNotSizedColumn) {
                        addClass(placeholderColumn, "tgrid-placeholder-width")
                    }
                    else {
                        addClass(placeholderColumn, "tgrid-placeholder")
                    }
                    head.appendChild(placeholderColumn);
                    header.innerHTML = "";
                    header.appendChild(head)
                };
                AngularHtmlProvider.prototype.updateTableBodyElement = function(option, container, items, selected) {
                    var appModule = angular.module("TGridTbody", []);
                    this.angularItemsViewModel = new TesserisPro.TGrid.AngularItemsViewModel(items, option, selected);
                    var itemsViewModel = this.angularItemsViewModel;
                    appModule.controller("TableCtrl", ['$scope', function($scope) {
                            itemsViewModel.setScope($scope)
                        }]).directive('ngShowInFocus', function() {
                        return {
                                replace: true, restrict: 'A', link: function(scope, element, attr) {
                                        scope.$watch(attr.ngShowInFocus, function(value) {
                                            if (value) {
                                                element.css('display', 'block');
                                                element.focus()
                                            }
                                            else {
                                                element.css('display', 'none')
                                            }
                                        })
                                    }
                            }
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
                        action = "item.select($event, item, $parent.items)"
                    }
                    else {
                        action = "item.model.".concat(option.rowClick).concat("(item.item ,$event)")
                    }
                    row.setAttribute("ng-click", action);
                    var detailsRow = this.buildDetailsRow(option);
                    rowsContainer.appendChild(row);
                    rowsContainer.appendChild(detailsRow);
                    angular.bootstrap(rowsContainer, ["TGridTbody"]);
                    container.appendChild(rowsContainer);
                    addClass(container, "desktop");
                    return rowsContainer
                };
                AngularHtmlProvider.prototype.appendTableElement = function(option, container, items, groupLevel, selected) {
                    var row = document.createElement('tr');
                    if (items.length > 0) {
                        if (option.enableGrouping) {
                            if (items[0].isGroupHeader) {
                                this.buildGroupHeaderRow(option, items[0].item, row)
                            }
                        }
                        this.buildRowElement(option, items[0], container, selected, row)
                    }
                    return row
                };
                AngularHtmlProvider.prototype.buildRowElement = function(option, item, container, selected, row) {
                    this.appendIndentRow(row, option.columns.length);
                    for (var i = 0; i < option.columns.length; i++) {
                        if (option.columns[i].device.indexOf("desktop") != -1) {
                            var cell = document.createElement("td");
                            cell.setAttribute("ng-hide", "item.isGroupHeader");
                            cell.className = "tgrid-table-data-cell";
                            var cellContent = document.createElement("div");
                            cellContent.className = "tgrid-cell-content";
                            cell.appendChild(cellContent);
                            if (option.columns[i].cell != null) {
                                option.columns[i].cell.applyTemplate(cellContent)
                            }
                            else {
                                if (option.columns[i].member != null) {
                                    this.createDefaultCell(cellContent, option.columns[i].member)
                                }
                            }
                            row.appendChild(cell)
                        }
                    }
                    if (option.hasAnyNotSizedColumn) {
                        container.style.tableLayout = "fixed";
                        container.parentElement.style.overflowY = "scroll"
                    }
                    row["dataContext"] = item.item;
                    if (!option.hasAnyNotSizedColumn) {
                        var placeholderColumn = document.createElement("td");
                        addClass(placeholderColumn, "tgrid-placeholder");
                        addClass(placeholderColumn, "tgrid-table-data-cell");
                        placeholderColumn.setAttribute("ng-hide", "item.isGroupHeader");
                        row.appendChild(placeholderColumn)
                    }
                };
                AngularHtmlProvider.prototype.buildGroupHeaderRow = function(option, groupHeaderDescriptor, groupHeaderTr) {
                    this.appendIndentGroupHeader(groupHeaderTr, option.columns.length);
                    var groupHeaderTd = document.createElement("td");
                    groupHeaderTd.setAttribute("colspan", "{{item.colspan}}");
                    addClass(groupHeaderTd, "tgrid-table-group-header");
                    groupHeaderTd.setAttribute("ng-hide", "!item.isGroupHeader");
                    if (option.groupHeaderTemplate != null) {
                        option.groupHeaderTemplate.applyTemplate(groupHeaderTd)
                    }
                    else {
                        groupHeaderTd = this.createDefaultGroupHeader(groupHeaderTd)
                    }
                    if (option.enableCollapsing) {
                        addClass(groupHeaderTd, "collapsing");
                        groupHeaderTd.setAttribute("ng-click", "item.toggleGroupCollapsing($event, item); $event.stopPropagation();")
                    }
                    groupHeaderTr.appendChild(groupHeaderTd)
                };
                AngularHtmlProvider.prototype.buildDetailsRow = function(option) {
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
                        detailTr.appendChild(detailTd)
                    }
                    for (var i = 0; i < option.columns.length; i++) {
                        if (isNotNull(option.columns[i].cellDetail)) {
                            var detailTd = document.createElement("td");
                            if (!indentsAreAppended) {
                                this.appendIndentRow(detailTr, option.groupBySortDescriptors.length);
                                indentsAreAppended = true
                            }
                            addClass(detailTr, "tgrid-details");
                            detailTd.setAttribute("colspan", "{{item.detailsColspan}}");
                            detailTd.setAttribute("ng-hide", "$parent.options.showDetailFor.item != item.item || $parent.options.showDetailFor.column !=".concat(i.toString()));
                            option.columns[i].cellDetail.applyTemplate(detailTd);
                            detailTr.appendChild(detailTd)
                        }
                    }
                    return detailTr
                };
                AngularHtmlProvider.prototype.updateTableDetailRow = function(options, container, item) {
                    this.angularItemsViewModel.setItemSelection(item, options.isSelected(item.item))
                };
                AngularHtmlProvider.prototype.updateTableFooterElement = function(option, footer, totalItemsCount, footerModel) {
                    if (option.tableFooterTemplate == null && option.enablePaging) {
                        this.buildDefaultTableFooterElement(option, footer, totalItemsCount)
                    }
                    else if (option.tableFooterTemplate != null) {
                        if (!footer.hasChildNodes()) {
                            var footerContainer = document.createElement("div");
                            footerContainer.className = "tgrid-footer-container";
                            footerContainer.setAttribute("ng-controller", "tgrid-footer-controller");
                            option.tableFooterTemplate.applyTemplate(footerContainer);
                            angular.bootstrap(footerContainer, [(footerModel).angularModuleName]);
                            footer.appendChild(footerContainer)
                        }
                        else {
                            (footerModel).apply()
                        }
                    }
                    else {
                        footer.innerHTML = ""
                    }
                };
                AngularHtmlProvider.prototype.updateFilteringPopUp = function(option, filterPopup, filterPopupModel) {
                    if (option.filterPopup == null) {
                        var filterPopupContainer = document.createElement("div");
                        filterPopupContainer.className = "tgrid-filter-popup-container";
                        filterPopupContainer.setAttribute("ng-controller", "tgrid-filter-popup-controller");
                        this.buildDefaultFilteringPopUp(option, filterPopupContainer);
                        angular.bootstrap(filterPopupContainer, [(filterPopupModel).angularModuleName]);
                        filterPopup.appendChild(filterPopupContainer)
                    }
                    else {
                        var filterPopupContainer = document.createElement("div");
                        filterPopupContainer.className = "tgrid-filter-popup-container";
                        filterPopupContainer.setAttribute("ng-controller", "tgrid-filter-popup-controller");
                        option.filterPopup.applyTemplate(filterPopupContainer);
                        filterPopup.innerHTML = "";
                        angular.bootstrap(filterPopupContainer, [(filterPopupModel).angularModuleName]);
                        filterPopup.appendChild(filterPopupContainer)
                    }
                };
                AngularHtmlProvider.prototype.addArrows = function(sortArrowContainer, option, columnNumber) {
                    if (option.sortDescriptor.asc) {
                        var up = document.createElement("div");
                        addClass(up, "tgrid-arrow-up");
                        sortArrowContainer.appendChild(up)
                    }
                    if (!option.sortDescriptor.asc) {
                        var down = document.createElement("div");
                        addClass(down, "tgrid-arrow-down");
                        sortArrowContainer.appendChild(down)
                    }
                    return sortArrowContainer
                };
                AngularHtmlProvider.prototype.removeArrows = function(htmlNode) {
                    var element = htmlNode.getElementsByClassName("tgrid-arrow-up");
                    for (var i = 0; i < element.length; i++) {
                        element[i].parentNode.removeChild(element[i]);
                        i--
                    }
                    var element = htmlNode.getElementsByClassName("tgrid-arrow-down");
                    for (var i = 0; i < element.length; i++) {
                        element[i].parentNode.removeChild(element[i]);
                        i--
                    }
                };
                AngularHtmlProvider.prototype.removeFilterButtons = function(container) {
                    var elements = container.getElementsByClassName("tgrid-filter-button");
                    for (var i = 0; i < elements.length; i++) {
                        elements[i].parentNode.removeChild(elements[i]);
                        i--
                    }
                    var elements = container.getElementsByClassName("tgrid-filter-button-active");
                    for (var i = 0; i < elements.length; i++) {
                        elements[i].parentNode.removeChild(elements[i]);
                        i--
                    }
                };
                AngularHtmlProvider.prototype.updateMobileItemsList = function(option, container, items, selected) {
                    var appModule = angular.module("TGridTbody", []);
                    this.angularMobileItemsViewModel = new TesserisPro.TGrid.AngularItemsViewModel(items, option, selected);
                    var itemsViewModel = this.angularMobileItemsViewModel;
                    appModule.controller("TableCtrl", ['$scope', function($scope) {
                            itemsViewModel.setScope($scope)
                        }]).directive('ngShowInFocus', function() {
                        return {
                                replace: true, restrict: 'A', link: function(scope, element, attr) {
                                        scope.$watch(attr.ngShowInFocus, function(value) {
                                            if (value) {
                                                element.css('display', 'block');
                                                element.focus()
                                            }
                                            else {
                                                element.css('display', 'none')
                                            }
                                        })
                                    }
                            }
                    });
                    var rowsContainer = document.createElement('div');
                    var mobileContainer = document.createElement('div');
                    rowsContainer.setAttribute("ng-controller", "TableCtrl");
                    mobileContainer = this.appendMobileTableElement(option, container, items, 0, action);
                    mobileContainer.setAttribute("ng-repeat-start", "item in items");
                    mobileContainer.setAttribute("ng-class", "{'tgrid-mobile-row' : !item.isGroupHeader, 'tgrid-mobile-group-header':  item.isGroupHeader,'tgrid-mobile-row selected': !item.isGroupHeader && item.isSelected }");
                    var action = "item.select($event, item, $parent.items)";
                    if (isNotNull(option.rowClick)) {
                        action = "item.model.".concat(option.rowClick).concat("(item.item ,$event)")
                    }
                    mobileContainer.setAttribute("ng-click", "!item.isGroupHeader ? " + action + ": item.toggleGroupCollapsing($event, item)");
                    rowsContainer.appendChild(mobileContainer);
                    var detailsRow = this.buildMobileDetailsRow(option);
                    rowsContainer.appendChild(detailsRow);
                    angular.bootstrap(rowsContainer, ["TGridTbody"]);
                    container.appendChild(rowsContainer);
                    addClass(container, "mobile");
                    option.showDetailFor.column = -1
                };
                AngularHtmlProvider.prototype.appendMobileTableElement = function(option, container, items, groupLevel, action) {
                    var mobileRow = document.createElement('div');
                    if (items.length > 0) {
                        if (option.enableGrouping) {
                            if (items[0].isGroupHeader) {
                                this.buildMobileGroupHeaderRow(option, items[0].item, mobileRow)
                            }
                        }
                        this.buildMobileRowElement(option, items[0].item, container, action, mobileRow)
                    }
                    return mobileRow
                };
                AngularHtmlProvider.prototype.updateMobileDetailRow = function(option, container, item) {
                    this.angularMobileItemsViewModel.setItemSelection(item, option.isSelected(item.item))
                };
                AngularHtmlProvider.prototype.buildMobileGroupHeaderRow = function(option, item, mobileRow) {
                    this.appendIndentMobileGroupHeader(mobileRow, option.columns.length);
                    var headerDiv = document.createElement("div");
                    headerDiv.setAttribute("ng-hide", "!item.isGroupHeader");
                    if (option.groupHeaderTemplate != null) {
                        option.groupHeaderTemplate.applyTemplate(headerDiv)
                    }
                    else {
                        this.createDefaultGroupHeader(headerDiv)
                    }
                    addClass(headerDiv, 'tgrid-mobile-group-header-container');
                    if (option.enableCollapsing) {
                        addClass(mobileRow, "collapsing")
                    }
                    mobileRow.appendChild(headerDiv)
                };
                AngularHtmlProvider.prototype.appendIndentMobileGroupHeader = function(target, level) {
                    for (var i = 0; i < level; i++) {
                        var indentDiv = document.createElement("div");
                        indentDiv.className = "tgrid-mobile-group-indent-div";
                        indentDiv.setAttribute("ng-hide", "!item.isGroupHeader || ".concat(i.toString()).concat(" >= item.item.level"));
                        target.appendChild(indentDiv)
                    }
                };
                AngularHtmlProvider.prototype.buildMobileRowElement = function(option, item, container, action, mobileRow) {
                    this.appendIndentMobileRow(mobileRow, option.groupBySortDescriptors.length);
                    var rowTemplate = document.createElement("div");
                    rowTemplate.setAttribute("ng-hide", "item.isGroupHeader");
                    rowTemplate.className = "tgrid-mobile-div";
                    if (option.mobileTemplateHtml != null) {
                        option.mobileTemplateHtml.applyTemplate(rowTemplate)
                    }
                    else {
                        rowTemplate = this.createDefaultMobileTemplate(rowTemplate, option)
                    }
                    mobileRow.appendChild(rowTemplate);
                    mobileRow.setAttribute("ng-click", action);
                    mobileRow["dataContext"] = item.item
                };
                AngularHtmlProvider.prototype.appendIndentMobileRow = function(target, level) {
                    for (var i = 0; i < level; i++) {
                        var indentDiv = document.createElement("div");
                        indentDiv.className = "tgrid-mobile-row-indent-div";
                        indentDiv.setAttribute("ng-hide", "item.isGroupHeader || ".concat(i.toString()).concat(" >= item.item.level"));
                        target.appendChild(indentDiv)
                    }
                };
                AngularHtmlProvider.prototype.buildMobileDetailsRow = function(option) {
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
                        mobileDetailsContainer.appendChild(detailRowMobile)
                    }
                    for (var i = 0; i < option.columns.length; i++) {
                        if (isNotNull(option.columns[i].cellDetail)) {
                            var detailCellMobile = document.createElement("div");
                            if (!indentsAreAppended) {
                                this.appendIndentMobileRow(mobileDetailsContainer, option.groupBySortDescriptors.length);
                                indentsAreAppended = true
                            }
                            addClass(mobileDetailsContainer, "tgrid-details");
                            detailCellMobile.setAttribute("ng-hide", "$parent.options.showDetailFor.item != item.item || $parent.options.showDetailFor.column !=".concat(i.toString()));
                            option.columns[i].cellDetail.applyTemplate(detailCellMobile);
                            mobileDetailsContainer.appendChild(detailCellMobile)
                        }
                    }
                    return mobileDetailsContainer
                };
                AngularHtmlProvider.prototype.createDefaultGroupHeader = function(tableRowElement) {
                    var groupHeaderContainer = document.createElement("div");
                    var groupHeaderName = document.createElement("span");
                    groupHeaderName.innerHTML = "{{item.item.value}}";
                    groupHeaderContainer.appendChild(groupHeaderName);
                    tableRowElement.appendChild(groupHeaderContainer);
                    return tableRowElement
                };
                AngularHtmlProvider.prototype.createDefaultCell = function(cell, defaultCellBindingName) {
                    var spanForCell = document.createElement("span");
                    var textBinding = "{{item.item.".concat(defaultCellBindingName).concat("}}");
                    spanForCell.innerHTML = textBinding;
                    cell.appendChild(spanForCell)
                };
                AngularHtmlProvider.prototype.createDefaultMobileTemplate = function(rowTemplate, option) {
                    for (var i = 0; i < option.columns.length; i++) {
                        if (option.columns[i].device.indexOf("mobile") != -1) {
                            var mobileColumnContainer = document.createElement("div");
                            var mobileColumnName = document.createElement("span");
                            if (option.columns[i].member != null) {
                                mobileColumnName.innerHTML = option.columns[i].member
                            }
                            else if (option.columns[i].sortMemberPath != null) {
                                mobileColumnName.innerHTML = option.columns[i].sortMemberPath
                            }
                            else if (option.columns[i].groupMemberPath != null) {
                                mobileColumnName.innerHTML = option.columns[i].groupMemberPath
                            }
                            else {
                                mobileColumnName.innerHTML = ""
                            }
                            var columnData = document.createElement("span");
                            if (option.columns[i].member != null) {
                                var columnBinding = document.createElement('span');
                                columnData.innerHTML = ": {{item.item." + option.columns[i].member + "}}";
                                columnData.appendChild(columnBinding)
                            }
                            else {
                                columnData.innerHTML = ": "
                            }
                            mobileColumnContainer.appendChild(mobileColumnName);
                            mobileColumnContainer.appendChild(columnData);
                            rowTemplate.appendChild(mobileColumnContainer)
                        }
                    }
                    return rowTemplate
                };
                AngularHtmlProvider.prototype.buildDefaultFilteringPopUp = function(option, filterPopupContainer) {
                    var filterCondition = document.createElement("select");
                    var selectOption = document.createElement("option");
                    selectOption.value = TGrid.FilterCondition.None.toString();
                    selectOption.text = "None";
                    filterCondition.appendChild(selectOption);
                    var selectOption = document.createElement("option");
                    selectOption.value = TGrid.FilterCondition.Equals.toString();
                    selectOption.text = "Equals";
                    filterCondition.appendChild(selectOption);
                    var selectOption = document.createElement("option");
                    selectOption.value = TGrid.FilterCondition.NotEquals.toString();
                    selectOption.text = "Not equals";
                    filterCondition.appendChild(selectOption);
                    filterPopupContainer.appendChild(filterCondition);
                    filterCondition.selectedIndex = 1;
                    var filterText = document.createElement("input");
                    filterText.type = "text";
                    filterText.className = 'tgrid-filter-input-text';
                    filterText.setAttribute("value", "");
                    filterText.style.width = '150px';
                    filterPopupContainer.appendChild(filterText);
                    var applyButton = document.createElement("div");
                    applyButton.className = "tgrid-filter-popup-button";
                    applyButton.style.width = '70px';
                    applyButton.onclick = function(e) {
                        var grid = TGrid.Grid.getGridObject(e.target);
                        grid.filterPopupViewModel.onApply()
                    };
                    (applyButton).innerHTML = "OK";
                    filterPopupContainer.appendChild(applyButton);
                    var clearButton = document.createElement("div");
                    clearButton.className = 'tgrid-filter-popup-button';
                    clearButton.style.width = '70px';
                    clearButton.onclick = function(e) {
                        var grid = TGrid.Grid.getGridObject(e.target);
                        grid.filterPopupViewModel.onClose();
                        filterText.setAttribute("value", "")
                    };
                    (clearButton).innerHTML = 'Cancel';
                    filterPopupContainer.appendChild(clearButton)
                };
                AngularHtmlProvider.prototype.appendIndentRow = function(target, level) {
                    for (var i = 0; i < level; i++) {
                        var cell = document.createElement("td");
                        cell.className = "tgrid-table-indent-cell";
                        cell.setAttribute("ng-hide", "item.isGroupHeader || $parent.options.groupBySortDescriptors.length <=".concat(i.toString()));
                        var indentContent = document.createElement("div");
                        indentContent.className = "tgrid-table-indent-cell-content";
                        cell.appendChild(indentContent);
                        target.appendChild(cell)
                    }
                };
                AngularHtmlProvider.prototype.appendIndentGroupHeader = function(target, level) {
                    for (var i = 0; i < level; i++) {
                        var cell = document.createElement("td");
                        cell.className = "tgrid-table-indent-cell";
                        cell.setAttribute("ng-hide", "!item.isGroupHeader || item.item.level <= ".concat(i.toString()));
                        var indentContent = document.createElement("div");
                        indentContent.className = "tgrid-table-indent-cell-content";
                        cell.appendChild(indentContent);
                        target.appendChild(cell)
                    }
                };
                AngularHtmlProvider.moduleFooterCounter = 0;
                return AngularHtmlProvider
            })(TGrid.BaseHtmlProvider);
        TGrid.AngularHtmlProvider = AngularHtmlProvider
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid
})(TesserisPro || (TesserisPro = {}));
;
var TGrid;
(function(TGrid) {
    (function(Angular) {
        function Directive() {
            var directive = {};
            directive.restrict = 'E';
            directive.link = function(scope, element, attrs) {
                var options = new TesserisPro.TGrid.Options(element[0], 1);
                options.parentViewModel = scope;
                if (attrs["groupby"] != undefined) {
                    var groupBy = attrs["groupby"].split(' ');
                    if (groupBy.length > 0 && groupBy[0] != "") {
                        for (var i = 0; i < groupBy.length; i++) {
                            options.groupBySortDescriptors.push(new TesserisPro.TGrid.SortDescriptor(groupBy[i], true))
                        }
                    }
                }
                if (attrs["minItemsCountForVirtualization"] != undefined) {
                    options.minItemsCountForVirtualization = parseInt(attrs["minItemsCountForVirtualization"])
                }
                if (attrs["enablepaging"] == undefined) {
                    options.enablePaging = false
                }
                else {
                    options.enablePaging = attrs["enablepaging"] == "true" ? true : false
                }
                var pageSizeAtt = attrs["pagesize"];
                if (pageSizeAtt != undefined) {
                    options.pageSize = parseInt(pageSizeAtt);
                    if (this.isEnablePaging) {
                        options.pageSize = (isNaN(this.pageSize) || this.pageSize < 1) ? 10 : this.pageSize
                    }
                }
                var pageSlideAttr = attrs["pageslide"];
                if (pageSlideAttr != undefined) {
                    options.pageSlide = parseInt(pageSlideAttr);
                    if (this.isEnablePaging) {
                        options.pageSlide = (isNaN(this.pageSlide) || this.pageSlide < 1) ? 1 : this.pageSlide
                    }
                }
                var selectionModeAtt = attrs["selectionmode"];
                if (selectionModeAtt == "multi") {
                    options.selectionMode = 2
                }
                if (selectionModeAtt == undefined || selectionModeAtt == "single") {
                    options.selectionMode = 1
                }
                if (selectionModeAtt == "none") {
                    options.selectionMode = 0
                }
                if (attrs["enablevirtualscroll"] == undefined) {
                    options.enableVirtualScroll = false
                }
                else {
                    options.enableVirtualScroll = attrs["enablevirtualscroll"] == "true" ? true : false
                }
                if (attrs["enablecollapsing"] == undefined) {
                    options.enableCollapsing = false
                }
                else {
                    options.enableCollapsing = attrs["enablecollapsing"] == "true" ? true : false
                }
                if (attrs["enablesorting"] == undefined) {
                    options.enableSorting = false
                }
                else {
                    options.enableSorting = attrs["enablesorting"] == "true" ? true : false
                }
                if (attrs["enablegrouping"] == undefined) {
                    options.enableGrouping = false
                }
                else {
                    options.enableGrouping = attrs["enablegrouping"] == "true" ? true : false
                }
                if (attrs["showdetailsonselection"] == undefined) {
                    options.openDetailsOnSelection = false
                }
                else {
                    options.openDetailsOnSelection = attrs["showdetailsonselection"] == "true" ? true : false
                }
                if (attrs["enablefiltering"] == undefined) {
                    options.enableFiltering = false
                }
                else {
                    options.enableFiltering = attrs["enablefiltering"] == "true" ? true : false
                }
                if (attrs["rowclick"] == undefined || attrs["rowclick"] == null) {
                    options.rowClick = null
                }
                else {
                    options.rowClick = attrs["rowclick"]
                }
                if (attrs["capturescroll"] == undefined) {
                    options.captureScroll = true
                }
                else {
                    options.captureScroll = attrs["capturescroll"] == "false" ? false : true
                }
                var ready = attrs["ready"];
                if (ready != undefined && typeof scope[ready] == 'function') {
                    options.ready = scope[ready]
                }
                var hideHeader = attrs["hideheader"];
                if (hideHeader == undefined) {
                    options.hideHeader = false
                }
                else {
                    options.hideHeader = hideHeader == "true" ? true : false
                }
                var grid = new TesserisPro.TGrid.Grid(element[0], options, scope[attrs["provider"]]);
                if (attrs["options"] != undefined) {
                    options.apply = function() {
                        grid.afterOptionsChange()
                    };
                    scope[attrs["options"]] = options
                }
                var bindingReady = attrs["bindingready"];
                if (ready != undefined && typeof scope[bindingReady] == 'function') {
                    scope[bindingReady](options)
                }
            };
            return directive
        }
        Angular.Directive = Directive;
        function registerTGrid(appModule){}
        Angular.registerTGrid = registerTGrid
    })(TGrid.Angular || (TGrid.Angular = {}));
    var Angular = TGrid.Angular
})(TGrid || (TGrid = {}));
;
var TesserisPro;
(function(TesserisPro) {
    (function(TGrid) {
        var AngularFooterViewModel = (function() {
                function AngularFooterViewModel(grid) {
                    this.totalCount = 0;
                    this.selectedItem = null;
                    this.currentPage = 1;
                    this.totalPages = 1;
                    this.grid = grid
                }
                AngularFooterViewModel.prototype.setScope = function(scope) {
                    var _this = this;
                    this.$scope = scope;
                    this.$scope.totalCount = this.totalCount;
                    this.$scope.selectedItem = this.selectedItem;
                    this.$scope.currentPage = this.currentPage;
                    this.$scope.totalPages = this.totalPages;
                    this.$scope.grid = this.grid;
                    this.$scope.changePage = function(pageNumber) {
                        return _this.changePage(pageNumber)
                    };
                    this.$scope.goToPreviousPagesBlock = function() {
                        return _this.goToPreviousPagesBlock()
                    };
                    this.$scope.goToNextPagesBlock = function() {
                        return _this.goToNextPagesBlock()
                    };
                    this.$scope.goToFirstPage = function() {
                        return _this.goToFirstPage()
                    };
                    this.$scope.goToLastPage = function() {
                        return _this.goToLastPage()
                    }
                };
                AngularFooterViewModel.prototype.setTotalCount = function(totalCount) {
                    var _this = this;
                    this.totalCount = Math.floor(totalCount);
                    if (this.$scope != null) {
                        this.$scope.totalCount = Math.floor(totalCount);
                        var self = this;
                        setTimeout(function() {
                            return _this.$scope.$apply()
                        }, 1)
                    }
                };
                AngularFooterViewModel.prototype.setSelectedItem = function(selectedItem) {
                    var _this = this;
                    this.selectedItem = selectedItem;
                    if (this.$scope != null) {
                        this.$scope.selectedItem = selectedItem;
                        setTimeout(function() {
                            return _this.$scope.$apply()
                        }, 1)
                    }
                };
                AngularFooterViewModel.prototype.setCurrentPage = function(currentPage) {
                    var _this = this;
                    this.currentPage = Math.floor(currentPage);
                    if (this.$scope != null) {
                        this.$scope.currentPage = Math.floor(currentPage);
                        var self = this;
                        setTimeout(function() {
                            return _this.$scope.$apply()
                        }, 1)
                    }
                };
                AngularFooterViewModel.prototype.setTotalPages = function(totalPages) {
                    var _this = this;
                    this.totalPages = Math.floor(totalPages);
                    if (this.$scope != null) {
                        this.$scope.totalPages = Math.floor(totalPages);
                        var self = this;
                        setTimeout(function() {
                            return _this.$scope.$apply()
                        }, 1)
                    }
                };
                AngularFooterViewModel.prototype.changePage = function(viewPageNumber) {
                    var pageNumber = parseInt(viewPageNumber);
                    if (isNaN(pageNumber)) {
                        return
                    }
                    if (this.$scope.totalPages != undefined && this.$scope.totalPages != null && this.$scope.totalPages < viewPageNumber) {
                        this.grid.selectPage(this.$scope.totalPages - 1);
                        return
                    }
                    if (pageNumber < 1) {
                        this.grid.selectPage(0)
                    }
                    else {
                        this.grid.selectPage(pageNumber - 1)
                    }
                };
                AngularFooterViewModel.prototype.apply = function() {
                    var _this = this;
                    setTimeout(function() {
                        return _this.$scope.$apply()
                    }, 1)
                };
                AngularFooterViewModel.prototype.goToPreviousPagesBlock = function() {
                    var previousBlockPage = this.$scope.currentPage - this.grid.options.pageSlide - 1;
                    if (previousBlockPage > 0 && previousBlockPage != null && previousBlockPage != undefined) {
                        this.grid.selectPage(previousBlockPage)
                    }
                    else {
                        this.grid.selectPage(0)
                    }
                };
                AngularFooterViewModel.prototype.goToNextPagesBlock = function() {
                    var nextBlockPage = this.$scope.currentPage + this.grid.options.pageSlide - 1;
                    if (nextBlockPage < this.$scope.totalPages && nextBlockPage != null && nextBlockPage != undefined) {
                        this.grid.selectPage(nextBlockPage)
                    }
                    else {
                        this.grid.selectPage(this.$scope.totalPages - 1)
                    }
                };
                AngularFooterViewModel.prototype.goToFirstPage = function() {
                    this.grid.selectPage(0)
                };
                AngularFooterViewModel.prototype.goToLastPage = function() {
                    this.grid.selectPage(this.$scope.totalPages - 1)
                };
                return AngularFooterViewModel
            })();
        TGrid.AngularFooterViewModel = AngularFooterViewModel
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid
})(TesserisPro || (TesserisPro = {}));
;
var TesserisPro;
(function(TesserisPro) {
    (function(TGrid) {
        var AngularFilterPopupViewModel = (function() {
                function AngularFilterPopupViewModel(container, onCloseFilterPopup) {
                    this.container = container;
                    this.onCloseFilterPopup = onCloseFilterPopup
                }
                AngularFilterPopupViewModel.prototype.setScope = function(scope) {
                    var _this = this;
                    this.$scope = scope;
                    this.$scope.path = this.path;
                    this.$scope.onApply = function() {
                        return _this.onApply()
                    };
                    this.$scope.onClear = function() {
                        return _this.onClear()
                    };
                    this.$scope.onClose = function() {
                        return _this.onClose()
                    }
                };
                AngularFilterPopupViewModel.prototype.onCloseFilterPopup = function(container){};
                AngularFilterPopupViewModel.prototype.onApply = function() {
                    this.condition = (this.container.getElementsByTagName("select")[0]).selectedIndex;
                    var grid = TGrid.Grid.getGridObject(this.container);
                    grid.options.filterDescriptor.removeChildByPath(this.$scope.path);
                    if (this.condition != TGrid.FilterCondition.None) {
                        this.value = (this.container.getElementsByTagName("input")[0]).value;
                    grid.applyFilters();
                    hideElement(this.container);
                    this.onCloseFilterPopup(this.container)
                };
                AngularFilterPopupViewModel.prototype.onClear = function() {
                    var grid = TGrid.Grid.getGridObject(this.container);
                    grid.options.filterDescriptor.removeChildByPath(this.$scope.path);
                    grid.applyFilters();
                    hideElement(this.container);
                    this.onCloseFilterPopup(this.container)
                };
                AngularFilterPopupViewModel.prototype.onClose = function() {
                    hideElement(this.container);
                    this.onCloseFilterPopup(this.container)
                };
                AngularFilterPopupViewModel.prototype.onOpen = function(options, column) {
                    this.columnInfo = column;
                    this.$scope.path = column.filterMemberPath;
                    for (var i = 0; i < options.filterDescriptor.children.length; i++) {
                        if (options.filterDescriptor.children[i].path == column.filterMemberPath) {
                            (this.container.getElementsByTagName("input")[0]).value = options.filterDescriptor.children[i].value;
                            (this.container.getElementsByTagName("select")[0]).selectedIndex = options.filterDescriptor.children[i].condition;
                            this.$scope.$apply();
                            return
                        }
                    }
                    (this.container.getElementsByTagName("input")[0]).value = '';
                    (this.container.getElementsByTagName("select")[0]).selectedIndex = TGrid.FilterCondition.None;
                    this.$scope.$apply()
                };
                AngularFilterPopupViewModel.prototype.getColumnInfo = function() {
                    return this.columnInfo
                };
                return AngularFilterPopupViewModel
            })();
        TGrid.AngularFilterPopupViewModel = AngularFilterPopupViewModel
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid
})(TesserisPro || (TesserisPro = {}));
;
var __extends = this.__extends || function(d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d
        }
        __.prototype = b.prototype;
        d.prototype = new __
    };
var TesserisPro;
(function(TesserisPro) {
    (function(TGrid) {
        var AngularItemViewModel = (function(_super) {
                __extends(AngularItemViewModel, _super);
                function AngularItemViewModel(model, item, grid, isGroupHeader) {
                    _super.call(this, model, item, grid, isGroupHeader)
                }
                return AngularItemViewModel
            })(TGrid.ItemViewModel);
        TGrid.AngularItemViewModel = AngularItemViewModel
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid
})(TesserisPro || (TesserisPro = {}));
;
var TesserisPro;
(function(TesserisPro) {
    (function(TGrid) {
        var AngularItemsViewModel = (function() {
                function AngularItemsViewModel(items, options, selected) {
                    this.itemsModels = items;
                    this.options = options;
                    this.selected = selected
                }
                AngularItemsViewModel.prototype.setScope = function(scope) {
                    var _this = this;
                    this.$scope = scope;
                    this.$scope.options = this.options;
                    this.$scope.items = new Array;
                    for (var i = 0; i < this.itemsModels.length; i++) {
                        this.$scope.items[i] = new TGrid.AngularItemViewModel(this.itemsModels[i].model, this.itemsModels[i].item, this.itemsModels[i].grid, this.itemsModels[i].isGroupHeader);
                        this.$scope.items[i].originalModel = this.itemsModels[i];
                        this.$scope.items[i].colspan = this.options.columns.length + 1 + this.options.groupBySortDescriptors.length - this.itemsModels[i].item.level;
                        this.$scope.items[i].detailsColspan = this.options.hasAnyNotSizedColumn ? this.options.columns.length : this.options.columns.length + 1;
                        this.$scope.items[i].isSelected = this.options.isSelected(this.itemsModels[i].item);
                        this.$scope.items[i].showDetail = false;
                        this.$scope.items[i].showDetailsFor = new TGrid.ShowDetail;
                        if (this.$scope.options.showDetailFor.item == this.$scope.items[i].item) {
                            this.$scope.items[i].showDetail = true
                        }
                        this.$scope.items[i].toggleGroupCollapsing = function(e, item) {
                            if (_this.options.enableCollapsing) {
                                if (item.item.collapse) {
                                    item.grid.removeCollapsedFilters(item.item.filterDescriptor);
                                    item.item.collapse = false
                                }
                                else {
                                    item.grid.setCollapsedFilters(item.item.filterDescriptor);
                                    item.item.collapse = true
                                }
                            }
                        };
                        this.$scope.items[i].toggleDetailForCell = function(columnIndex, item) {
                            item.toggleDetailsForCell(columnIndex)
                        };
                        this.$scope.items[i].openDetailForCell = function(columnIndex, item) {
                            item.openDetailsForCell(columnIndex)
                        };
                        this.$scope.items[i].closeDetailForCell = function(columnIndex, item) {
                            item.closeDetailsForCell(columnIndex)
                        };
                        this.$scope.items[i].select = function(e, item, items) {
                            _this.selected(item, e.ctrlKey)
                        }
                    }
                };
                AngularItemsViewModel.prototype.setItemSelection = function(item, isSelected) {
                    var _this = this;
                    for (var i = 0; i < this.itemsModels.length; i++) {
                        if (this.$scope.items[i].showDetail) {
                            if (this.options.showDetailFor.item != this.$scope.items[i].item || this.options.showDetailFor.item == item.item) {
                                this.$scope.items[i].showDetail = false
                            }
                        }
                        if (this.itemsModels[i] == item) {
                            this.$scope.items[i].isSelected = isSelected;
                            if (this.options.showDetailFor.item == item.item) {
                                this.$scope.items[i].showDetail = true;
                                this.$scope.options.showDetailFor = this.options.showDetailFor
                            }
                            setTimeout(function() {
                                _this.$scope.$apply()
                            }, 10)
                        }
                    }
                };
                return AngularItemsViewModel
            })();
        TGrid.AngularItemsViewModel = AngularItemsViewModel
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid
})(TesserisPro || (TesserisPro = {}));
;
(function() {
    'use strict';
    angular.module('TGrid', []).directive('tGrid', TGrid.Angular.Directive)
})()