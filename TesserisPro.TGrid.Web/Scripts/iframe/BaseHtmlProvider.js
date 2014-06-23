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
    //
    /// <reference path="IHtmlProvider.ts" />
    /// <reference path="ItemViewModel.ts" />
    /// <reference path="IFooterViewModel.ts"/>
    /// <reference path="IFilterPopupViewModel.ts" />
    (function (TGrid) {
        var BaseHtmlProvider = (function () {
            function BaseHtmlProvider() {
            }
            BaseHtmlProvider.prototype.getTableElement = function (option) {
                var table = document.createElement("table");
                table.className = "tgrid-table";
                return table;
            };

            BaseHtmlProvider.prototype.bindData = function (option, elementForBinding) {
            };

            BaseHtmlProvider.prototype.getElementsSize = function (container, items) {
                return 0;
            };

            BaseHtmlProvider.prototype.getFirstVisibleItem = function (container, items, scrollTop) {
                return null;
            };

            BaseHtmlProvider.prototype.getVisibleItemsCount = function (container, view, scrollTop, skipGroupHeaders) {
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
                                visibleItemsCount++;
                            }
                            visibleItemsSize += child.offsetHeight;
                        }
                    }

                    if (visibleItemsSize >= view.clientHeight) {
                        break;
                    }
                }

                return visibleItemsCount;
            };

            BaseHtmlProvider.prototype.getFooterViewModel = function (grid) {
            };

            BaseHtmlProvider.prototype.getFilterPopupViewModel = function (container) {
            };

            BaseHtmlProvider.prototype.updateTableHeadElement = function (option, header, groupByContainer, filterPopupContainer, columnsResized) {
            };

            BaseHtmlProvider.prototype.updateTableBodyElement = function (option, container, items, selected) {
                return container;
            };

            BaseHtmlProvider.prototype.updateTableFooterElement = function (option, footer, totalItemsCount, footerModel) {
            };

            BaseHtmlProvider.prototype.updateGroupedTableBodyElement = function (option, container, items, selected) {
            };

            BaseHtmlProvider.prototype.updateColumnWidth = function (option, header, body, footer) {
                if (!option.hideHeader) {
                    var headers = header.getElementsByTagName("th");

                    var hasNotSizedColumn = false;
                    for (var i = 0; i < option.columns.length; i++) {
                        if (option.columns[i].notSized && !option.enablePaging) {
                            hasNotSizedColumn = true;
                        }
                    }
                    var columnsCount = hasNotSizedColumn ? headers.length - 1 : headers.length;
                    var columnNumber = 0;
                    while (columnNumber < option.columns.length && option.columns[columnNumber].device.indexOf("desktop") == -1) {
                        columnNumber++;
                    }

                    for (var i = 0; i < columnsCount; i++) {
                        while (columnNumber < option.columns.length && option.columns[columnNumber].device.indexOf("desktop") == -1) {
                            columnNumber++;
                        }

                        if (columnNumber >= option.columns.length) {
                            columnNumber = option.columns.length - 1;
                            break;
                        }

                        if (!option.columns[columnNumber].notSized) {
                            var indexOfPercentSymbol = option.columns[columnNumber].width.indexOf("%");
                            if (indexOfPercentSymbol != -1) {
                                var intWidth = parseInt(option.columns[columnNumber].width.substring(0, indexOfPercentSymbol));
                                var percentWidth = intWidth > 0 ? intWidth : 1;
                                option.columns[columnNumber].width = (body.offsetWidth * percentWidth / 100).toString();
                            }
                            headers.item(i + option.columns.length).style.width = option.columns[columnNumber].width.toString() + "px";
                            var headerContainer = headers.item(i + option.columns.length).getElementsByClassName("tgrid-header-cell-container").item(0);
                            headerContainer.style.width = option.columns[columnNumber].width.toString() + "px";
                        }
                        columnNumber++;
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
                                    columnNumber++;
                                }

                                if (columnNumber >= option.columns.length) {
                                    columnNumber = option.columns.length - 1;
                                    break;
                                }

                                if (!option.columns[columnNumber].notSized) {
                                    var indexOfPercentSymbol = option.columns[columnNumber].width.indexOf("%");
                                    if (indexOfPercentSymbol != -1) {
                                        var intWidth = parseInt(option.columns[columnNumber].width.substring(0, indexOfPercentSymbol));
                                        var percentWidth = intWidth > 0 ? intWidth : 1;
                                        option.columns[columnNumber].width = (body.offsetWidth * percentWidth / 100).toString();
                                    }
                                    columns.item(j).style.width = option.columns[columnNumber].width.toString() + "px";
                                    var cellContainer = columns.item(j).firstChild;
                                    cellContainer.style.width = option.columns[columnNumber].width.toString() + "px";
                                }
                                columnNumber++;
                            }
                        }
                    }
                }
            };

            BaseHtmlProvider.prototype.buildDefaultTableFooterElement = function (option, footer, totalItemsCount) {
                var firstVisiblePage = option.currentPage - option.pageSlide;

                if (firstVisiblePage < 0) {
                    firstVisiblePage = 0;
                }

                var lastVisiblePage = option.currentPage + option.pageSlide;
                var pageCount = Math.ceil(totalItemsCount / option.pageSize);

                if (lastVisiblePage >= pageCount) {
                    lastVisiblePage = pageCount - 1;
                }

                var pagerElement = document.createElement("div");
                pagerElement.setAttribute("class", "tgrid-pagination");

                if (firstVisiblePage > 0) {
                    pagerElement.innerHTML += "<span class='tgrid-page-number' onclick='TesserisPro.TGrid.Grid.getGridObject(event.target).selectPage(" + (firstVisiblePage - 1).toString() + ")' >...</span>";
                }

                for (var i = firstVisiblePage; i <= lastVisiblePage; i++) {
                    if (option.currentPage == i) {
                        pagerElement.innerHTML += "<span class='tgrid-page-current'>" + (i + 1) + "</span>";
                    } else {
                        pagerElement.innerHTML += "<span class='tgrid-page-number' onclick='TesserisPro.TGrid.Grid.getGridObject(event.target).selectPage(" + i + ")' >" + (i + 1) + "</span>";
                    }
                }

                if (lastVisiblePage < (pageCount - 1)) {
                    pagerElement.innerHTML += "<span class='tgrid-page-number' onclick='TesserisPro.TGrid.Grid.getGridObject(event.target).selectPage(" + lastVisiblePage.toString() + ")' >...</span>";
                }

                var pages = footer.getElementsByClassName("tgrid-pagination");
                for (var i = 0; i < pages.length; i++) {
                    footer.removeChild(pages[i]);
                }
                footer.appendChild(pagerElement);
            };

            BaseHtmlProvider.prototype.getActualDetailsTemplate = function (option) {
                if (option.showDetailFor.item == null) {
                    return null;
                }

                if (option.showDetailFor.column == -1) {
                    return option.detailsTemplateHtml;
                }

                return option.columns[option.showDetailFor.column].cellDetail;
            };

            BaseHtmlProvider.prototype.updateTableDetailRow = function (option, container, item, shouldAddDetails) {
            };

            BaseHtmlProvider.prototype.updateMobileDetailRow = function (option, container, item, shouldAddDetails) {
            };

            BaseHtmlProvider.prototype.buildDefaultHeader = function (container, headerName) {
                var defaultHeader = document.createElement("span");
                var defaultName = document.createTextNode(headerName);
                defaultHeader.appendChild(defaultName);
                container.appendChild(defaultHeader);
            };

            BaseHtmlProvider.prototype.onCloseFilterPopup = function (container) {
                document.onclick = BaseHtmlProvider.oldOnClick;
            };

            BaseHtmlProvider.prototype.updateGroupByPanel = function (option, groupByPanel) {
                groupByPanel.innerHTML = "";
                if (option.enableGrouping) {
                    this.addActualGroupByElements(option, groupByPanel);

                    var groupButton = document.createElement("div");
                    groupButton.setAttribute("class", "tgrid-goup-button");

                    var groupByMenu = document.createElement("ul");
                    groupByMenu.setAttribute("class", "tgrid-menu");
                    hideElement(groupByMenu);

                    var self = this;
                    groupButton.onclick = function (e) {
                        e.cancelBubble = true;
                        self.updateGroupByMenuContent(option, groupByMenu);
                        if (groupByMenu.style.display == "none") {
                            unhideElement(groupByMenu);
                        } else {
                            hideElement(groupByMenu);
                        }
                        self.doOnClickOutside([groupByMenu, groupButton], function () {
                            return hideElement(groupByMenu);
                        });
                    };

                    groupButton.appendChild(groupByMenu);
                    groupByPanel.appendChild(groupButton);
                }
            };

            BaseHtmlProvider.prototype.showNeededIndents = function (target, level, grid) {
                var visibleIndentsNumber = level;
                var cells = target.getElementsByClassName("tgrid-table-indent-cell");

                for (var i = 0; i < cells.length; i++) {
                    hideElement(cells[i]);
                }

                //check that number of existing indent-cells is not more than number of needed indent-cells
                if (cells.length < level) {
                    visibleIndentsNumber = cells.length;
                }

                for (var i = 0; i < visibleIndentsNumber; i++) {
                    unhideElement(cells[i]);
                }
            };

            BaseHtmlProvider.prototype.updateFilteringPopUp = function (option, filterPopup, filterPopupModel) {
            };

            BaseHtmlProvider.prototype.addActualGroupByElements = function (option, groupByContainer) {
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

                                //create deleteGroupByElement
                                var buttonsContainer = document.createElement("div");
                                buttonsContainer.className = "tgrid-header-cell-buttons";

                                var deleteGroupButton = document.createElement("div");
                                deleteGroupButton.className = "tgrid-delete-button";
                                deleteGroupButton["data-delete-group-by"] = option.groupBySortDescriptors[i];
                                deleteGroupButton["data-delete-group-by-number"] = i;
                                deleteGroupButton.onclick = function (e) {
                                    e.cancelBubble = true;
                                    TGrid.Grid.getGridObject(e.target).removeGroupDescriptor(e.target["data-delete-group-by"].path);
                                };

                                buttonsContainer.appendChild(deleteGroupButton);

                                groupByHeaderElement.appendChild(buttonsContainer);

                                groupByContainer.appendChild(groupByHeaderElement);
                            }
                        }
                    }
                }
            };

            BaseHtmlProvider.prototype.updateGroupByMenuContent = function (option, menu) {
                menu.innerHTML = "";
                for (var i = 0; i < option.columns.length; i++) {
                    if (option.columns[i].device.indexOf("desktop") != -1 && option.columns[i].enableGrouping) {
                        if (option.columns[i].groupMemberPath != null) {
                            var alreadyGrouped = false;
                            for (var j = 0; j < option.groupBySortDescriptors.length; j++) {
                                if (option.groupBySortDescriptors[j].path == option.columns[i].groupMemberPath) {
                                    alreadyGrouped = true;
                                }
                            }

                            if (!alreadyGrouped) {
                                var groupMenuItem = document.createElement("li");
                                groupMenuItem["data-group-by-path"] = option.columns[i].groupMemberPath;
                                var columnHeader = this.buildColumnHeader(option.columns[i]);
                                this.bindData(option, columnHeader);
                                groupMenuItem.appendChild(columnHeader);
                                groupMenuItem.onclick = function (e) {
                                    hideElement(menu);
                                    TGrid.Grid.getGridObject(e.target).addGroupDescriptor(e.currentTarget["data-group-by-path"], true);
                                };

                                menu.appendChild(groupMenuItem);
                            }
                        }
                    }
                }
            };

            BaseHtmlProvider.prototype.buildGroupMobileHeaderRow = function (option, groupHeaderDescriptor) {
                var headerContainer = document.createElement("div");
                var headerDiv = document.createElement("div");

                addClass(headerContainer, "tgrid-mobile-group-header");
                for (var i = 0; i < groupHeaderDescriptor.level; i++) {
                    headerContainer.innerHTML += "<div class='tgrid-mobile-group-indent-div'></div>";
                }

                if (option.enableCollapsing) {
                    addClass(headerContainer, "collapsing");
                    if (!groupHeaderDescriptor.collapse) {
                        headerContainer.onclick = function (e) {
                            TesserisPro.TGrid.Grid.getGridObject(e.target).setCollapsedFilters(groupHeaderDescriptor.filterDescriptor);
                        };
                    } else {
                        headerContainer.onclick = function (e) {
                            TesserisPro.TGrid.Grid.getGridObject(e.target).removeCollapsedFilters(groupHeaderDescriptor.filterDescriptor);
                        };
                    }
                }

                if (option.groupHeaderTemplate != null) {
                    option.groupHeaderTemplate.applyTemplate(headerDiv);
                } else {
                    this.createDefaultGroupHeader(headerDiv);
                }

                addClass(headerDiv, 'tgrid-mobile-group-header-container');
                this.bindMobileGroupHeader(headerContainer, groupHeaderDescriptor.value, headerDiv);

                return headerContainer;
            };

            BaseHtmlProvider.prototype.bindMobileGroupHeader = function (headerContainer, item, headerDiv) {
                headerContainer.appendChild(headerDiv);
            };

            BaseHtmlProvider.prototype.createDefaultGroupHeader = function (tableRowElement) {
            };

            BaseHtmlProvider.prototype.addFilterButton = function (option, header, filterPopupContainer, headerButtons, culumnNumber) {
                var filter = document.createElement("div");
                var isActiveFilter = false;
                for (var j = 0; j < option.filterDescriptor.children.length; j++) {
                    if (option.filterDescriptor.children[j].path == option.columns[culumnNumber].filterMemberPath) {
                        isActiveFilter = true;
                    }
                }
                if (isActiveFilter) {
                    addClass(filter, "tgrid-filter-button-active");
                } else {
                    addClass(filter, "tgrid-filter-button");
                }
                var self = this;
                (function (columnNumber) {
                    filter.onclick = function (e) {
                        var eventTarget = e.target;
                        var grid = TGrid.Grid.getGridObject(eventTarget);
                        var popupTop = (header.getBoundingClientRect().top + header.getBoundingClientRect().height) + document.body.scrollTop;
                        var poupLeft = eventTarget.getBoundingClientRect().left + document.body.scrollLeft;

                        if (filterPopupContainer.style.display == "none" || option.filterPopupForColumn != option.columns[columnNumber]) {
                            //if ( option.filterPopupForColumn != option.columns[columnNumber]) {
                            grid.showFilterPopup(option.columns[columnNumber], poupLeft, popupTop, true);
                            if ((poupLeft + filterPopupContainer.offsetWidth) > (grid.GetRootElement().getBoundingClientRect().left + grid.GetRootElement().getBoundingClientRect().width)) {
                                grid.showFilterPopup(option.columns[columnNumber], poupLeft - filterPopupContainer.offsetWidth + eventTarget.offsetWidth, popupTop, true);
                            }
                        } else {
                            grid.hideFilterPopup();
                        }
                        self.doOnClickOutside([filterPopupContainer, filter], function () {
                            var grid = TGrid.Grid.getGridObject(eventTarget);
                            if (grid != null) {
                                grid.hideFilterPopup();
                                self.onCloseFilterPopup(filterPopupContainer);
                            }
                        });
                        e.cancelBubble = true;
                    };
                })(culumnNumber);

                headerButtons.appendChild(filter);
            };

            BaseHtmlProvider.prototype.updateMobileHeadElement = function (option, mobileHeader, filterPopupContainer) {
                mobileHeader.innerHTML = "";
                if (option.enableSorting || option.enableGrouping || option.enableFiltering) {
                    this.createMobileButton(option, mobileHeader, filterPopupContainer);
                }
            };

            BaseHtmlProvider.prototype.updateMobileItemsList = function (option, container, items, selected) {
            };

            BaseHtmlProvider.prototype.createMobileButton = function (option, mobileHeader, filterPopUp) {
                var _this = this;
                var button = document.createElement("div");
                if (this.anyConditionIsApplied(option)) {
                    button.className = "tgrid-mobile-button-active";
                } else {
                    button.className = "tgrid-mobile-button";
                }

                var self = this;
                button.onclick = function (e) {
                    if (BaseHtmlProvider.mobileMenuHidden) {
                        var menu = document.createElement("ul");
                        menu.className = "tgrid-mobile-menu";
                        _this.addMobileMenuItems(option, menu, filterPopUp);

                        button.innerHTML = "";
                        button.appendChild(menu);
                        self.doOnClickOutside([menu], function () {
                            hideElement(menu);
                            BaseHtmlProvider.mobileMenuHidden = true;
                        });
                        BaseHtmlProvider.mobileMenuHidden = false;
                    } else {
                        var mobileMenu = e.target.getElementsByClassName("tgrid-mobile-menu")[0];
                        hideElement(mobileMenu);
                        BaseHtmlProvider.mobileMenuHidden = true;
                    }

                    e.cancelBubble = true;
                };

                mobileHeader.appendChild(button);
            };

            BaseHtmlProvider.prototype.addMobileMenuItems = function (option, menu, filterPopUp) {
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
                                addClass(sortButton, "tgrid-mobile-sort-button-inactive");
                            } else {
                                if (column.sortMemberPath == option.sortDescriptor.path) {
                                    if (option.sortDescriptor.asc == null) {
                                        sortButton.className = "tgrid-sort-button";
                                    } else if (option.sortDescriptor.asc) {
                                        sortButton.className = "tgrid-sort-button-asc";
                                    } else {
                                        sortButton.className = "tgrid-sort-button-desc";
                                    }
                                } else {
                                    sortButton.className = "tgrid-sort-button";
                                }

                                sortButton.onclick = function (e) {
                                    e.cancelBubble = true;
                                    hideElement(menu);
                                    BaseHtmlProvider.mobileMenuHidden = true;
                                    TGrid.Grid.getGridObject(e.target).sortBy(e.target["data-g-path"]);
                                };
                            }

                            buttonsContainer.appendChild(sortButton);
                            sortButton["data-g-path"] = column.sortMemberPath;
                        }
                        if (option.enableFiltering && column.filterMemberPath != null) {
                            var filterButton = document.createElement("div");
                            var isFiltered = false;
                            if (!option.columns[i].enableFiltering) {
                                addClass(filterButton, "tgrid-mobile-filter-button-inactive");
                            } else {
                                for (var j = 0; j < option.filterDescriptor.children.length; j++) {
                                    if (option.filterDescriptor.children[j].path == column.filterMemberPath) {
                                        filterButton.className = "tgrid-mobile-filter-button-active";
                                        isFiltered = true;
                                        break;
                                    }
                                }

                                if (!isFiltered) {
                                    filterButton.className = "tgrid-mobile-filter-button";
                                }
                                var self = this;
                                filterButton.onclick = function (e) {
                                    e.cancelBubble = true;
                                    hideElement(menu);
                                    BaseHtmlProvider.mobileMenuHidden = true;
                                    self.doOnClickOutside([filterPopUp], function () {
                                        hideElement(filterPopUp);
                                    });

                                    TGrid.Grid.getGridObject(e.target).showFilterPopup(e.target["data-g-column"], e.pageX, e.pageY, false);
                                };
                            }
                            buttonsContainer.appendChild(filterButton);
                            filterButton["data-g-column"] = column;
                        }
                        if (option.enableGrouping && column.groupMemberPath != null) {
                            var groupButton = document.createElement("div");
                            var isGrouped = false;
                            if (!option.columns[i].enableGrouping) {
                                addClass(groupButton, "tgrid-mobile-group-button-inactive");
                            } else {
                                for (var j = 0; j < option.groupBySortDescriptors.length; j++) {
                                    if (option.groupBySortDescriptors[j].path == column.groupMemberPath) {
                                        groupButton.className = "tgrid-group-button-active";
                                        isGrouped = true;
                                        break;
                                    }
                                }
                                if (!isGrouped) {
                                    groupButton.className = "tgrid-group-button";
                                }
                                groupButton.onclick = function (e) {
                                    e.cancelBubble = true;
                                    hideElement(menu);
                                    BaseHtmlProvider.mobileMenuHidden = true;
                                    var grid = TGrid.Grid.getGridObject(e.target);
                                    grid.toggleGroupDescriptor(e.target["data-g-path"]);
                                };
                            }
                            buttonsContainer.appendChild(groupButton);
                            groupButton["data-g-path"] = column.groupMemberPath;
                        }
                        menuItem.appendChild(columnContainer);
                        menuItem.appendChild(buttonsContainer);
                        menu.appendChild(menuItem);
                    }
                }
            };

            BaseHtmlProvider.prototype.doOnClickOutside = function (targets, action) {
                var eventListener = function (e) {
                    var currentElement = e.target;

                    while (currentElement != null && currentElement.tagName != 'BODY') {
                        for (var i = 0; i < targets.length; i++) {
                            if (currentElement == targets[i]) {
                                return;
                            }
                        }
                        currentElement = currentElement.parentElement;
                    }
                    if (BaseHtmlProvider.countOldOnClickCalls < 1) {
                        BaseHtmlProvider.countOldOnClickCalls++;
                        if (isNotNull(BaseHtmlProvider.oldOnClick)) {
                            BaseHtmlProvider.oldOnClick(e);
                        }
                    } else {
                        BaseHtmlProvider.countOldOnClickCalls = 0;
                    }
                    action();
                    document.onclick = BaseHtmlProvider.oldOnClick;
                };
                this.hideMenuOrFilter(targets);
                BaseHtmlProvider.oldOnClick = document.onclick;
                document.onclick = eventListener;
            };

            BaseHtmlProvider.prototype.appendIndent = function (target, level, isHeader) {
                var tag = isHeader ? "th" : "td";
                for (var i = 0; i < level; i++) {
                    var cell = document.createElement(tag);
                    cell.className = "tgrid-table-indent-cell";
                    var indentContent = document.createElement("div");
                    indentContent.className = "tgrid-table-indent-cell-content";
                    cell.appendChild(indentContent);
                    target.appendChild(cell);
                }
            };

            BaseHtmlProvider.prototype.buildColumnHeader = function (column) {
                var headerElement = document.createElement("div");
                headerElement.className = "tgrid-header-cell-content";
                if (column.header != null) {
                    column.header.applyTemplate(headerElement);
                } else {
                    var headerText = column.member != null ? column.member : '';
                    this.buildDefaultHeader(headerElement, headerText);
                }

                return headerElement;
            };

            BaseHtmlProvider.prototype.buildMobileMenuColumnHeader = function (column) {
                var headerElement = document.createElement("div");
                headerElement.className = "tgrid-mobile-menu-li-column-header";
                if (column.header != null) {
                    column.header.applyTemplate(headerElement);
                } else {
                    var headerText = column.member != null ? column.member : '';
                    this.buildDefaultHeader(headerElement, headerText);
                }

                return headerElement;
            };

            BaseHtmlProvider.prototype.anyConditionIsApplied = function (options) {
                if (options.sortDescriptor.path != null || (options.groupBySortDescriptors.length > 0 && options.groupBySortDescriptors[0].path != null) || options.filterDescriptor.children.length > 0 || options.filterDescriptor.condition != 0 /* None */) {
                    return true;
                } else {
                    return false;
                }
            };

            BaseHtmlProvider.prototype.detachDocumentClickEvent = function () {
                document.onclick = BaseHtmlProvider.oldOnClick;
            };

            BaseHtmlProvider.prototype.hideMenuOrFilter = function (targets) {
                for (var i = 0; i < targets.length; i++) {
                    if ((targets[i].className.indexOf("tgrid-mobile-menu") != -1 || targets[i].className.indexOf("tgrid-menu") != -1) && document.getElementsByClassName("tgrid-filter-popup").length != 0) {
                        var filterPopUp = document.getElementsByClassName("tgrid-filter-popup")[0];
                        TGrid.Grid.getGridObject(filterPopUp).hideFilterPopup();
                    }
                    if (targets[i].className.indexOf("tgrid-filter-popup") != -1 && document.getElementsByClassName("tgrid-menu").length != 0) {
                        hideElement(document.getElementsByClassName("tgrid-menu")[0]);
                    }
                }
            };
            BaseHtmlProvider.oldOnClick = document.onclick;
            BaseHtmlProvider.countOldOnClickCalls = 0;
            BaseHtmlProvider.mobileMenuHidden = true;
            return BaseHtmlProvider;
        })();
        TGrid.BaseHtmlProvider = BaseHtmlProvider;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
