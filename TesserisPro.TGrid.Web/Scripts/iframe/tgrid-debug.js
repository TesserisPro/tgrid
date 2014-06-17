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
var TesserisPro;
(function(TesserisPro) {
    (function(TGrid) {
        var BaseHtmlProvider = (function() {
                function BaseHtmlProvider(){}
                BaseHtmlProvider.prototype.getTableElement = function(option) {
                    var table = document.createElement("table");
                    table.className = "tgrid-table";
                    return table
                };
                BaseHtmlProvider.prototype.bindData = function(option, elementForBinding){};
                BaseHtmlProvider.prototype.getElementsSize = function(container, items) {
                    return 0
                };
                BaseHtmlProvider.prototype.getFirstVisibleItem = function(container, items, scrollTop) {
                    return null
                };
                BaseHtmlProvider.prototype.getVisibleItemsCount = function(container, view, scrollTop, skipGroupHeaders) {
                    var size = 0;
                    var visibleItemsCount = 0;
                    var children = container.children;
                    var visibleItemsSize = 0;
                    for (var i = 0; i < children.length; i++) {
                        var child = children.item(i);
                        if (child.style.display != "none" && child.style.visibility != "hidden") {
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
                BaseHtmlProvider.prototype.getFooterViewModel = function(grid){};
                BaseHtmlProvider.prototype.getFilterPopupViewModel = function(container){};
                BaseHtmlProvider.prototype.updateTableHeadElement = function(option, header, groupByContainer, filterPopupContainer, columnsResized){};
                BaseHtmlProvider.prototype.updateTableBodyElement = function(option, container, items, selected) {
                    return container
                };
                BaseHtmlProvider.prototype.updateTableFooterElement = function(option, footer, totalItemsCount, footerModel){};
                BaseHtmlProvider.prototype.updateGroupedTableBodyElement = function(option, container, items, selected){};
                BaseHtmlProvider.prototype.updateColumnWidth = function(option, header, body, footer) {
                    if (!option.hideHeader) {
                        var headers = header.getElementsByTagName("th");
                        var hasNotSizedColumn = false;
                        for (var i = 0; i < option.columns.length; i++) {
                            if (option.columns[i].notSized && !option.enablePaging) {
                                hasNotSizedColumn = true
                            }
                        }
                        var columnsCount = hasNotSizedColumn ? headers.length - 1 : headers.length;
                        var columnNumber = 0;
                        while (columnNumber < option.columns.length && option.columns[columnNumber].device.indexOf("desktop") == -1) {
                            columnNumber++
                        }
                        for (var i = 0; i < columnsCount; i++) {
                            while (columnNumber < option.columns.length && option.columns[columnNumber].device.indexOf("desktop") == -1) {
                                columnNumber++
                            }
                            if (columnNumber >= option.columns.length) {
                                columnNumber = option.columns.length - 1;
                                break
                            }
                            if (!option.columns[columnNumber].notSized) {
                                var indexOfPercentSymbol = option.columns[columnNumber].width.indexOf("%");
                                if (indexOfPercentSymbol != -1) {
                                    var intWidth = parseInt(option.columns[columnNumber].width.substring(0, indexOfPercentSymbol));
                                    var percentWidth = intWidth > 0 ? intWidth : 1;
                                    option.columns[columnNumber].width = (body.offsetWidth * percentWidth / 100).toString()
                                }
                                headers.item(i + option.columns.length).style.width = option.columns[columnNumber].width.toString() + "px";
                                var headerContainer = headers.item(i + option.columns.length).getElementsByClassName("tgrid-header-cell-container").item(0);
                                headerContainer.style.width = option.columns[columnNumber].width.toString() + "px"
                            }
                            columnNumber++
                        }
                    }
                    var dataRow;
                    var tableRows = body.getElementsByTagName("tr");
                    for (var i = 0; i < tableRows.length; i++) {
                        if (containsClass(tableRows.item(i), "tgrid-table-body-row")) {
                            dataRow = tableRows.item(i);
                            if (dataRow != undefined) {
                                var columns = dataRow.getElementsByClassName("tgrid-table-data-cell");
                                var columnsCount = columns.length;
                                columnNumber = 0;
                                for (var j = 0; j < columnsCount; j++) {
                                    while (columnNumber < option.columns.length && option.columns[columnNumber].device.indexOf("desktop") == -1) {
                                        columnNumber++
                                    }
                                    if (columnNumber >= option.columns.length) {
                                        columnNumber = option.columns.length - 1;
                                        break
                                    }
                                    if (!option.columns[columnNumber].notSized) {
                                        var indexOfPercentSymbol = option.columns[columnNumber].width.indexOf("%");
                                        if (indexOfPercentSymbol != -1) {
                                            var intWidth = parseInt(option.columns[columnNumber].width.substring(0, indexOfPercentSymbol));
                                            var percentWidth = intWidth > 0 ? intWidth : 1;
                                            option.columns[columnNumber].width = (body.offsetWidth * percentWidth / 100).toString()
                                        }
                                        columns.item(j).style.width = option.columns[columnNumber].width.toString() + "px";
                                        var cellContainer = columns.item(j).firstChild;
                                        cellContainer.style.width = option.columns[columnNumber].width.toString() + "px"
                                    }
                                    columnNumber++
                                }
                            }
                        }
                    }
                };
                BaseHtmlProvider.prototype.buildDefaultTableFooterElement = function(option, footer, totalItemsCount) {
                    var firstVisiblePage = option.currentPage - option.pageSlide;
                    if (firstVisiblePage < 0) {
                        firstVisiblePage = 0
                    }
                    var lastVisiblePage = option.currentPage + option.pageSlide;
                    var pageCount = Math.ceil(totalItemsCount / option.pageSize);
                    if (lastVisiblePage >= pageCount) {
                        lastVisiblePage = pageCount - 1
                    }
                    var pagerElement = document.createElement("div");
                    pagerElement.setAttribute("class", "tgrid-pagination");
                    if (firstVisiblePage > 0) {
                        pagerElement.innerHTML += "<span class='tgrid-page-number' onclick='TesserisPro.TGrid.Grid.getGridObject(event.target).selectPage(" + (firstVisiblePage - 1).toString() + ")' >...</span>"
                    }
                    for (var i = firstVisiblePage; i <= lastVisiblePage; i++) {
                        if (option.currentPage == i) {
                            pagerElement.innerHTML += "<span class='tgrid-page-current'>" + (i + 1) + "</span>"
                        }
                        else {
                            pagerElement.innerHTML += "<span class='tgrid-page-number' onclick='TesserisPro.TGrid.Grid.getGridObject(event.target).selectPage(" + i + ")' >" + (i + 1) + "</span>"
                        }
                    }
                    if (lastVisiblePage < (pageCount - 1)) {
                        pagerElement.innerHTML += "<span class='tgrid-page-number' onclick='TesserisPro.TGrid.Grid.getGridObject(event.target).selectPage(" + lastVisiblePage.toString() + ")' >...</span>"
                    }
                    var pages = footer.getElementsByClassName("tgrid-pagination");
                    for (var i = 0; i < pages.length; i++) {
                        footer.removeChild(pages[i])
                    }
                    footer.appendChild(pagerElement)
                };
                BaseHtmlProvider.prototype.getActualDetailsTemplate = function(option) {
                    if (option.showDetailFor.item == null) {
                        return null
                    }
                    if (option.showDetailFor.column == -1) {
                        return option.detailsTemplateHtml
                    }
                    return option.columns[option.showDetailFor.column].cellDetail
                };
                BaseHtmlProvider.prototype.updateTableDetailRow = function(option, container, item, shouldAddDetails){};
                BaseHtmlProvider.prototype.updateMobileDetailRow = function(option, container, item, shouldAddDetails){};
                BaseHtmlProvider.prototype.buildDefaultHeader = function(container, headerName) {
                    var defaultHeader = document.createElement("span");
                    var defaultName = document.createTextNode(headerName);
                    defaultHeader.appendChild(defaultName);
                    container.appendChild(defaultHeader)
                };
                BaseHtmlProvider.prototype.onCloseFilterPopup = function(container) {
                    document.onclick = BaseHtmlProvider.oldOnClick;
                    container.style.left = "";
                    container.style.top = ""
                };
                BaseHtmlProvider.prototype.updateGroupByPanel = function(option, groupByPanel) {
                    groupByPanel.innerHTML = "";
                    if (option.enableGrouping) {
                        this.addActualGroupByElements(option, groupByPanel);
                        var groupButton = document.createElement("div");
                        groupButton.setAttribute("class", "tgrid-goup-button");
                        var groupByMenu = document.createElement("ul");
                        groupByMenu.setAttribute("class", "tgrid-menu");
                        hideElement(groupByMenu);
                        var self = this;
                        groupButton.onclick = function(e) {
                            e.cancelBubble = true;
                            self.updateGroupByMenuContent(option, groupByMenu);
                            unhideElement(groupByMenu);
                            self.doOnClickOutside(groupByMenu, function() {
                                return hideElement(groupByMenu)
                            })
                        };
                        groupButton.appendChild(groupByMenu);
                        groupByPanel.appendChild(groupButton)
                    }
                };
                BaseHtmlProvider.prototype.showNeededIndents = function(target, level, grid) {
                    var visibleIndentsNumber = level;
                    var cells = target.getElementsByClassName("tgrid-table-indent-cell");
                    for (var i = 0; i < cells.length; i++) {
                        hideElement(cells[i])
                    }
                    if (cells.length < level) {
                        visibleIndentsNumber = cells.length
                    }
                    for (var i = 0; i < visibleIndentsNumber; i++) {
                        unhideElement(cells[i])
                    }
                };
                BaseHtmlProvider.prototype.updateFilteringPopUp = function(option, filterPopup, filterPopupModel){};
                BaseHtmlProvider.prototype.addActualGroupByElements = function(option, groupByContainer) {
                    for (var i = 0; i < option.groupBySortDescriptors.length; i++) {
                        for (var j = 0; j < option.columns.length; j++) {
                            if (option.columns[j].device.indexOf("desktop") != -1) {
                                var column = option.columns[j];
                                if (column.groupMemberPath == option.groupBySortDescriptors[i].path && column.groupMemberPath != null) {
                                    var groupByHeaderElement = document.createElement("div");
                                    var columnHeader = this.buildColumnHeader(column);
                                    this.bindData(option, columnHeader);
                                    groupByHeaderElement.className = "tgrid-group-by-element";
                                    groupByHeaderElement["data-group-by"] = column.groupMemberPath;
                                    groupByHeaderElement.appendChild(columnHeader);
                                    var buttonsContainer = document.createElement("div");
                                    buttonsContainer.className = "tgrid-header-cell-buttons";
                                    var deleteGroupButton = document.createElement("div");
                                    deleteGroupButton.className = "tgrid-delete-button";
                                    deleteGroupButton["data-delete-group-by"] = option.groupBySortDescriptors[i];
                                    deleteGroupButton["data-delete-group-by-number"] = i;
                                    deleteGroupButton.onclick = function(e) {
                                        e.cancelBubble = true;
                                        TGrid.Grid.getGridObject(e.target).removeGroupDescriptor(e.target["data-delete-group-by"].path)
                                    };
                                    buttonsContainer.appendChild(deleteGroupButton);
                                    groupByHeaderElement.appendChild(buttonsContainer);
                                    groupByContainer.appendChild(groupByHeaderElement)
                                }
                            }
                        }
                    }
                };
                BaseHtmlProvider.prototype.updateGroupByMenuContent = function(option, menu) {
                    menu.innerHTML = "";
                    for (var i = 0; i < option.columns.length; i++) {
                        if (option.columns[i].device.indexOf("desktop") != -1 && option.columns[i].enableGrouping) {
                            if (option.columns[i].groupMemberPath != null) {
                                var alreadyGrouped = false;
                                for (var j = 0; j < option.groupBySortDescriptors.length; j++) {
                                    if (option.groupBySortDescriptors[j].path == option.columns[i].groupMemberPath) {
                                        alreadyGrouped = true
                                    }
                                }
                                if (!alreadyGrouped) {
                                    var groupMenuItem = document.createElement("li");
                                    groupMenuItem["data-group-by-path"] = option.columns[i].groupMemberPath;
                                    var columnHeader = this.buildColumnHeader(option.columns[i]);
                                    this.bindData(option, columnHeader);
                                    groupMenuItem.appendChild(columnHeader);
                                    groupMenuItem.onclick = function(e) {
                                        hideElement(menu);
                                        TGrid.Grid.getGridObject(e.target).addGroupDescriptor(e.currentTarget["data-group-by-path"], true)
                                    };
                                    menu.appendChild(groupMenuItem)
                                }
                            }
                        }
                    }
                };
                BaseHtmlProvider.prototype.buildGroupMobileHeaderRow = function(option, groupHeaderDescriptor) {
                    var headerContainer = document.createElement("div");
                    var headerDiv = document.createElement("div");
                    addClass(headerContainer, "tgrid-mobile-group-header");
                    for (var i = 0; i < groupHeaderDescriptor.level; i++) {
                        headerContainer.innerHTML += "<div class='tgrid-mobile-group-indent-div'></div>"
                    }
                    if (option.enableCollapsing) {
                        addClass(headerContainer, "collapsing");
                        if (!groupHeaderDescriptor.collapse) {
                            headerContainer.onclick = function(e) {
                                TesserisPro.TGrid.Grid.getGridObject(e.target).setCollapsedFilters(groupHeaderDescriptor.filterDescriptor)
                            }
                        }
                        else {
                            headerContainer.onclick = function(e) {
                                TesserisPro.TGrid.Grid.getGridObject(e.target).removeCollapsedFilters(groupHeaderDescriptor.filterDescriptor)
                            }
                        }
                    }
                    if (option.groupHeaderTemplate != null) {
                        option.groupHeaderTemplate.applyTemplate(headerDiv)
                    }
                    else {
                        this.createDefaultGroupHeader(headerDiv)
                    }
                    addClass(headerDiv, 'tgrid-mobile-group-header-container');
                    this.bindMobileGroupHeader(headerContainer, groupHeaderDescriptor.value, headerDiv);
                    return headerContainer
                };
                BaseHtmlProvider.prototype.bindMobileGroupHeader = function(headerContainer, item, headerDiv) {
                    headerContainer.appendChild(headerDiv)
                };
                BaseHtmlProvider.prototype.createDefaultGroupHeader = function(tableRowElement){};
                BaseHtmlProvider.prototype.addFilterButton = function(option, header, filterPopupContainer, headerButtons, culumnNumber) {
                    var filter = document.createElement("div");
                    var isActiveFilter = false;
                    for (var j = 0; j < option.filterDescriptor.children.length; j++) {
                        if (option.filterDescriptor.children[j].path == option.columns[culumnNumber].filterMemberPath) {
                            isActiveFilter = true
                        }
                    }
                    if (isActiveFilter) {
                        addClass(filter, "tgrid-filter-button-active")
                    }
                    else {
                        addClass(filter, "tgrid-filter-button")
                    }
                    var self = this;
                    (function(columnNumber) {
                        filter.onclick = function(e) {
                            var eventTarget = e.target;
                            var grid = TGrid.Grid.getGridObject(eventTarget);
                            var popupTop = (header.getBoundingClientRect().top + header.getBoundingClientRect().height) + document.body.scrollTop;
                            var poupLeft = eventTarget.getBoundingClientRect().left + document.body.scrollLeft;
                            if (filterPopupContainer.style.display == "none" || option.filterPopupForColumn != option.columns[columnNumber]) {
                                grid.showFilterPopup(option.columns[columnNumber], poupLeft, popupTop, true);
                                if ((poupLeft + filterPopupContainer.offsetWidth) > (grid.GetRootElement().getBoundingClientRect().left + grid.GetRootElement().getBoundingClientRect().width)) {
                                    grid.showFilterPopup(option.columns[columnNumber], poupLeft - filterPopupContainer.offsetWidth + eventTarget.offsetWidth, popupTop, true)
                                }
                            }
                            else {
                                grid.hideFilterPopup()
                            }
                            self.doOnClickOutside(filterPopupContainer, function() {
                                var grid = TGrid.Grid.getGridObject(eventTarget);
                                if (grid != null) {
                                    grid.hideFilterPopup();
                                    self.onCloseFilterPopup(filterPopupContainer)
                                }
                            });
                            e.cancelBubble = true
                        }
                    })(culumnNumber);
                    headerButtons.appendChild(filter)
                };
                BaseHtmlProvider.prototype.updateMobileHeadElement = function(option, mobileHeader, filterPopupContainer) {
                    mobileHeader.innerHTML = "";
                    if (option.enableSorting || option.enableGrouping || option.enableFiltering) {
                        this.createMobileButton(option, mobileHeader, filterPopupContainer)
                    }
                };
                BaseHtmlProvider.prototype.updateMobileItemsList = function(option, container, items, selected){};
                BaseHtmlProvider.prototype.createMobileButton = function(option, mobileHeader, filterPopUp) {
                    var _this = this;
                    var button = document.createElement("div");
                    if (this.anyConditionIsApplied(option)) {
                        button.className = "tgrid-mobile-button-active"
                    }
                    else {
                        button.className = "tgrid-mobile-button"
                    }
                    var self = this;
                    button.onclick = function(e) {
                        var menu = document.createElement("ul");
                        menu.className = "tgrid-mobile-menu";
                        _this.addMobileMenuItems(option, menu, filterPopUp);
                        button.innerHTML = "";
                        button.appendChild(menu);
                        self.doOnClickOutside(menu, function() {
                            hideElement(menu)
                        });
                        e.cancelBubble = true
                    };
                    mobileHeader.appendChild(button)
                };
                BaseHtmlProvider.prototype.addMobileMenuItems = function(option, menu, filterPopUp) {
                    for (var i = 0; i < option.columns.length; i++) {
                        var column = option.columns[i];
                        if (column.member != null || column.sortMemberPath != null || column.filterMemberPath != null || column.groupMemberPath != null) {
                            var menuItem = document.createElement("li");
                            var columnHeader = this.buildMobileMenuColumnHeader(column);
                            this.bindData(option, columnHeader);
                            var columnContainer = document.createElement("div");
                            columnContainer.className = "tgrid-mobile-li-header-container";
                            columnContainer.appendChild(columnHeader);
                            var buttonsContainer = document.createElement("div");
                            buttonsContainer.className = "tgrid-header-cell-buttons";
                            if (option.enableSorting && column.sortMemberPath != null) {
                                var sortButton = document.createElement("div");
                                if (!option.columns[i].enableSorting) {
                                    addClass(sortButton, "tgrid-mobile-sort-button-inactive")
                                }
                                else {
                                    if (column.sortMemberPath == option.sortDescriptor.path) {
                                        if (option.sortDescriptor.asc == null) {
                                            sortButton.className = "tgrid-sort-button"
                                        }
                                        else if (option.sortDescriptor.asc) {
                                            sortButton.className = "tgrid-sort-button-asc"
                                        }
                                        else {
                                            sortButton.className = "tgrid-sort-button-desc"
                                        }
                                    }
                                    else {
                                        sortButton.className = "tgrid-sort-button"
                                    }
                                    sortButton.onclick = function(e) {
                                        e.cancelBubble = true;
                                        hideElement(menu);
                                        TGrid.Grid.getGridObject(e.target).sortBy(e.target["data-g-path"])
                                    }
                                }
                                buttonsContainer.appendChild(sortButton);
                                sortButton["data-g-path"] = column.sortMemberPath
                            }
                            if (option.enableFiltering && column.filterMemberPath != null) {
                                var filterButton = document.createElement("div");
                                var isFiltered = false;
                                if (!option.columns[i].enableFiltering) {
                                    addClass(filterButton, "tgrid-mobile-filter-button-inactive")
                                }
                                else {
                                    for (var j = 0; j < option.filterDescriptor.children.length; j++) {
                                        if (option.filterDescriptor.children[j].path == column.filterMemberPath) {
                                            filterButton.className = "tgrid-mobile-filter-button-active";
                                            isFiltered = true;
                                            break
                                        }
                                    }
                                    if (!isFiltered) {
                                        filterButton.className = "tgrid-mobile-filter-button"
                                    }
                                    var self = this;
                                    filterButton.onclick = function(e) {
                                        e.cancelBubble = true;
                                        hideElement(menu);
                                        self.doOnClickOutside(filterPopUp, function() {
                                            hideElement(filterPopUp)
                                        });
                                        TGrid.Grid.getGridObject(e.target).showFilterPopup(e.target["data-g-column"], e.pageX, e.pageY, false)
                                    }
                                }
                                buttonsContainer.appendChild(filterButton);
                                filterButton["data-g-column"] = column
                            }
                            if (option.enableGrouping && column.groupMemberPath != null) {
                                var groupButton = document.createElement("div");
                                var isGrouped = false;
                                if (!option.columns[i].enableGrouping) {
                                    addClass(groupButton, "tgrid-mobile-group-button-inactive")
                                }
                                else {
                                    for (var j = 0; j < option.groupBySortDescriptors.length; j++) {
                                        if (option.groupBySortDescriptors[j].path == column.groupMemberPath) {
                                            groupButton.className = "tgrid-group-button-active";
                                            isGrouped = true;
                                            break
                                        }
                                    }
                                    if (!isGrouped) {
                                        groupButton.className = "tgrid-group-button"
                                    }
                                    groupButton.onclick = function(e) {
                                        e.cancelBubble = true;
                                        hideElement(menu);
                                        var grid = TGrid.Grid.getGridObject(e.target);
                                        grid.toggleGroupDescriptor(e.target["data-g-path"])
                                    }
                                }
                                buttonsContainer.appendChild(groupButton);
                                groupButton["data-g-path"] = column.groupMemberPath
                            }
                            menuItem.appendChild(columnContainer);
                            menuItem.appendChild(buttonsContainer);
                            menu.appendChild(menuItem)
                        }
                    }
                };
                BaseHtmlProvider.prototype.doOnClickOutside = function(target, action) {
                    var eventListener = function(e) {
                            var currentElement = e.target;
                            while (currentElement != null && currentElement.tagName != 'BODY') {
                                if (currentElement == target) {
                                    return
                                }
                                currentElement = currentElement.parentElement
                            }
                            document.removeEventListener("click", eventListener);
                            action()
                        };
                    document.addEventListener("click", eventListener)
                };
                BaseHtmlProvider.prototype.appendIndent = function(target, level, isHeader) {
                    var tag = isHeader ? "th" : "td";
                    for (var i = 0; i < level; i++) {
                        var cell = document.createElement(tag);
                        cell.className = "tgrid-table-indent-cell";
                        var indentContent = document.createElement("div");
                        indentContent.className = "tgrid-table-indent-cell-content";
                        cell.appendChild(indentContent);
                        target.appendChild(cell)
                    }
                };
                BaseHtmlProvider.prototype.buildColumnHeader = function(column) {
                    var headerElement = document.createElement("div");
                    headerElement.className = "tgrid-header-cell-content";
                    if (column.header != null) {
                        column.header.applyTemplate(headerElement)
                    }
                    else {
                        var headerText = column.member != null ? column.member : '';
                        this.buildDefaultHeader(headerElement, headerText)
                    }
                    return headerElement
                };
                BaseHtmlProvider.prototype.buildMobileMenuColumnHeader = function(column) {
                    var headerElement = document.createElement("div");
                    headerElement.className = "tgrid-mobile-menu-li-column-header";
                    if (column.header != null) {
                        column.header.applyTemplate(headerElement)
                    }
                    else {
                        var headerText = column.member != null ? column.member : '';
                        this.buildDefaultHeader(headerElement, headerText)
                    }
                    return headerElement
                };
                BaseHtmlProvider.prototype.anyConditionIsApplied = function(options) {
                    if (options.sortDescriptor.path != null || (options.groupBySortDescriptors.length > 0 && options.groupBySortDescriptors[0].path != null) || options.filterDescriptor.children.length > 0 || options.filterDescriptor.condition != 0) {
                        return true
                    }
                    else {
                        return false
                    }
                };
                BaseHtmlProvider.prototype.detachDocumentClickEvent = function() {
                    document.onclick = BaseHtmlProvider.oldOnClick
                };
                BaseHtmlProvider.oldOnClick = document.onclick;
                return BaseHtmlProvider
            })();
        TGrid.BaseHtmlProvider = BaseHtmlProvider
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid
})(TesserisPro || (TesserisPro = {}));
var TesserisPro;
(function(TesserisPro) {
    (function(TGrid) {
        var FilterDescriptor = (function() {
                function FilterDescriptor(path, values, condition, parentChildOperator, childOperator, children) {
                    this.path = path;
                    this.value = values;
                    this.condition = condition;
                    this.children = children != undefined ? children : new Array;
                    this.childrenUnionOperator = childOperator != undefined ? childOperator : 0;
                    this.parentChildUnionOperator = parentChildOperator != undefined ? parentChildOperator : 0
                }
                FilterDescriptor.prototype.addChild = function(filter) {
                    this.children.push(filter)
                };
                FilterDescriptor.prototype.removeChildByPath = function(path) {
                    for (var i = 0; i < this.children.length; i++) {
                        if (this.children[i].path == path) {
                            this.children.splice(i, 1);
                            return
                        }
                    }
                };
                FilterDescriptor.getEmpty = function() {
                    return new FilterDescriptor("", "", 0)
                };
                return FilterDescriptor
            })();
        TGrid.FilterDescriptor = FilterDescriptor
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid
})(TesserisPro || (TesserisPro = {}));
;
;
var TesserisPro;
(function(TesserisPro) {
    (function(TGrid) {
        var GroupHeaderDescriptor = (function() {
                function GroupHeaderDescriptor(value, level, collapse, filterDescriptor) {
                    this.collapse = collapse;
                    this.value = value;
                    this.level = level;
                    this.filterDescriptor = filterDescriptor
                }
                return GroupHeaderDescriptor
            })();
        TGrid.GroupHeaderDescriptor = GroupHeaderDescriptor
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid
})(TesserisPro || (TesserisPro = {}));
;
;
var TesserisPro;
(function(TesserisPro) {
    (function(TGrid) {
        var ItemViewModel = (function() {
                function ItemViewModel(model, item, grid, isGroupHeader) {
                    this.model = model;
                    this.item = item;
                    this.grid = grid;
                    this.isGroupHeader = isGroupHeader
                }
                ItemViewModel.prototype.toggleDetailsForCell = function(columnIndex) {
                    if (this.grid.options.showCustomDetailFor.item != this.item || this.grid.options.showCustomDetailFor.item == this.item && this.grid.options.showDetailFor.column != columnIndex) {
                        this.openDetailsForCell(columnIndex)
                    }
                    else {
                        this.closeDetailsForCell(columnIndex)
                    }
                };
                ItemViewModel.prototype.openDetailsForCell = function(columnIndex) {
                    this.grid.options.showDetailFor.column = columnIndex;
                    this.grid.options.showDetailFor.item = this.item;
                    this.grid.updateRow(this.item, true);
                    this.grid.options.showCustomDetailFor.item = this.item;
                    this.grid.options.showCustomDetailFor.column = columnIndex;
                    this.grid.options.shouldAddDetailsOnSelection = false
                };
                ItemViewModel.prototype.closeDetailsForCell = function(columnIndex) {
                    if (this.grid.options.showCustomDetailFor.item == this.item) {
                        this.grid.options.showDetailFor = new TGrid.ShowDetail;
                        this.grid.updateRow(this.item, false);
                        this.grid.options.showCustomDetailFor = new TGrid.ShowDetail
                    }
                };
                ItemViewModel.prototype.setItemValue = function(item) {
                    this.item = item
                };
                return ItemViewModel
            })();
        TGrid.ItemViewModel = ItemViewModel
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid
})(TesserisPro || (TesserisPro = {}));
var TesserisPro;
(function(TesserisPro) {
    (function(TGrid) {
        (function(Framework) {
            Framework[Framework["Knockout"] = 0] = "Knockout";
            Framework[Framework["Angular"] = 1] = "Angular"
        })(TGrid.Framework || (TGrid.Framework = {}));
        var Framework = TGrid.Framework;
        (function(SelectionMode) {
            SelectionMode[SelectionMode["None"] = 0] = "None";
            SelectionMode[SelectionMode["Single"] = 1] = "Single";
            SelectionMode[SelectionMode["Multi"] = 2] = "Multi"
        })(TGrid.SelectionMode || (TGrid.SelectionMode = {}));
        var SelectionMode = TGrid.SelectionMode;
        (function(FilterCondition) {
            FilterCondition[FilterCondition["None"] = 0] = "None";
            FilterCondition[FilterCondition["Equals"] = 1] = "Equals";
            FilterCondition[FilterCondition["NotEquals"] = 2] = "NotEquals"
        })(TGrid.FilterCondition || (TGrid.FilterCondition = {}));
        var FilterCondition = TGrid.FilterCondition;
        (function(LogicalOperator) {
            LogicalOperator[LogicalOperator["And"] = 0] = "And";
            LogicalOperator[LogicalOperator["Or"] = 1] = "Or"
        })(TGrid.LogicalOperator || (TGrid.LogicalOperator = {}));
        var LogicalOperator = TGrid.LogicalOperator;
        ;
        var ColumnInfo = (function() {
                function ColumnInfo() {
                    this.header = null;
                    this.cell = null;
                    this.cellDetail = null;
                    this.width = "150";
                    this.device = "mobile,desktop";
                    this.sortMemberPath = null;
                    this.groupMemberPath = null;
                    this.member = null;
                    this.resizable = true;
                    this.filterMemberPath = null;
                    this.notSized = false;
                    this.enableFiltering = true;
                    this.enableSorting = true;
                    this.enableGrouping = true
                }
                return ColumnInfo
            })();
        TGrid.ColumnInfo = ColumnInfo;
        var ShowDetail = (function() {
                function ShowDetail() {
                    this.column = -1;
                    this.item = null
                }
                return ShowDetail
            })();
        TGrid.ShowDetail = ShowDetail;
        var Template = (function() {
                function Template(prototype) {
                    this.content = "";
                    this.content = prototype.innerHTML == null ? prototype.innerText : prototype.innerHTML
                }
                Template.prototype.applyTemplate = function(element) {
                    element.innerHTML = this.content != null ? this.content : ""
                };
                Template.prototype.getContent = function() {
                    return this.content
                };
                return Template
            })();
        TGrid.Template = Template;
        var Options = (function() {
                function Options(element, framework) {
                    this.columns = [];
                    this.mobileTemplateHtml = null;
                    this.detailsTemplateHtml = null;
                    this.groupHeaderTemplate = null;
                    this.filterPopup = null;
                    this.pageSize = 10;
                    this.pageSlide = 1;
                    this.batchSize = 5;
                    this.firstLoadSize = 10;
                    this.currentPage = 0;
                    this.groupBySortDescriptors = [];
                    this.selectionMode = 1;
                    this.filterDescriptor = TGrid.FilterDescriptor.getEmpty();
                    this.tableFooterTemplate = null;
                    this.selection = [];
                    this.columnMinWidth = 5;
                    this.hasAnyNotSizedColumn = false;
                    this.captureScroll = true;
                    this.target = element;
                    this.framework = framework;
                    this.initialize();
                    this.minItemsCountForVirtualization = 100
                }
                Options.prototype.isSelected = function(item) {
                    for (var i = 0; i < this.selection.length; i++) {
                        if (this.selection[i] == item) {
                            return true
                        }
                    }
                    return false
                };
                Options.prototype.initialize = function() {
                    if (this.target.getElementsByTagName("script").length > 0) {
                        var text = this.target.getElementsByTagName("script")[0].innerHTML;
                        var optionsElement = document.createElement("div");
                        optionsElement.innerHTML = text;
                        var headers = optionsElement.getElementsByTagName("header");
                        var cells = optionsElement.getElementsByTagName("cell");
                        var cellDetails = optionsElement.getElementsByTagName("celldetail");
                        var columns = optionsElement.getElementsByTagName("column");
                        for (var i = 0; i < columns.length; i++) {
                            var column = new ColumnInfo;
                            if (columns[i].attributes['data-g-member'] != undefined) {
                                column.member = columns[i].attributes['data-g-member'].nodeValue
                            }
                            var header = columns[i].getElementsByTagName("header");
                            if (header.length > 0) {
                                column.header = new Template(header[0])
                            }
                            var cell = columns[i].getElementsByTagName("cell");
                            if (cell.length > 0) {
                                column.cell = new Template(cell[0])
                            }
                            var cellDetail = columns[i].getElementsByTagName("celldetail");
                            if (cellDetail.length == 1) {
                                column.cellDetail = new Template(cellDetail[0])
                            }
                            if (columns[i].attributes['data-g-width'] != null) {
                                column.width = columns[i].attributes['data-g-width'].nodeValue
                            }
                            if (columns[i].attributes['data-g-views'] != null) {
                                column.device = columns[i].attributes['data-g-views'].nodeValue
                            }
                            if (columns[i].attributes['data-g-resizable'] != undefined) {
                                column.resizable = columns[i].attributes['data-g-resizable'].nodeValue == 'false' ? false : true
                            }
                            if (columns[i].attributes['data-g-not-sized'] != undefined) {
                                column.notSized = columns[i].attributes['data-g-not-sized'].nodeValue == 'true' ? true : false;
                                this.hasAnyNotSizedColumn = true
                            }
                            if (columns[i].attributes['data-g-enable-filtering'] != undefined) {
                                column.enableFiltering = columns[i].attributes['data-g-enable-filtering'].nodeValue == 'false' ? false : true
                            }
                            if (columns[i].attributes['data-g-enable-sorting'] != undefined) {
                                column.enableSorting = columns[i].attributes['data-g-enable-sorting'].nodeValue == 'false' ? false : true
                            }
                            if (columns[i].attributes['data-g-enable-grouping'] != undefined) {
                                column.enableGrouping = columns[i].attributes['data-g-enable-grouping'].nodeValue == 'false' ? false : true
                            }
                            column.sortMemberPath = columns[i].attributes['data-g-sort-member'] != undefined ? columns[i].attributes['data-g-sort-member'].nodeValue : column.member;
                            column.groupMemberPath = columns[i].attributes['data-g-group-member'] !== undefined ? columns[i].attributes['data-g-group-member'].nodeValue : column.member;
                            column.filterMemberPath = columns[i].attributes['data-g-filter-member'] != undefined ? columns[i].attributes['data-g-filter-member'].nodeValue : column.member;
                            this.columns.push(column)
                        }
                        var filterPopup = optionsElement.getElementsByTagName("filterpopup");
                        if (filterPopup.length == 1) {
                            this.filterPopup = new Template(filterPopup[0])
                        }
                        var mobileTemplate = optionsElement.getElementsByTagName("mobile");
                        if (mobileTemplate.length == 1) {
                            this.mobileTemplateHtml = new Template(mobileTemplate[0])
                        }
                        var groupHeaderTemplate = optionsElement.getElementsByTagName("groupheader");
                        if (groupHeaderTemplate.length == 1) {
                            this.groupHeaderTemplate = new Template(groupHeaderTemplate[0])
                        }
                        var detailsTemplate = optionsElement.getElementsByTagName("details");
                        if (detailsTemplate.length == 1) {
                            this.detailsTemplateHtml = new Template(detailsTemplate[0])
                        }
                        var footer = optionsElement.getElementsByTagName("footer");
                        if (footer.length != 0) {
                            this.tableFooterTemplate = new Template(footer[0])
                        }
                    }
                    this.sortDescriptor = new TesserisPro.TGrid.SortDescriptor(null, null);
                    this.showDetailFor = new ShowDetail;
                    this.showCustomDetailFor = new ShowDetail;
                    this.filterPopupForColumn = new ColumnInfo
                };
                Options.prototype.applyHandler = function() {
                    for (var i = 0; i < this.columns.length; i++) {
                        if (isNotNoU(this.columns[i].member)) {
                            if (isNoU(this.columns[i].groupMemberPath)) {
                                this.columns[i].groupMemberPath = this.columns[i].member
                            }
                            if (isNoU(this.columns[i].sortMemberPath)) {
                                this.columns[i].sortMemberPath = this.columns[i].member
                            }
                            if (isNoU(this.columns[i].filterMemberPath)) {
                                this.columns[i].sortMemberPath = this.columns[i].member
                            }
                        }
                    }
                    this.apply()
                };
                return Options
            })();
        TGrid.Options = Options
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid
})(TesserisPro || (TesserisPro = {}));
var TesserisPro;
(function(TesserisPro) {
    (function(TGrid) {
        var SortDescriptor = (function() {
                function SortDescriptor(path, asc) {
                    this.path = path;
                    this.asc = asc
                }
                return SortDescriptor
            })();
        TGrid.SortDescriptor = SortDescriptor
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid
})(TesserisPro || (TesserisPro = {}));
var TesserisPro;
(function(TesserisPro) {
    (function(TGrid) {
        var Grid = (function() {
                function Grid(element, options, provider) {
                    var _this = this;
                    this.isPreloadingNext = false;
                    this.isPreloadingPrevious = false;
                    this.enablePreload = true;
                    this.isBuisy = false;
                    this.isFirstRefresh = true;
                    element.grid = this;
                    this.targetElement = element;
                    this.options = options;
                    this.itemProvider = provider;
                    if (this.options.minItemsCountForVirtualization > 0 && this.options.enableVirtualScroll) {
                        this.itemProvider.getTotalItemsCount(this.options.filterDescriptor, function(count) {
                            if (count < _this.options.minItemsCountForVirtualization) {
                                _this.options.enableVirtualScroll = false
                            }
                            _this.initialize()
                        })
                    }
                    else {
                        this.initialize()
                    }
                }
                Grid.prototype.initialize = function() {
                    var _this = this;
                    this.collapsedGroupFilterDescriptors = new Array;
                    this.itemProvider.onAdd = function() {
                        if (!_this.options.enableVirtualScroll) {
                            _this.options.firstLoadSize++
                        }
                        _this.refreshBody()
                    };
                    this.itemProvider.onReset = function() {
                        if (!_this.options.enableVirtualScroll) {
                            _this.itemProvider.getTotalItemsCount(_this.options.filterDescriptor, function(total) {
                                _this.options.firstLoadSize = total
                            })
                        }
                        _this.refreshBody()
                    };
                    this.itemProvider.onRemove = function() {
                        if (!_this.options.enableVirtualScroll) {
                            _this.options.firstLoadSize--
                        }
                        _this.refreshBody()
                    };
                    this.htmlProvider = this.getHtmlProvider(this.options);
                    this.footerViewModel = this.htmlProvider.getFooterViewModel(this);
                    this.rootElement = document.createElement("div");
                    this.rootElement.className = "tgrid-root";
                    if (!this.options.hideHeader) {
                        this.groupByElement = document.createElement("div");
                        this.groupByElement.className = "tgrid-group-by-panel desktop";
                        this.rootElement.appendChild(this.groupByElement);
                        this.headerContainer = document.createElement("div");
                        this.headerContainer.className = "tgrid-tableheadercontainer desktop";
                        var headerTable = document.createElement("table");
                        headerTable.className = "tgrid-table";
                        this.headerContainer.appendChild(headerTable)
                    }
                    if (this.options.enableFiltering) {
                        this.filterPopUp = document.createElement("div");
                        this.filterPopUp.setAttribute("class", "tgrid-filter-popup");
                        this.filterPopUp.style.display = "none";
                        this.filterPopUp.grid = this;
                        document.body.appendChild(this.filterPopUp);
                        this.filterPopupViewModel = this.htmlProvider.getFilterPopupViewModel(this.filterPopUp);
                        this.htmlProvider.updateFilteringPopUp(this.options, this.filterPopUp, this.filterPopupViewModel)
                    }
                    this.bodyAndHeaderContainer = document.createElement("div");
                    this.bodyAndHeaderContainer.className = "tgrid-body-and-header-container";
                    this.bodyAndHeaderContainer.style.position = "relative";
                    this.bodyAndHeaderContainer.style.overflowX = "auto";
                    this.bodyAndHeaderContainer.style.width = "100%";
                    if (!this.options.hideHeader) {
                        this.mobileHeader = document.createElement("div");
                        this.mobileHeader.className = "tgrid-mobile-header mobile";
                        this.bodyAndHeaderContainer.appendChild(this.mobileHeader);
                        this.tableHeader = document.createElement("thead");
                        this.tableHeader.setAttribute("class", "tgrid-table-header desktop");
                        headerTable.appendChild(this.tableHeader);
                        this.bodyAndHeaderContainer.appendChild(this.headerContainer)
                    }
                    this.tableBodyContainer = document.createElement("div");
                    this.tableBodyContainer.className = "tgrid-tablebodycontainer desktop";
                    this.tableBodyContainer.style.overflowX = "auto";
                    if (!this.options.hideHeader) {
                        this.tableBodyContainer.onscroll = function() {
                            return _this.headerContainer.scrollLeft = _this.tableBodyContainer.scrollLeft
                        }
                    }
                    else {
                        this.tableBodyContainer.onscroll = function() {
                            return _this.tableBodyContainer.scrollLeft
                        }
                    }
                    this.mobileContainer = document.createElement("div");
                    this.mobileContainer.setAttribute("class", "tgrid-mobile-container mobile");
                    if (this.options.enableVirtualScroll) {
                        this.tableBodyContainer.onscroll = function() {
                            return _this.scrollTable()
                        };
                        this.mobileContainer.onscroll = function() {
                            return _this.scrollTable()
                        }
                    }
                    else {
                        this.itemProvider.getTotalItemsCount(this.options.filterDescriptor, function(total) {
                            _this.options.firstLoadSize = total
                        })
                    }
                    var bodyTable = document.createElement("table");
                    bodyTable.className = "tgrid-table";
                    this.tableBodyContainer.appendChild(bodyTable);
                    this.tableBody = document.createElement("tbody");
                    bodyTable.appendChild(this.tableBody);
                    if (this.options.enableVirtualScroll) {
                        this.scrollBar = document.createElement("div");
                        if (!this.options.hideHeader) {
                            this.scrollBar.className = "tgrid-scroll"
                        }
                        else {
                            this.scrollBar.className = "tgrid-scroll noheader"
                        }
                        var scrollContent = document.createElement("div");
                        scrollContent.style.height = "10000px";
                        scrollContent.style.width = "1px";
                        this.scrollBar.appendChild(scrollContent);
                        this.bodyAndHeaderContainer.appendChild(this.scrollBar);
                        this.scrollBar.onscroll = function() {
                            return _this.onManualScroll()
                        }
                    }
                    this.bodyAndHeaderContainer.appendChild(this.tableBodyContainer);
                    this.bodyAndHeaderContainer.appendChild(this.mobileContainer);
                    this.rootElement.appendChild(this.bodyAndHeaderContainer);
                    this.tableFooter = document.createElement("div");
                    this.tableFooter.setAttribute("class", "tgrid-footer");
                    this.rootElement.appendChild(this.tableFooter);
                    this.targetElement.appendChild(this.rootElement);
                    this.tableBodyContainer.scrollTop = 0;
                    if (this.options.groupBySortDescriptors.length > 0) {
                        this.refreshHeader();
                        this.refreshBody(this.options.enableVirtualScroll)
                    }
                    else {
                        this.sortBy(this.options.sortDescriptor.path)
                    }
                    this.refreshFooter();
                    this.buisyIndicator = document.createElement("div");
                    this.buisyIndicator.className = "tgrid-buisy-indicator";
                    this.rootElement.appendChild(this.buisyIndicator);
                    if (this.options.captureScroll) {
                        this.rootElement.onmousewheel = function(e) {
                            return _this.mouseWheel(e)
                        }
                    }
                    this.rootElement.tabIndex = 0;
                    this.rootElement.onkeydown = function(e) {
                        return _this.keyPress(e)
                    };
                    this.tableBodyContainer.onmousedown = function(e) {
                        if (e.button == 1) {
                            e.preventDefault()
                        }
                    };
                    this.hideBuisyIndicator()
                };
                Grid.prototype.GetRootElement = function() {
                    return this.rootElement
                };
                Grid.getGridObject = function(element) {
                    if (element == null) {
                        return null
                    }
                    if (element.grid == undefined || element.grid == null) {
                        if (element.parentElement == document.body) {
                            return null
                        }
                        return Grid.getGridObject(element.parentElement)
                    }
                    return element.grid
                };
                Grid.prototype.columnsResized = function(c) {
                    if (parseInt(c.width) < this.options.columnMinWidth) {
                        c.width = this.options.columnMinWidth.toString()
                    }
                    this.htmlProvider.updateColumnWidth(this.options, this.tableHeader, this.tableBody, this.tableFooter)
                };
                Grid.prototype.mouseWheel = function(e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    this.tableBodyContainer.scrollTop = this.tableBodyContainer.scrollTop - e.wheelDelta;
                    this.mobileContainer.scrollTop = this.mobileContainer.scrollTop - e.wheelDelta
                };
                Grid.prototype.keyPress = function(e) {
                    switch (e.keyCode) {
                        case 38:
                            e.preventDefault();
                            this.selectPreviousItem();
                            break;
                        case 40:
                            e.preventDefault();
                            this.selectNextItem();
                            break
                    }
                };
                Grid.prototype.selectNextItem = function() {
                    var selectedItem;
                    if (this.options.selection.length > 0) {
                        var item = this.options.selection[this.options.selection.length - 1];
                        for (var i = 0; i < this.visibleViewModels.length; i++) {
                            if (this.visibleViewModels[i].item == item) {
                                while (i < this.visibleViewModels.length - 1 && this.visibleViewModels[i + 1].isGroupHeader) {
                                    i++
                                }
                                if (i < this.visibleViewModels.length - 1 && !this.visibleViewModels[i + 1].isGroupHeader) {
                                    selectedItem = this.visibleViewModels[i + 1];
                                    break
                                }
                                if (i == this.visibleViewModels.length - 1) {
                                    if (!this.visibleViewModels[i].isGroupHeader) {
                                        selectedItem = this.visibleViewModels[i];
                                        break
                                    }
                                    else {
                                        while (i >= 0 && this.visibleViewModels[i].isGroupHeader) {
                                            i--
                                        }
                                        selectedItem = this.visibleViewModels[i];
                                        break
                                    }
                                }
                            }
                        }
                    }
                    if (selectedItem == null && this.visibleViewModels.length != 0) {
                        selectedItem = this.visibleViewModels[0]
                    }
                    if (selectedItem != null) {
                        this.selectItem(selectedItem, false)
                    }
                };
                Grid.prototype.selectPreviousItem = function() {
                    var selectedItem;
                    if (this.options.selection.length > 0) {
                        var item = this.options.selection[this.options.selection.length - 1];
                        for (var i = this.visibleViewModels.length - 1; i >= 0; i--) {
                            if (this.visibleViewModels[i].item == item) {
                                while (i > 0 && this.visibleViewModels[i - 1].isGroupHeader) {
                                    i--
                                }
                                if (i > 0 && !this.visibleViewModels[i - 1].isGroupHeader) {
                                    selectedItem = this.visibleViewModels[i - 1];
                                    break
                                }
                                if (i == 0) {
                                    if (!this.visibleViewModels[i].isGroupHeader) {
                                        selectedItem = this.visibleViewModels[i];
                                        break
                                    }
                                    else {
                                        while (i < this.visibleViewModels.length - 1 && this.visibleViewModels[i].isGroupHeader) {
                                            this.scrollIntoView(this.visibleViewModels[i].item);
                                            i++
                                        }
                                        selectedItem = this.visibleViewModels[i];
                                        break
                                    }
                                }
                            }
                        }
                    }
                    if (selectedItem == null && this.visibleViewModels.length != 0) {
                        selectedItem = this.visibleViewModels[0]
                    }
                    if (selectedItem != null) {
                        this.selectItem(selectedItem, false)
                    }
                };
                Grid.prototype.getPreviousPageFirsItemIndex = function() {
                    var result = this.firstVisibleItemIndex - this.options.batchSize;
                    if (result < 0) {
                        result = 0
                    }
                    return result
                };
                Grid.prototype.isDesktopMode = function() {
                    return this.tableBodyContainer.clientWidth != 0
                };
                Grid.prototype.getPreviousPageSize = function() {
                    var realBatchSize = this.options.batchSize;
                    var perviousPageFirstItemsNumber = this.firstVisibleItemIndex - realBatchSize;
                    if (perviousPageFirstItemsNumber < 0) {
                        return realBatchSize + perviousPageFirstItemsNumber
                    }
                    return realBatchSize
                };
                Grid.prototype.getNextPageFirstItemIndex = function() {
                    return this.firstVisibleItemIndex + this.visibleItems.length
                };
                Grid.prototype.getNextPageSize = function() {
                    return this.options.batchSize
                };
                Grid.prototype.getEffectiveSorting = function() {
                    var result = new Array;
                    var foundSortDescriptor = false;
                    var otherSorting = new Array;
                    for (var j = 0; j < this.options.groupBySortDescriptors.length; j++) {
                        var found = false;
                        for (var i = 0; i < result.length; i++) {
                            if (this.options.sortDescriptor.path == this.options.groupBySortDescriptors[j].path) {
                                foundSortDescriptor = true
                            }
                            if (result[i].path == this.options.groupBySortDescriptors[j].path) {
                                found = true;
                                break
                            }
                        }
                        if (!found) {
                            if (this.options.groupBySortDescriptors[j].path == this.options.sortDescriptor.path) {
                                this.options.groupBySortDescriptors[j].asc = this.options.sortDescriptor.asc
                            }
                            result.push(this.options.groupBySortDescriptors[j])
                        }
                    }
                    if (!foundSortDescriptor) {
                        result.push(this.options.sortDescriptor)
                    }
                    return result
                };
                Grid.prototype.getEffectiveFiltering = function() {
                    return this.options.filterDescriptor
                };
                Grid.prototype.getCollapsedGroupFilter = function() {
                    return this.collapsedGroupFilterDescriptors
                };
                Grid.prototype.scrollTable = function() {
                    if (this.isDesktopMode && !this.options.hideHeader) {
                        this.headerContainer.scrollLeft = this.tableBodyContainer.scrollLeft
                    }
                    var container = this.isDesktopMode() ? this.tableBodyContainer : this.mobileContainer;
                    if (!this.isPreloadingNext && this.enablePreload) {
                        if (container.scrollTop > ((container.scrollHeight - container.clientHeight) / 4 * 3) && this.nextPage == null) {
                            this.preloadNextPage()
                        }
                    }
                    if (!this.isPreloadingPrevious && this.enablePreload) {
                        if (container.scrollTop < ((container.scrollHeight - container.clientHeight) / 4) && this.previousPage == null) {
                            this.preloadPreviousPage()
                        }
                    }
                    if (this.totalItemsCount > this.firstVisibleItemIndex + this.visibleItems.length) {
                        if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
                            this.showNextPage()
                        }
                    }
                    if (this.firstVisibleItemIndex > 0) {
                        if (container.scrollTop <= 10) {
                            this.showPreviousPage()
                        }
                    }
                    if (this.isDesktopMode()) {
                        this.updateGlobalScroll()
                    }
                    else {}
                };
                Grid.prototype.updateGlobalScroll = function() {
                    var _this = this;
                    if (this.tableBodyContainer.scrollTop == this.tableBodyContainer.scrollHeight - this.tableBodyContainer.clientHeight && this.firstVisibleItemIndex + this.visibleItems.length == this.totalItemsCount) {
                        this.scrollBar.onscroll = null;
                        this.scrollBar.scrollTop = this.scrollBar.scrollHeight - this.scrollBar.clientHeight;
                        this.scrollBar.onscroll = function() {
                            _this.scrollBar.onscroll = function() {
                                return _this.onManualScroll()
                            }
                        };
                        return
                    }
                    var firstItem = this.htmlProvider.getFirstVisibleItem(this.tableBody, this.visibleViewModels, this.tableBodyContainer.scrollTop);
                    if (firstItem.isGroupHeader) {
                        firstItem = this.getFirstItemInGroup(firstItem)
                    }
                    if (firstItem != null) {
                        var visibleItemIndex = this.firstVisibleItemIndex;
                        for (var i = 0; i < this.visibleItems.length; i++) {
                            if (firstItem.item == this.visibleItems[i]) {
                                visibleItemIndex = this.firstVisibleItemIndex + i;
                                break
                            }
                        }
                        this.scrollBar.onscroll = null;
                        var visibleItemsCount = this.htmlProvider.getVisibleItemsCount(this.tableBody, this.tableBodyContainer, this.tableBodyContainer.scrollTop, true);
                        var scrollPosition = (this.scrollBar.scrollHeight - this.scrollBar.clientHeight) / (this.totalItemsCount - visibleItemsCount) * visibleItemIndex + 10;
                        this.scrollBar.scrollTop = scrollPosition;
                        this.scrollBar.onscroll = function() {
                            _this.scrollBar.onscroll = function() {
                                return _this.onManualScroll()
                            }
                        }
                    }
                };
                Grid.prototype.getFirstItemInGroup = function(groupHeaderViewModel) {
                    for (var i = 0; i < this.visibleViewModels.length; i++) {
                        if (this.visibleViewModels[i] == groupHeaderViewModel) {
                            for (; i < this.visibleViewModels.length; i++) {
                                if (!this.visibleViewModels[i].isGroupHeader) {
                                    return this.visibleViewModels[i]
                                }
                            }
                        }
                    }
                    return null
                };
                Grid.prototype.updateGlobalScrollMobile = function() {
                    var _this = this;
                    if (this.mobileContainer.scrollTop == this.mobileContainer.scrollHeight - this.mobileContainer.clientHeight && this.firstVisibleItemIndex + this.visibleItems.length == this.totalItemsCount) {
                        this.scrollBar.onscroll = null;
                        this.scrollBar.scrollTop = this.scrollBar.scrollHeight - this.scrollBar.clientHeight;
                        this.scrollBar.onscroll = function() {
                            _this.scrollBar.onscroll = function() {
                                return _this.onManualScroll()
                            }
                        };
                        return
                    }
                    var firstItem = this.htmlProvider.getFirstVisibleItem(this.mobileContainer, this.visibleViewModels, this.mobileContainer.scrollTop);
                    if (firstItem != null) {
                        var visibleItemIndex = this.firstVisibleItemIndex;
                        for (var i = 0; i < this.visibleItems.length; i++) {
                            if (firstItem.item == this.visibleItems[i]) {
                                visibleItemIndex = this.firstVisibleItemIndex + i;
                                break
                            }
                        }
                        var visibleItemsCount = this.htmlProvider.getVisibleItemsCount(this.mobileContainer, this.mobileContainer, this.mobileContainer.scrollTop, true);
                        var scrollPosition = (this.scrollBar.scrollHeight - this.scrollBar.clientHeight) / (this.totalItemsCount - visibleItemsCount) * visibleItemIndex;
                        this.scrollBar.onscroll = null;
                        this.scrollBar.scrollTop = scrollPosition;
                        this.scrollBar.onscroll = function() {
                            _this.scrollBar.onscroll = function() {
                                return _this.onManualScroll()
                            }
                        }
                    }
                };
                Grid.prototype.onManualScroll = function() {
                    var _this = this;
                    if (this.manualScrollTimeoutToken != null) {
                        clearTimeout(this.manualScrollTimeoutToken)
                    }
                    this.manualScrollTimeoutToken = setTimeout(function() {
                        _this.manualScrollTimeoutToken = null;
                        var visibleItemsCount;
                        if (_this.isDesktopMode()) {
                            visibleItemsCount = _this.htmlProvider.getVisibleItemsCount(_this.tableBody, _this.tableBodyContainer, _this.tableBodyContainer.scrollTop, true)
                        }
                        else {
                            visibleItemsCount = _this.htmlProvider.getVisibleItemsCount(_this.mobileContainer, _this.mobileContainer, _this.mobileContainer.scrollTop, true)
                        }
                        var itemSize = (_this.scrollBar.scrollHeight - _this.scrollBar.clientHeight) / (_this.totalItemsCount - visibleItemsCount);
                        var itemNumber = _this.scrollBar.scrollTop / itemSize;
                        _this.showBuisyIndicator();
                        _this.previousPage = null;
                        _this.nextPage = null;
                        var scrollBottom = false;
                        _this.itemProvider.getItems(itemNumber, _this.options.firstLoadSize, _this.getEffectiveSorting(), _this.getEffectiveFiltering(), _this.getCollapsedGroupFilter(), function(items, first, count) {
                            if (itemNumber == 0) {
                                _this.scrollTableContainer(0)
                            }
                            else {
                                _this.scrollTableContainer(48)
                            }
                            _this.firstVisibleItemIndex = first;
                            _this.visibleItems = items;
                            _this.visibleViewModels = _this.buildViewModels(_this.visibleItems);
                            _this.updateVisibleItems();
                            _this.hideBuisyIndicator()
                        })
                    }, 400)
                };
                Grid.prototype.preloadPreviousPage = function() {
                    var _this = this;
                    var size = this.getPreviousPageSize();
                    if (size > 0) {
                        this.isPreloadingPrevious = true;
                        this.itemProvider.getItems(this.getPreviousPageFirsItemIndex(), size, this.getEffectiveSorting(), this.getEffectiveFiltering(), this.getCollapsedGroupFilter(), function(items, first, count) {
                            _this.previousPage = items;
                            _this.isPreloadingPrevious = false
                        })
                    }
                };
                Grid.prototype.preloadNextPage = function() {
                    var _this = this;
                    this.isPreloadingNext = true;
                    this.itemProvider.getItems(this.getNextPageFirstItemIndex(), this.getNextPageSize(), this.getEffectiveSorting(), this.getEffectiveFiltering(), this.getCollapsedGroupFilter(), function(items, first, count) {
                        _this.nextPage = items;
                        _this.isPreloadingNext = false
                    })
                };
                Grid.prototype.showPreviousPage = function() {
                    var _this = this;
                    if (this.previousPage == null) {
                        if (this.firstVisibleItemIndex == 0) {
                            this.hideBuisyIndicator();
                            return
                        }
                        this.showBuisyIndicator();
                        if (!this.isPreloadingPrevious) {
                            this.preloadPreviousPage()
                        }
                        setTimeout(function() {
                            _this.showPreviousPage()
                        }, 10)
                    }
                    else if (this.previousPage != null && this.previousPage.length > 0) {
                        this.hideBuisyIndicator();
                        this.enablePreload = false;
                        this.visibleItems.splice(this.visibleItems.length - this.options.batchSize, this.options.batchSize);
                        this.firstVisibleItemIndex -= this.options.batchSize;
                        if (this.firstVisibleItemIndex < 0) {
                            this.firstVisibleItemIndex = 0
                        }
                        var firstNewItem = this.previousPage[this.previousPage.length - 1];
                        this.visibleItems = this.previousPage.concat(this.visibleItems);
                        this.visibleViewModels = this.buildViewModels(this.visibleItems);
                        this.updateVisibleItems();
                        var skipItems = new Array;
                        for (var i = 0; i < this.visibleViewModels.length; i++) {
                            skipItems.push(this.visibleViewModels[i]);
                            if (this.visibleViewModels[i].item == firstNewItem) {
                                break
                            }
                        }
                        var skipSize = this.htmlProvider.getElementsSize(this.tableBody, skipItems);
                        this.scrollTableContainer(skipSize);
                        this.previousPage = null;
                        this.nextPage = null;
                        this.enablePreload = true;
                        this.rootElement.focus()
                    }
                };
                Grid.prototype.showNextPage = function() {
                    var _this = this;
                    if (this.nextPage == null) {
                        if (this.totalItemsCount <= this.firstVisibleItemIndex + this.visibleItems.length) {
                            this.hideBuisyIndicator();
                            return
                        }
                        this.showBuisyIndicator();
                        if (!this.isPreloadingNext) {
                            this.preloadNextPage()
                        }
                        setTimeout(function() {
                            _this.showNextPage()
                        }, 10)
                    }
                    else if (this.nextPage != null && this.nextPage.length > 0) {
                        this.hideBuisyIndicator();
                        this.enablePreload = false;
                        var item;
                        if (this.isDesktopMode()) {
                            item = this.htmlProvider.getFirstVisibleItem(this.tableBody, this.visibleViewModels, this.tableBodyContainer.scrollTop)
                        }
                        else {
                            item = this.htmlProvider.getFirstVisibleItem(this.mobileContainer, this.visibleViewModels, this.mobileContainer.scrollTop)
                        }
                        var itemNumber = 0;
                        for (var i = 0; i < this.visibleItems.length; i++) {
                            if (item.item == this.visibleItems[i]) {
                                itemNumber = i;
                                break
                            }
                        }
                        var itemsToRemove = itemNumber - this.options.batchSize;
                        if (itemsToRemove > 0) {
                            this.visibleItems.splice(0, itemsToRemove);
                            this.firstVisibleItemIndex += itemsToRemove
                        }
                        var firstNewItem = item;
                        for (var i = 0; i < this.visibleItems.length - 1; i++) {
                            if (item.item == this.visibleItems[i]) {
                                firstNewItem = this.visibleItems[i + 1];
                                break
                            }
                        }
                        this.visibleItems = this.visibleItems.concat(this.nextPage);
                        this.visibleViewModels = this.buildViewModels(this.visibleItems);
                        this.updateVisibleItems();
                        var skipItems = new Array;
                        for (var i = 0; i < this.visibleViewModels.length; i++) {
                            skipItems.push(this.visibleViewModels[i]);
                            if (this.visibleViewModels[i].item == firstNewItem) {
                                break
                            }
                        }
                        var skipSize = this.isDesktopMode() ? this.htmlProvider.getElementsSize(this.tableBody, skipItems) : this.htmlProvider.getElementsSize(this.mobileContainer, skipItems);
                        this.scrollTableContainer(skipSize);
                        this.nextPage = null;
                        this.previousPage = null;
                        this.enablePreload = true;
                        this.rootElement.focus()
                    }
                };
                Grid.prototype.scrollTableContainer = function(scrollTop) {
                    this.tableBodyContainer.scrollTop = scrollTop;
                    this.mobileContainer.scrollTop = scrollTop <= 0 ? 2 : scrollTop
                };
                Grid.prototype.silentScrollTableContainer = function(scrollTop) {
                    var _this = this;
                    this.tableBodyContainer.onscroll = null;
                    this.mobileContainer.onscroll = null;
                    this.tableBodyContainer.scrollTop = scrollTop;
                    this.mobileContainer.scrollTop = scrollTop <= 0 ? 2 : scrollTop;
                    setTimeout(function() {
                        _this.tableBodyContainer.onscroll = function() {
                            return _this.scrollTable()
                        };
                        _this.mobileContainer.onscroll = function() {
                            return _this.scrollTable()
                        }
                    }, 10)
                };
                Grid.prototype.addGroupDescriptor = function(name, asc) {
                    this.options.groupBySortDescriptors.push(new TGrid.SortDescriptor(name, asc));
                    this.refreshHeader();
                    this.refreshBody()
                };
                Grid.prototype.toggleGroupDescriptor = function(name) {
                    for (var i = 0; i < this.options.groupBySortDescriptors.length; i++) {
                        if (this.options.groupBySortDescriptors[i].path == name) {
                            this.removeGroupDescriptor(name);
                            return
                        }
                    }
                    this.addGroupDescriptor(name, true)
                };
                Grid.prototype.removeGroupDescriptor = function(path) {
                    for (var i = 0; i < this.options.groupBySortDescriptors.length; i++) {
                        if (this.options.groupBySortDescriptors[i].path == path) {
                            this.options.groupBySortDescriptors.splice(i, 1);
                            break
                        }
                    }
                    var removed = true;
                    while (removed) {
                        removed = false;
                        for (var i = 0; !removed && i < this.collapsedGroupFilterDescriptors.length; i++) {
                            for (var j = 0; !removed && j < this.collapsedGroupFilterDescriptors[i].children.length; j++) {
                                if (this.collapsedGroupFilterDescriptors[i].children[j].path == path) {
                                    this.collapsedGroupFilterDescriptors.splice(i, 1);
                                    removed = true
                                }
                            }
                        }
                    }
                    this.refreshHeader();
                    this.refreshBody()
                };
                Grid.prototype.showFilterPopup = function(column, pageX, pageY, isForDesktop) {
                    this.options.filterPopupForColumn = column;
                    this.filterPopupViewModel.onOpen(this.options, column);
                    if (isForDesktop) {
                        this.filterPopUp.style.left = pageX.toString() + "px";
                        this.filterPopUp.style.top = pageY.toString() + "px"
                    }
                    unhideElement(this.filterPopUp)
                };
                Grid.prototype.hideFilterPopup = function() {
                    hideElement(this.filterPopUp)
                };
                Grid.prototype.sortBy = function(name) {
                    if (name != null) {
                        if (name == this.options.sortDescriptor.path) {
                            if (this.options.sortDescriptor.asc) {
                                this.options.sortDescriptor.asc = !this.options.sortDescriptor.asc
                            }
                            else {
                                this.options.sortDescriptor.path = null;
                                this.options.sortDescriptor.asc = null
                            }
                        }
                        else {
                            this.options.sortDescriptor.path = name;
                            this.options.sortDescriptor.asc = true
                        }
                    }
                    this.refreshHeader();
                    this.refreshBody()
                };
                Grid.prototype.mobileSortBy = function(name, asc) {
                    if (asc != null) {
                        this.options.sortDescriptor.path = name;
                        this.options.sortDescriptor.asc = asc
                    }
                    else {
                        this.options.sortDescriptor = new TGrid.SortDescriptor(null, null)
                    }
                    this.refreshHeader();
                    this.refreshBody()
                };
                Grid.prototype.selectPage = function(page) {
                    this.options.currentPage = page;
                    this.refreshHeader();
                    this.refreshBody();
                    this.refreshFooter()
                };
                Grid.prototype.selectItem = function(item, multi) {
                    var oldSelection = new Array;
                    for (var i = 0; i < this.options.selection.length; i++) {
                        oldSelection.push(this.options.selection[i])
                    }
                    if (this.options.selectionMode == 2) {
                        if (multi) {
                            if (this.options.isSelected(item.item)) {
                                this.options.selection.splice(i, 1)
                            }
                            else {
                                this.options.selection.push(item.item)
                            }
                        }
                        else {
                            this.options.selection = [item.item]
                        }
                    }
                    else if (this.options.selectionMode == 1) {
                        if (this.options.selection[0] == item.item && this.options.shouldAddDetailsOnSelection) {
                            this.options.shouldAddDetailsOnSelection = false
                        }
                        else {
                            this.options.shouldAddDetailsOnSelection = true
                        }
                        this.options.selection = [item.item]
                    }
                    else {
                        this.options.selection = new Array
                    }
                    if (this.options.openDetailsOnSelection) {
                        if (this.options.selection.length == 1) {
                            this.options.showDetailFor = new TGrid.ShowDetail;
                            this.options.showDetailFor.item = this.options.selection[0]
                        }
                    }
                    else {
                        this.options.showDetailFor = new TGrid.ShowDetail
                    }
                    for (var i = 0; i < oldSelection.length; i++) {
                        this.updateRow(oldSelection[i], this.options.shouldAddDetailsOnSelection)
                    }
                    for (var i = 0; i < this.options.selection.length; i++) {
                        this.updateRow(this.options.selection[i], this.options.shouldAddDetailsOnSelection)
                    }
                    this.scrollIntoView(item.item);
                    this.updateFooterViewModel();
                    return true
                };
                Grid.prototype.scrollIntoView = function(item) {
                    var viewModels = new Array;
                    var visibleItemsCount = this.htmlProvider.getVisibleItemsCount(this.tableBody, this.tableBodyContainer, this.tableBodyContainer.scrollTop, false);
                    var firstVisibleItem = this.htmlProvider.getFirstVisibleItem(this.tableBody, this.visibleViewModels, this.tableBodyContainer.scrollTop);
                    visibleItemsCount--;
                    var visibleItemsArea = false;
                    for (var i = 0; i < this.visibleViewModels.length; i++) {
                        if (i > 0 && firstVisibleItem == this.visibleViewModels[i - 1]) {
                            visibleItemsArea = true
                        }
                        if (visibleItemsArea) {
                            visibleItemsCount--
                        }
                        if (visibleItemsCount <= 0) {
                            visibleItemsArea = false
                        }
                        if (this.visibleViewModels[i].item == item) {
                            if (visibleItemsArea) {
                                return
                            }
                            break
                        }
                        viewModels.push(this.visibleViewModels[i])
                    }
                    var scrollTo = this.htmlProvider.getElementsSize(this.tableBody, viewModels);
                    this.tableBodyContainer.scrollTop = scrollTo
                };
                Grid.prototype.updateRow = function(item, shouldAddDetails) {
                    this.htmlProvider.updateTableDetailRow(this.options, this.tableBodyContainer.getElementsByTagName("tbody")[0], item, shouldAddDetails);
                    this.htmlProvider.updateMobileDetailRow(this.options, this.mobileContainer, item, shouldAddDetails)
                };
                Grid.prototype.buildViewModels = function(items) {
                    var itemModels = [];
                    var currentGroupNames = new Array;
                    var isGroupHeader = new Array;
                    for (var j = 0; j < this.options.groupBySortDescriptors.length; j++) {
                        currentGroupNames.push("");
                        isGroupHeader.push(false)
                    }
                    var collapsed = false;
                    var colapsedGroupLevel = this.options.groupBySortDescriptors.length;
                    for (var i = 0; i < items.length; i++) {
                        for (var j = 0; j < colapsedGroupLevel; j++) {
                            var columnValue = getMemberValue(items[i], this.options.groupBySortDescriptors[j].path);
                            if (currentGroupNames[j] !== columnValue) {
                                currentGroupNames[j] = columnValue;
                                collapsed = false;
                                colapsedGroupLevel = this.options.groupBySortDescriptors.length;
                                var filterDescriptor = new TGrid.FilterDescriptor("", "", 0, 0, 0);
                                for (var k = 0; k <= j; k++) {
                                    filterDescriptor.children.push(new TGrid.FilterDescriptor(this.options.groupBySortDescriptors[k].path, currentGroupNames[k], 1))
                                }
                                collapsed = this.isGroupCollapsedOrInsideCollapsed(filterDescriptor);
                                itemModels.push(new TGrid.ItemViewModel(this.options.parentViewModel, new TGrid.GroupHeaderDescriptor(currentGroupNames[j], j, collapsed, filterDescriptor), this, true));
                                for (var k = j + 1; k < this.options.groupBySortDescriptors.length; k++) {
                                    currentGroupNames[k] = ""
                                }
                                if (collapsed) {
                                    colapsedGroupLevel = j + 1;
                                    break
                                }
                            }
                        }
                        if (!collapsed) {
                            itemModels.push(new TGrid.ItemViewModel(this.options.parentViewModel, items[i], this, false))
                        }
                    }
                    return itemModels
                };
                Grid.prototype.isEqualOrDeeperThanCollapsedFilter = function(collapsedFilter, filter) {
                    if (filter.children.length >= collapsedFilter.children.length) {
                        for (var i = 0; i < collapsedFilter.children.length; i++) {
                            if (filter.children[i].path !== collapsedFilter.children[i].path || filter.children[i].value !== collapsedFilter.children[i].value) {
                                return false
                            }
                        }
                        return true
                    }
                    return false
                };
                Grid.prototype.isGroupCollapsedOrInsideCollapsed = function(filterDescriptor) {
                    for (var i = 0; i < this.collapsedGroupFilterDescriptors.length; i++) {
                        if (this.isEqualOrDeeperThanCollapsedFilter(this.collapsedGroupFilterDescriptors[i], filterDescriptor)) {
                            return true
                        }
                    }
                    return false
                };
                Grid.prototype.updateVisibleItems = function() {
                    var _this = this;
                    this.tableBody.innerHTML = "";
                    this.tableBody = this.htmlProvider.updateTableBodyElement(this.options, this.tableBody, this.visibleViewModels, function(x, m) {
                        return _this.selectItem(x, m)
                    });
                    this.htmlProvider.updateColumnWidth(this.options, this.tableHeader, this.tableBody, this.tableFooter);
                    this.mobileContainer.innerHTML = "";
                    this.htmlProvider.updateMobileItemsList(this.options, this.mobileContainer, this.visibleViewModels, function(x, m) {
                        return _this.selectItem(x, m)
                    })
                };
                Grid.prototype.getHtmlProvider = function(options) {
                    if (options.framework == 0) {
                        return new TGrid.KnockoutHtmlProvider
                    }
                    if (options.framework == 1) {
                        return new TGrid.AngularHtmlProvider
                    }
                };
                Grid.prototype.getFirstItemNumber = function() {
                    return this.options.pageSize * this.options.currentPage
                };
                Grid.prototype.getPageSize = function() {
                    return this.options.pageSize
                };
                Grid.prototype.refreshHeader = function() {
                    var _this = this;
                    if (!this.options.hideHeader) {
                        if (this.options.enableGrouping) {
                            unhideElement(this.groupByElement)
                        }
                        else {
                            hideElement(this.groupByElement)
                        }
                        this.htmlProvider.updateTableHeadElement(this.options, this.tableHeader, this.groupByElement, this.filterPopUp, function(c) {
                            return _this.columnsResized(c)
                        });
                        this.refreshMobileHeader()
                    }
                };
                Grid.prototype.updateBody = function() {
                    this.refreshBody()
                };
                Grid.prototype.refreshBody = function(withBuisy) {
                    var _this = this;
                    if (typeof withBuisy === "undefined") {
                        withBuisy = false
                    }
                    if (withBuisy) {
                        this.showBuisyIndicator()
                    }
                    if (!this.options.enablePaging) {
                        this.itemProvider.getTotalItemsCount(this.getEffectiveFiltering(), function(totalitemsCount) {
                            _this.totalItemsCount = totalitemsCount;
                            _this.itemProvider.getItems(_this.getFirstItemNumber(), _this.options.firstLoadSize, _this.getEffectiveSorting(), _this.getEffectiveFiltering(), _this.getCollapsedGroupFilter(), function(items, first, count) {
                                _this.firstVisibleItemIndex = first;
                                _this.visibleItems = items;
                                _this.visibleViewModels = _this.buildViewModels(_this.visibleItems);
                                _this.updateVisibleItems();
                                _this.updateFooterViewModel();
                                if (withBuisy) {
                                    _this.hideBuisyIndicator()
                                }
                                var elementsSize = _this.isDesktopMode() ? _this.htmlProvider.getElementsSize(_this.tableBody, null) : _this.htmlProvider.getElementsSize(_this.mobileContainer, null);
                                if (elementsSize > 0 && _this.options.firstLoadSize > 0 && isNotNoU(_this.options.firstLoadSize)) {
                                    if (_this.isDesktopMode() && elementsSize < (_this.tableBodyContainer.clientHeight + 100) && (_this.options.firstLoadSize < _this.totalItemsCount)) {
                                        _this.options.firstLoadSize *= 2;
                                        if (_this.options.firstLoadSize > _this.totalItemsCount) {
                                            _this.options.firstLoadSize = _this.totalItemsCount
                                        }
                                        _this.refreshBody()
                                    }
                                    else if (!_this.isDesktopMode() && _this.htmlProvider.getElementsSize(_this.mobileContainer, null) < (_this.mobileContainer.clientHeight + 100) && (_this.options.firstLoadSize < _this.totalItemsCount)) {
                                        _this.options.firstLoadSize *= 2;
                                        if (_this.options.firstLoadSize > _this.totalItemsCount) {
                                            _this.options.firstLoadSize = _this.totalItemsCount
                                        }
                                        _this.refreshBody()
                                    }
                                    else {
                                        _this.onReady()
                                    }
                                }
                                else {
                                    _this.onReady()
                                }
                            })
                        })
                    }
                    else {
                        this.itemProvider.getTotalItemsCount(this.getEffectiveFiltering(), function(totalitemsCount) {
                            _this.totalItemsCount = totalitemsCount;
                            _this.itemProvider.getItems(_this.getFirstItemNumber(), _this.getPageSize(), _this.getEffectiveSorting(), _this.getEffectiveFiltering(), _this.getCollapsedGroupFilter(), function(items, first, count) {
                                _this.firstVisibleItemIndex = first;
                                _this.visibleItems = items;
                                _this.visibleViewModels = _this.buildViewModels(_this.visibleItems);
                                _this.updateVisibleItems();
                                _this.updateFooterViewModel();
                                if (withBuisy) {
                                    _this.hideBuisyIndicator()
                                }
                                _this.onReady()
                            })
                        })
                    }
                };
                Grid.prototype.onReady = function() {
                    if (this.isFirstRefresh) {
                        if (isNotNoU(this.options.ready)) {
                            this.isFirstRefresh = false;
                            this.options.ready(this.options)
                        }
                        this.isFirstRefresh = false
                    }
                };
                Grid.prototype.refreshFooter = function() {
                    this.htmlProvider.updateTableFooterElement(this.options, this.tableFooter, this.totalItemsCount, this.footerViewModel)
                };
                Grid.prototype.updateFooterViewModel = function() {
                    if (this.footerViewModel != null) {
                        this.footerViewModel.setCurrentPage(this.options.currentPage + 1);
                        this.footerViewModel.setSelectedItem(this.options.selection[0]);
                        this.footerViewModel.setTotalCount(this.totalItemsCount);
                        if (this.options.enablePaging) {
                            this.footerViewModel.setTotalPages(Math.ceil(this.totalItemsCount / this.options.pageSize))
                        }
                        else {
                            this.footerViewModel.setTotalPages(1)
                        }
                    }
                };
                Grid.prototype.showBuisyIndicator = function() {
                    this.isBuisy = true;
                    this.buisyIndicator.removeAttribute("style")
                };
                Grid.prototype.hideBuisyIndicator = function() {
                    this.buisyIndicator.setAttribute("style", "display: none;");
                    this.isBuisy = false
                };
                Grid.prototype.setCollapsedFilters = function(filterDescriptor) {
                    this.collapsedGroupFilterDescriptors.push(filterDescriptor);
                    this.refreshBody()
                };
                Grid.prototype.removeCollapsedFilters = function(filterDescriptor) {
                    for (var i = 0; i < this.collapsedGroupFilterDescriptors.length; i++) {
                        if (this.isEqualOrDeeperThanCollapsedFilter(this.collapsedGroupFilterDescriptors[i], filterDescriptor)) {
                            this.collapsedGroupFilterDescriptors.splice(i, 1)
                        }
                    }
                    this.refreshBody()
                };
                Grid.prototype.applyFilters = function() {
                    this.refreshHeader();
                    this.refreshBody();
                    this.refreshFooter()
                };
                Grid.prototype.refreshMobileHeader = function() {
                    this.htmlProvider.updateMobileHeadElement(this.options, this.mobileHeader, this.filterPopUp)
                };
                Grid.prototype.afterOptionsChange = function() {
                    var _this = this;
                    if (this.options.captureScroll) {
                        this.rootElement.onmousewheel = function(e) {
                            return _this.mouseWheel(e)
                        }
                    }
                    else {
                        this.rootElement.onmousewheel = undefined
                    }
                    if (this.options.enableFiltering && isNoU(this.rootElement.getElementsByClassName("tgrid-filter-popup")[0])) {
                        if (this.filterPopUp != null) {
                            document.body.removeChild(this.filterPopUp)
                        }
                        this.filterPopUp = document.createElement("div");
                        this.filterPopUp.setAttribute("class", "tgrid-filter-popup");
                        this.filterPopUp.style.display = "none";
                        this.filterPopUp.grid = this;
                        document.body.appendChild(this.filterPopUp);
                        this.filterPopupViewModel = this.htmlProvider.getFilterPopupViewModel(this.filterPopUp);
                        this.htmlProvider.updateFilteringPopUp(this.options, this.filterPopUp, this.filterPopupViewModel)
                    }
                    if (this.options.enableVirtualScroll && isNoU(this.rootElement.getElementsByClassName("tgrid-scroll")[0])) {
                        this.scrollBar = document.createElement("div");
                        if (!this.options.hideHeader) {
                            this.scrollBar.className = "tgrid-scroll"
                        }
                        else {
                            this.scrollBar.className = "tgrid-scroll noheader"
                        }
                        var scrollContent = document.createElement("div");
                        scrollContent.style.height = "10000px";
                        scrollContent.style.width = "1px";
                        this.scrollBar.appendChild(scrollContent);
                        this.bodyAndHeaderContainer.appendChild(this.scrollBar);
                        this.scrollBar.onscroll = function() {
                            return _this.onManualScroll()
                        };
                        this.tableBodyContainer.onscroll = function() {
                            return _this.scrollTable()
                        };
                        this.mobileContainer.onscroll = function() {
                            return _this.scrollTable()
                        }
                    }
                    if (!this.options.enableVirtualScroll && isNotNoU(this.rootElement.getElementsByClassName("tgrid-scroll")[0])) {
                        this.rootElement.getElementsByClassName("tgrid-scroll")[0].parentNode.removeChild(this.rootElement.getElementsByClassName("tgrid-scroll")[0]);
                        this.tableBodyContainer.onscroll = null;
                        this.mobileContainer.onscroll = null;
                        this.itemProvider.getTotalItemsCount(this.options.filterDescriptor, function(total) {
                            _this.options.firstLoadSize = total
                        })
                    }
                    if (!this.options.enablePaging && !this.options.enableVirtualScroll && isNotNoU(this.rootElement.getElementsByClassName("tgrid-pagination")[0])) {
                        this.options.currentPage = 0
                    }
                    this.refreshHeader();
                    this.refreshBody(this.options.enableVirtualScroll);
                    this.refreshFooter()
                };
                Grid.prototype.setColumnsFromItemsProvider = function() {
                    var item = this.itemProvider.getFirstItem();
                    if (item != null) {
                        for (var name in item) {
                            var column = new TGrid.ColumnInfo;
                            column.member = name;
                            column.sortMemberPath = name;
                            column.groupMemberPath = name;
                            column.filterMemberPath = name;
                            this.options.columns.push(column)
                        }
                    }
                };
                return Grid
            })();
        TGrid.Grid = Grid
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid
})(TesserisPro || (TesserisPro = {}));
function isNull(target) {
    return target == null
}
function isNotNull(target) {
    return target != null
}
;
function isUndefined(target) {
    return typeof target == "undefined"
}
;
function isNotUndefined(target) {
    return typeof target != "undefined"
}
;
function isNoU(target) {
    return isUndefined(target) || isNull(target)
}
;
function isNotNoU(target) {
    return isNotUndefined(target) && isNotNull(target)
}
;
function isFunction(target) {
    var getType = {};
    return target && getType.toString.call(target) === '[object Function]'
}
function isObservable(target) {
    var getType = {};
    return target && getType.toString.call(target) === '[object Function]'
}
function insertAfter(refElem, addingElem) {
    var parent = refElem.parentNode;
    var next = refElem.nextSibling;
    if (next) {
        return parent.insertBefore(addingElem, next)
    }
    else {
        return parent.appendChild(addingElem)
    }
}
function insertBefore(refElem, addingElem) {
    var parent = refElem.parentNode;
    return parent.insertBefore(addingElem, refElem)
}
function getMemberValue(target, path) {
    if (path == null || path.length == 0) {
        return target
    }
    var pathNames = path.split('.');
    var value = target;
    while (pathNames.length > 0) {
        value = value[pathNames[0]];
        pathNames.splice(0, 1)
    }
    return value
}
function hideElement(target) {
    target.style.display = "none"
}
function unhideElement(target) {
    target.style.display = ""
}
function addClass(target, className) {
    var classBefore = target.getAttribute("class");
    var classAfter;
    if (classBefore != null && classBefore.length > 0) {
        if (classBefore.indexOf(className) == -1) {
            classAfter = classBefore.concat(" ").concat(className)
        }
        else {
            classAfter = classBefore
        }
    }
    else {
        classAfter = className
    }
    target.setAttribute("class", classAfter)
}
function removeClass(target, className) {
    var classBefore = target.getAttribute("class");
    if (classBefore != null && classBefore.length > 0) {
        var classesArray = classBefore.split(" ");
        var indexOfClass;
        for (var i = 0; i < classesArray.length; i++) {
            if (classesArray[i] == className) {
                classesArray.splice(i, 1);
                i--
            }
        }
        var classAfter = classesArray.join(" ");
        target.setAttribute("class", classAfter)
    }
}
function containsClass(target, className) {
    if (target != null) {
        var currentClasses = target.getAttribute("class");
        if (currentClasses != null && currentClasses.indexOf(className) != -1) {
            return true
        }
        else {
            return false
        }
    }
}