var TesserisPro;
(function (TesserisPro) {
    /// <reference path="IHtmlProvider.ts" />
    /// <reference path="ItemViewModel.ts" />
    /// <reference path="FooterViewModel.ts"/>
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

            BaseHtmlProvider.prototype.updateTableHeadElement = function (option, header, groupByContainer, filterPopupContainer, isSortable) {
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
                footer.innerHTML = "";
                footer.appendChild(pagerElement);
            };

            BaseHtmlProvider.prototype.updateMobileHeadElement = function (option, header, isSortable) {
            };

            BaseHtmlProvider.prototype.updateMobileItemsList = function (option, container, items, selected) {
            };

            BaseHtmlProvider.prototype.updateGroupedTableBodyElement = function (option, container, items, selected) {
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

            BaseHtmlProvider.prototype.addFiltringPopUp = function (option, filterPopupContainer) {
                var filterCondition = document.createElement("select");

                // append filter conditions
                var selectOption = document.createElement("option");
                selectOption.value = TGrid.FilterCondition.None.toString();
                selectOption.text = "none";
                filterCondition.appendChild(selectOption);

                var selectOption = document.createElement("option");
                selectOption.value = TGrid.FilterCondition.Equals.toString();
                selectOption.text = "=";
                filterCondition.appendChild(selectOption);

                var selectOption = document.createElement("option");
                selectOption.value = TGrid.FilterCondition.NotEquals.toString();
                selectOption.text = "<>";
                filterCondition.appendChild(selectOption);

                // end append filter conditions
                filterPopupContainer.appendChild(filterCondition);
                filterCondition.selectedIndex = 1;

                filterPopupContainer.innerHTML += "<br>";

                var filterText = document.createElement("input");
                filterText.setAttribute("value", "c3");
                filterPopupContainer.appendChild(filterText);

                filterPopupContainer.innerHTML += "<br>";

                var applyButton = document.createElement("button");
                applyButton.innerText = "apply";
                applyButton.onclick = function (e) {
                    TGrid.Grid.getGridObject(e.target).addFilter(option.filterPath, filterPopupContainer.getElementsByTagName("input")[0].value, filterPopupContainer.getElementsByTagName("select")[0].selectedIndex, filterPopupContainer);
                };
                filterPopupContainer.appendChild(applyButton);

                var clearButton = document.createElement("button");
                clearButton.innerText = "clear";
                clearButton.onclick = function (e) {
                    TGrid.Grid.getGridObject(e.target).clearFilter(option.filterPath, filterPopupContainer);
                };
                filterPopupContainer.appendChild(clearButton);

                var exitButton = document.createElement("button");
                exitButton.innerText = "exit";
                exitButton.onclick = function (e) {
                    TGrid.Grid.getGridObject(e.target).hideElement(filterPopupContainer);
                };
                filterPopupContainer.appendChild(exitButton);
            };

            BaseHtmlProvider.prototype.addGroupByElements = function (option, groupByContainer) {
                for (var i = 0; i < option.columns.length; i++) {
                    if (option.columns[i].groupMemberPath != null) {
                        var groupByHeaderElement = document.createElement("div");
                        option.columns[i].header.applyTemplate(groupByHeaderElement);

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
                        groupByContainer.appendChild(groupByHeaderElement);
                    }
                }
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

                        option.columns[i].header.applyTemplate(listItemGroupByItems);
                        listItemGroupByItems["data-group-by-condition"] = option.columns[i].groupMemberPath;
                        listGroupByElement.appendChild(listItemGroupByItems);
                    }
                }

                return listGroupByElement;
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

            BaseHtmlProvider.prototype.updateTableDetailRow = function (option, container, item) {
            };

            BaseHtmlProvider.prototype.updateMobileDetailRow = function (option, container, item) {
            };
            return BaseHtmlProvider;
        })();
        TGrid.BaseHtmlProvider = BaseHtmlProvider;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=BaseHtmlProvider.js.map
