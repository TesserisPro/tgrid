var TesserisPro;
(function (TesserisPro) {
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

            BaseHtmlProvider.prototype.getElemntsSize = function (container, items) {
                return 0;
            };

            BaseHtmlProvider.prototype.getFirstVisibleItem = function (container, items, scrollTop) {
                return null;
            };

            BaseHtmlProvider.prototype.getVisibleitemsCount = function (container, view, items, scrollTop) {
                var size = 0;
                var visibleItemsCount = 0;
                var children = container.children;
                var visibleItemsSize = 0;
                for (var i = 0; i < children.length; i++) {
                    var child = children.item(i);
                    size += child.clientHeight;

                    if (size > scrollTop) {
                        visibleItemsCount++;
                        visibleItemsSize += child.clientHeight;
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
            };

            BaseHtmlProvider.prototype.updateTableFooterElement = function (option, footer, totalItemsCount, footerModel) {
            };

            BaseHtmlProvider.prototype.updateGroupedTableBodyElement = function (option, container, items, selected) {
            };

            BaseHtmlProvider.prototype.updateColumnWidth = function (option, header, body, footer) {
                var headers = header.getElementsByTagName("th");

                var tableRows = body.getElementsByTagName("tr");

                var columnNumber = 0;
                while (columnNumber < option.columns.length && option.columns[columnNumber].device.indexOf("desktop") == -1) {
                    columnNumber++;
                }

                for (var i = 0; i < headers.length - 1; i++) {
                    while (columnNumber < option.columns.length && option.columns[columnNumber].device.indexOf("desktop") == -1) {
                        columnNumber++;
                    }

                    if (columnNumber >= option.columns.length) {
                        columnNumber = option.columns.length - 1;
                        break;
                    }

                    (headers.item(i + option.columns.length)).style.width = option.columns[columnNumber].width.toString() + "px";
                    var headerContainer = (headers.item(i + option.columns.length)).getElementsByClassName("tgrid-header-cell-container").item(0);
                    (headerContainer).style.width = option.columns[columnNumber].width.toString() + "px";
                    columnNumber++;
                }

                var dataRow;

                for (var i = 0; i < tableRows.length; i++) {
                    if (tableRows.item(i).classList.contains("table-body-row")) {
                        dataRow = tableRows.item(i);
                        if (dataRow != undefined) {
                            var columns = dataRow.getElementsByTagName("td");
                            columnNumber = 0;
                            for (var j = 0; j < columns.length - 1; j++) {
                                if ((columns.item(j)).classList.contains("tgrid-table-indent-cell")) {
                                    continue;
                                }

                                while (columnNumber < option.columns.length && option.columns[columnNumber].device.indexOf("desktop") == -1) {
                                    columnNumber++;
                                }

                                if (columnNumber >= option.columns.length) {
                                    columnNumber = option.columns.length - 1;
                                    break;
                                }

                                (columns.item(j)).style.width = option.columns[columnNumber].width.toString() + "px";
                                var cellContainer = (columns.item(j)).firstChild;
                                (cellContainer).style.width = option.columns[columnNumber].width.toString() + "px";
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
                pagerElement.setAttribute("class", "tgird-pagination");

                if (firstVisiblePage > 0) {
                    pagerElement.innerHTML += "<span class='tgird-page-number' onclick='TesserisPro.TGrid.Grid.getGridObject(event.target).selectPage(" + (firstVisiblePage - 1).toString() + ")' >...</span>";
                }

                for (var i = firstVisiblePage; i <= lastVisiblePage; i++) {
                    if (option.currentPage == i) {
                        pagerElement.innerHTML += "<span class='tgird-page-current'>" + (i + 1) + "</span>";
                    } else {
                        pagerElement.innerHTML += "<span class='tgird-page-number' onclick='TesserisPro.TGrid.Grid.getGridObject(event.target).selectPage(" + i + ")' >" + (i + 1) + "</span>";
                    }
                }

                if (lastVisiblePage < (pageCount - 1)) {
                    pagerElement.innerHTML += "<span class='tgird-page-number' onclick='TesserisPro.TGrid.Grid.getGridObject(event.target).selectPage(" + lastVisiblePage.toString() + ")' >...</span>";
                }

                var pages = footer.getElementsByClassName("tgird-pagination");
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

            BaseHtmlProvider.prototype.updateTableDetailRow = function (option, container, item) {
            };

            BaseHtmlProvider.prototype.updateMobileDetailRow = function (option, container, item) {
            };

            BaseHtmlProvider.prototype.buildDefaultHeader = function (container, headerName) {
                var defaultHeader = document.createElement("span");
                var defaultName = document.createTextNode(headerName);
                defaultHeader.appendChild(defaultName);
                container.appendChild(defaultHeader);
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
                        unhideElement(groupByMenu);
                        self.doOnClickOutside(groupByMenu, function () {
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

                if (cells.length < level) {
                    visibleIndentsNumber = cells.length;
                }

                for (var i = 0; i < visibleIndentsNumber; i++) {
                    unhideElement(cells[i]);
                }
            };

            BaseHtmlProvider.prototype.updateFilteringPopUp = function (option, filterPopup, filterPopupModel) {
            };

            BaseHtmlProvider.prototype.buildDefaultFiltringPopUp = function (option, filterPopupContainer) {
                var filterCondition = document.createElement("select");

                // append filter conditions
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
                    var grid = TGrid.Grid.getGridObject(e.target);
                    grid.filterPopupViewModel.onApply();
                };
                (applyButton).innerHTML = "OK";
                filterPopupContainer.appendChild(applyButton);

                var clearButton = document.createElement("div");
                clearButton.className = 'tgrid-filter-popup-button';
                clearButton.style.width = '70px';
                clearButton.onclick = function (e) {
                    var grid = TGrid.Grid.getGridObject(e.target);
                    grid.filterPopupViewModel.onClose();
                    filterText.setAttribute("value", "");
                };
                (clearButton).innerHTML = 'Cancel';
                filterPopupContainer.appendChild(clearButton);
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
                                    TGrid.Grid.getGridObject(e.target).removeCollapsedFiltersOnGroupByCancel(e.target["data-delete-group-by-number"]);
                                    TGrid.Grid.getGridObject(e.target).removeGroupDescriptor((e.target["data-delete-group-by"]).path);
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
                    if (option.columns[i].device.indexOf("desktop") != -1) {
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

                headerContainer.classList.add("tgrid-mobile-group-header");
                for (var i = 0; i < groupHeaderDescriptor.level; i++) {
                    headerContainer.innerHTML += "<div class='tgrid-mobile-group-indent-div'></div>";
                }

                if (option.enableCollapsing) {
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

                headerDiv.classList.add('tgrid-mobile-group-header-container');
                this.bindMobileGroupHeader(headerContainer, groupHeaderDescriptor.value, headerDiv);

                return headerContainer;
            };

            BaseHtmlProvider.prototype.bindMobileGroupHeader = function (headerContainer, item, headerDiv) {
                headerContainer.appendChild(headerDiv);
            };

            BaseHtmlProvider.prototype.createDefaultGroupHeader = function (tableRowElement) {
            };

            BaseHtmlProvider.prototype.addFilterButton = function (option, header, filterPopupContainer, headerButtons, culumnNumber) {
                if (option.enableFiltering) {
                    var filter = document.createElement("div");
                    filter.classList.add("tgrid-filter-button");
                    var self = this;
                    (function (columnNumber) {
                        filter.onclick = function (e) {
                            TGrid.Grid.getGridObject(e.target).showFilterPopup(option.columns[columnNumber], e.pageX, e.pageY, true);
                            self.doOnClickOutside(filterPopupContainer, function () {
                                return TGrid.Grid.getGridObject(e.target).hideFilterPopup();
                            });
                            e.cancelBubble = true;
                        };
                    })(culumnNumber);

                    headerButtons.appendChild(filter);
                }
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
                    var menu = document.createElement("ul");
                    menu.className = "tgrid-mobile-menu";
                    _this.addMobileMenuItems(option, menu, filterPopUp);

                    button.innerHTML = "";
                    button.appendChild(menu);
                    self.doOnClickOutside(menu, function () {
                        hideElement(menu);
                    });
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

                            buttonsContainer.appendChild(sortButton);
                            sortButton["data-g-path"] = column.sortMemberPath;
                            sortButton.onclick = function (e) {
                                e.cancelBubble = true;
                                hideElement(menu);
                                TGrid.Grid.getGridObject(e.target).sortBy(e.target["data-g-path"]);
                            };
                        }
                        if (option.enableFiltering && column.filterMemberPath != null) {
                            var filterButton = document.createElement("div");
                            var isFiltered = false;

                            for (var j = 0; j < option.filterDescriptors.length; j++) {
                                if (option.filterDescriptors[j].path == column.filterMemberPath) {
                                    filterButton.className = "tgrid-mobile-filter-button-active";
                                    isFiltered = true;
                                    break;
                                }
                            }

                            if (!isFiltered) {
                                filterButton.className = "tgrid-mobile-filter-button";
                            }

                            buttonsContainer.appendChild(filterButton);
                            filterButton["data-g-column"] = column;
                            var self = this;
                            filterButton.onclick = function (e) {
                                e.cancelBubble = true;
                                hideElement(menu);
                                self.doOnClickOutside(filterPopUp, function () {
                                    hideElement(filterPopUp);
                                });
                                TGrid.Grid.getGridObject(e.target).showFilterPopup(e.target["data-g-column"], e.pageX, e.pageY, false);
                            };
                        }
                        if (option.enableGrouping && column.groupMemberPath != null) {
                            var groupButton = document.createElement("div");
                            var isGrouped = false;

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

                            buttonsContainer.appendChild(groupButton);
                            groupButton["data-g-path"] = column.groupMemberPath;
                            groupButton.onclick = function (e) {
                                e.cancelBubble = true;
                                hideElement(menu);
                                var grid = TGrid.Grid.getGridObject(e.target);
                                grid.toggleGroupDescriptor(e.target["data-g-path"]);
                            };
                        }
                        menuItem.appendChild(columnContainer);
                        menuItem.appendChild(buttonsContainer);
                        menu.appendChild(menuItem);
                    }
                }
            };

            BaseHtmlProvider.prototype.doOnClickOutside = function (target, action) {
                var oldOnClick = document.onclick;
                document.onclick = function (e) {
                    var currentElement = e.target;
                    while (currentElement.tagName != 'BODY') {
                        if (currentElement == target) {
                            return;
                        }

                        currentElement = currentElement.parentElement;
                    }
                    document.onclick = oldOnClick;
                    action();
                };
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
                if (options.sortDescriptor.path != null || (options.groupBySortDescriptors.length > 0 && options.groupBySortDescriptors[0].path != null) || options.filterDescriptors.length > 0) {
                    return true;
                } else {
                    return false;
                }
            };
            return BaseHtmlProvider;
        })();
        TGrid.BaseHtmlProvider = BaseHtmlProvider;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=BaseHtmlProvider.js.map
