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

            BaseHtmlProvider.prototype.getElemntsSize = function (container, items) {
                return 0;
            };

            BaseHtmlProvider.prototype.getFirstVisibleItem = function (container, items, scrollTop) {
                return null;
            };

            BaseHtmlProvider.prototype.getFooterViewModel = function () {
            };

            BaseHtmlProvider.prototype.getFilterPopupViewModel = function (container) {
            };

            BaseHtmlProvider.prototype.updateTableHeadElement = function (option, header, groupByContainer, filterPopupContainer, isSortable, columnsResized) {
            };

            BaseHtmlProvider.prototype.updateTableBodyElement = function (option, container, items, selected) {
            };

            BaseHtmlProvider.prototype.updateTableFooterElement = function (option, footer, totalItemsCount, footerModel) {
            };

            BaseHtmlProvider.prototype.updateTableFooterElementDefault = function (option, footer, totalItemsCount) {
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

            BaseHtmlProvider.prototype.updateMobileHeadElement = function (option, header, isSortable) {
            };

            BaseHtmlProvider.prototype.updateMobileItemsList = function (option, container, items, selected) {
            };

            BaseHtmlProvider.prototype.updateGroupedTableBodyElement = function (option, container, items, selected) {
            };

            BaseHtmlProvider.prototype.updateColumnWidth = function (option, header, body, footer) {
                var headers = header.getElementsByTagName("th");

                var tableRows = body.getElementsByTagName("tr");
                var firstDataRow;

                for (var i = 0; i < tableRows.length; i++) {
                    if (tableRows.item(i).classList.contains("table-body-row")) {
                        firstDataRow = tableRows.item(i);
                        break;
                    }
                }

                var columns = firstDataRow.getElementsByTagName("td");

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

                    (headers.item(i + option.columns.length)).setAttribute("width", option.columns[columnNumber].width);
                    columnNumber++;
                }

                var columnNumber = 0;
                while (columnNumber < option.columns.length && option.columns[columnNumber].device.indexOf("desktop") == -1) {
                    columnNumber++;
                }
                for (var i = 0; i < columns.length - 1; i++) {
                    if ((columns.item(i)).classList.contains("tgrid-table-indent-cell")) {
                        continue;
                    }

                    while (columnNumber < option.columns.length && option.columns[columnNumber].device.indexOf("desktop") == -1) {
                        columnNumber++;
                    }

                    if (columnNumber >= option.columns.length) {
                        columnNumber = option.columns.length - 1;
                        break;
                    }

                    (columns.item(i)).setAttribute("width", option.columns[columnNumber].width);
                    columnNumber++;
                }
            };

            BaseHtmlProvider.prototype.hasDetails = function (selectedElement, option) {
                if (selectedElement != null && selectedElement.length == 1) {
                    if (option.showDetailFor.column == -1) {
                        if (option.detailsTemplateHtml != null) {
                            return true;
                        }
                    } else if (option.columns[option.showDetailFor.column].cellDetail != null) {
                        return true;
                    }
                }
                return false;
            };

            BaseHtmlProvider.prototype.updateTableDetailRow = function (option, container, item) {
            };

            BaseHtmlProvider.prototype.updateMobileDetailRow = function (option, container, item) {
            };

            BaseHtmlProvider.prototype.createDefaultHeader = function (container, headerName) {
                var defaultHeader = document.createElement("span");
                var defaultName = document.createTextNode(headerName);
                defaultHeader.appendChild(defaultName);
                container.appendChild(defaultHeader);
            };

            BaseHtmlProvider.prototype.addGroupBy = function (option, header, groupByContainer) {
                if (option.isEnableGrouping) {
                    TGrid.Grid.getGridObject(groupByContainer).showDivElement(groupByContainer);
                    this.addGroupByElements(option, groupByContainer);
                    this.showGroupByElements(option, groupByContainer, TGrid.Grid.getGridObject(header));

                    var listButtonContainerElement = document.createElement("div");
                    listButtonContainerElement.setAttribute("class", "list-button-container");
                    var listGroupByElement = document.createElement("ul");
                    listGroupByElement.setAttribute("class", "group-by-ul");
                    var groupByButtonElement = document.createElement("a");
                    groupByButtonElement.setAttribute("class", "button-group-by");

                    groupByButtonElement.onclick = function (e) {
                        TGrid.Grid.getGridObject(e.target).showHideListOnClick((e.target).nextElementSibling);
                    };
                    listButtonContainerElement.appendChild(groupByButtonElement);

                    var listGroupByToChooseFrom = this.addListGroupByItems(option, listGroupByElement);
                    this.showListGroupByItems(option, listGroupByToChooseFrom, TGrid.Grid.getGridObject(header));

                    listButtonContainerElement.appendChild(listGroupByElement);
                    groupByContainer.appendChild(listButtonContainerElement);
                } else {
                    TGrid.Grid.getGridObject(groupByContainer).hideElement(groupByContainer);
                }
            };

            BaseHtmlProvider.prototype.showNeededIntends = function (target, level, grid) {
                var visibleIntentsNumber = level;
                var cells = target.getElementsByClassName("tgrid-table-indent-cell");

                for (var i = 0; i < cells.length; i++) {
                    grid.hideElement(cells[i]);
                }

                if (cells.length < level) {
                    visibleIntentsNumber = cells.length;
                }

                for (var i = 0; i < visibleIntentsNumber; i++) {
                    grid.showTableCellElement(cells[i]);
                }
            };

            BaseHtmlProvider.prototype.addFiltringPopUp = function (option, filterPopup, filterPopupModel) {
            };

            BaseHtmlProvider.prototype.defaultFiltringPopUp = function (option, filterPopupContainer) {
                var filterCondition = document.createElement("select");

                // append filter conditions
                var selectOption = document.createElement("option");
                selectOption.value = TGrid.FilterCondition.None.toString();
                selectOption.text = "none";
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
                filterText.setAttribute("value", "c3");
                filterPopupContainer.appendChild(filterText);

                filterPopupContainer.innerHTML += "<br>";

                var applyButton = document.createElement("button");
                applyButton.innerText = "Apply";
                applyButton.onclick = function (e) {
                    TGrid.Grid.getGridObject(e.target).addFilter(option.filterPath, filterPopupContainer.getElementsByTagName("input")[0].value, filterPopupContainer.getElementsByTagName("select")[0].selectedIndex, filterPopupContainer);
                };
                filterPopupContainer.appendChild(applyButton);

                var clearButton = document.createElement("button");
                clearButton.innerText = "Clear";
                clearButton.onclick = function (e) {
                    TGrid.Grid.getGridObject(e.target).clearFilter(option.filterPath, filterPopupContainer);
                };
                filterPopupContainer.appendChild(clearButton);

                var exitButton = document.createElement("button");
                exitButton.innerText = "Close";
                exitButton.onclick = function (e) {
                    TGrid.Grid.getGridObject(e.target).hideElement(filterPopupContainer);
                };
                filterPopupContainer.appendChild(exitButton);
            };

            BaseHtmlProvider.prototype.addGroupByElements = function (option, groupByContainer) {
                for (var i = 0; i < option.columns.length; i++) {
                    if (option.columns[i].groupMemberPath != null) {
                        var groupByHeaderElement = document.createElement("div");
                        if (option.columns[i].header != null) {
                            option.columns[i].header.applyTemplate(groupByHeaderElement);
                        } else {
                            var headerText = option.columns[i].member != null ? option.columns[i].member : option.columns[i].groupMemberPath;
                            this.createDefaultHeader(groupByHeaderElement, headerText);
                        }

                        groupByHeaderElement.setAttribute("class", "condition-group-by");
                        groupByHeaderElement["data-group-by"] = option.columns[i].groupMemberPath;

                        //create deleteGroupByElement
                        var deleteGroupByElement = document.createElement("input");
                        deleteGroupByElement.setAttribute("type", "button");
                        deleteGroupByElement.setAttribute("class", "delete-condition-group-by");
                        deleteGroupByElement.setAttribute("value", "x");
                        deleteGroupByElement["data-delete-groupby"] = new TGrid.SortDescriptor(option.columns[i].groupMemberPath, true);

                        //adding function to delete GroupBy condition by clicking on close button
                        deleteGroupByElement.onclick = function (e) {
                            var groupByElement = e.target["data-delete-groupby"];
                            TGrid.Grid.getGridObject(e.target).deleteGroupBy(groupByElement.path, groupByElement.asc);
                        };

                        groupByHeaderElement.appendChild(deleteGroupByElement);
                        this.bindData(option, groupByHeaderElement);
                        groupByContainer.appendChild(groupByHeaderElement);
                    }
                }
            };

            BaseHtmlProvider.prototype.updateGroupByElements = function (option, header, groupByContainer) {
                if (option.isEnableGrouping) {
                    this.showGroupByElements(option, groupByContainer, TGrid.Grid.getGridObject(header));

                    var listButtonContainer = groupByContainer.getElementsByClassName("list-button-container");
                    (listButtonContainer[0]).appendChild(this.showListGroupByItems(option, ((listButtonContainer[0]).children[1]), TGrid.Grid.getGridObject(header)));
                } else {
                    TGrid.Grid.getGridObject(groupByContainer).hideElement(groupByContainer);
                }
            };

            BaseHtmlProvider.prototype.createDefaultMobileTemplate = function (rowTemplate, option) {
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
                        columnData.innerHTML = ": ";
                        mobileColumnContainer.appendChild(mobileColumnName);
                        mobileColumnContainer.appendChild(columnData);
                        rowTemplate.appendChild(mobileColumnContainer);
                    }
                }
                return rowTemplate;
            };

            BaseHtmlProvider.prototype.showGroupByElements = function (option, groupByContainer, grid) {
                var groupByElements = groupByContainer.getElementsByClassName("condition-group-by");

                for (var j = 0; j < groupByElements.length; j++) {
                    grid.hideElement(groupByElements[j]);
                }

                for (var i = option.groupBySortDescriptor.length - 1; i > -1; i--) {
                    for (var j = 0; j < groupByElements.length; j++) {
                        if (groupByElements[j]["data-group-by"] == option.groupBySortDescriptor[i].path) {
                            grid.showDivElement(groupByElements[j]);
                            groupByContainer.insertBefore(groupByElements[j], groupByContainer.firstChild);
                            continue;
                        }
                    }
                }
            };

            BaseHtmlProvider.prototype.addListGroupByItems = function (option, listGroupByElement) {
                for (var i = 0; i < option.columns.length; i++) {
                    if (option.columns[i].groupMemberPath != null) {
                        var listItemGroupByItems = document.createElement("li");

                        listItemGroupByItems.onclick = function (e) {
                            //get top ancestor, because event fires on the last nested element
                            var el = e.target;
                            while (el && el.nodeName !== 'LI') {
                                el = el.parentNode;
                            }
                            TGrid.Grid.getGridObject(e.target).addGroupBy((el["data-group-by-condition"]), true);
                            TGrid.Grid.getGridObject(e.target).hideElement(el.parentNode);
                        };
                        if (option.columns[i].header != null) {
                            option.columns[i].header.applyTemplate(listItemGroupByItems);
                        } else {
                            var headerText = option.columns[i].member != null ? option.columns[i].member : option.columns[i].groupMemberPath;
                            this.createDefaultHeader(listItemGroupByItems, headerText);
                        }
                        listItemGroupByItems["data-group-by-condition"] = option.columns[i].groupMemberPath;

                        listGroupByElement.appendChild(listItemGroupByItems);
                    }
                }
                this.bindData(option, listGroupByElement);
                return listGroupByElement;
            };

            BaseHtmlProvider.prototype.bindData = function (option, elementForBinding) {
            };

            BaseHtmlProvider.prototype.showListGroupByItems = function (option, listGroupByElement, grid) {
                var listGroupByItems = listGroupByElement.getElementsByTagName("li");

                for (var i = 0; i < listGroupByItems.length; i++) {
                    if (listGroupByItems[i].getAttribute("style") == "display:block;") {
                        grid.hideElement(listGroupByItems[i]);
                    }
                    var hasNotGroupBy = true;
                    for (var j = 0; j < option.groupBySortDescriptor.length; j++) {
                        if (option.groupBySortDescriptor[j].path == listGroupByItems[i]["data-group-by-condition"]) {
                            hasNotGroupBy = false;
                            continue;
                        }
                    }
                    if (hasNotGroupBy) {
                        grid.showDivElement(listGroupByItems[i]);
                    }
                }
                return listGroupByElement;
            };

            BaseHtmlProvider.prototype.buildGroupMobileHeaderRow = function (option, groupHeaderDescriptor) {
                var headerContainer = document.createElement("div");
                var headerDiv = document.createElement("div");

                headerContainer.classList.add("tgrid-mobile-group-header");
                for (var i = 0; i < groupHeaderDescriptor.level; i++) {
                    headerContainer.innerHTML += "<div class='tgrid-mobile-group-indent-div'></div>";
                }

                if (option.isEnableCollapsing) {
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

                //headerContainer.appendChild(headerDiv);
                return headerContainer;
            };
            BaseHtmlProvider.prototype.bindMobileGroupHeader = function (headerContainer, item, headerDiv) {
                headerContainer.appendChild(headerDiv);
            };
            BaseHtmlProvider.prototype.createDefaultGroupHeader = function (tableRowElement) {
            };
            return BaseHtmlProvider;
        })();
        TGrid.BaseHtmlProvider = BaseHtmlProvider;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=BaseHtmlProvider.js.map
