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
    /// <reference path="../utils.ts" />
    /// <reference path="../IFooterViewModel.ts" />
    /// <reference path="KnockoutFilterPopupViewModel.ts" />
    /// <reference path="KnockoutFooterViewModel.ts" />
    (function (TGrid) {
        var KnockoutHtmlProvider = (function (_super) {
            __extends(KnockoutHtmlProvider, _super);
            function KnockoutHtmlProvider() {
                _super.apply(this, arguments);
            }
            // Table Methods
            KnockoutHtmlProvider.prototype.getTableElement = function (option) {
                var table = document.createElement("table");
                table.className = "tgrid-table";
                return table;
            };

            KnockoutHtmlProvider.prototype.getElemntsSize = function (container, items) {
                var size = 0;
                var children = container.children;
                for (var i = 0; i < children.length; i++) {
                    var child = children.item(i);
                    var viewModel = (ko.contextFor(child).$root);

                    if (viewModel != null && items.indexOf(viewModel) > 0) {
                        size += child.clientHeight;
                    }
                }

                return size;
            };

            KnockoutHtmlProvider.prototype.getFirstVisibleItem = function (container, items, scrollTop) {
                var size = 0;
                var children = container.children;
                for (var i = 0; i < children.length; i++) {
                    var child = children.item(i);
                    var viewModel = (ko.contextFor(child).$root);
                    if (viewModel != null && items.indexOf(viewModel) > 0) {
                        size += child.clientHeight;
                    }
                    if (size > scrollTop) {
                        return viewModel;
                    }
                }

                return null;
            };

            KnockoutHtmlProvider.prototype.getFooterViewModel = function () {
                var knockoutFooterViewModel = new TGrid.KnockoutFooterViewModel(0, 0, 0, 0);
                return knockoutFooterViewModel;
            };

            KnockoutHtmlProvider.prototype.getFilterPopupViewModel = function (container) {
                var filterPopupViewModel = new TGrid.KnockoutFilterPopupViewModel(container);
                return filterPopupViewModel;
            };

            KnockoutHtmlProvider.prototype.updateTableHeadElement = function (option, header, groupByContainer, filterPopupContainer, isSortable, columnsResized) {
                if (header.innerHTML != null && header.innerHTML != "") {
                    //add intends for groupBy
                    this.showNeededIntends(header, option.groupBySortDescriptor.length, TGrid.Grid.getGridObject(header));

                    if (isSortable) {
                        this.removeArrows(header);
                        var element = header.getElementsByTagName("th");

                        for (var i = option.columns.length, j = 0; i < element.length, j < option.columns.length; i++, j++) {
                            if (option.sortDescriptor.path == option.columns[j].sortMemberPath) {
                                this.addArrows(element[i].getElementsByClassName("tgrid-header-cell-buttons")[0], option, i);
                            }
                        }
                    }

                    this.updateGroupByElements(option, header, groupByContainer);
                } else {
                    this.addGroupBy(option, header, groupByContainer);

                    // Create table header
                    var head = document.createElement("tr");
                    this.appendIndent(head, option.columns.length, true);
                    this.showNeededIntends(head, option.groupBySortDescriptor.length, TGrid.Grid.getGridObject(header));

                    for (var i = 0; i < option.columns.length; i++) {
                        var headerCell = document.createElement("th");
                        headerCell.className = "tgrid-header-cell";
                        var headerMainContainer = document.createElement("div");
                        headerMainContainer.className = "tgrid-header-cell-container";
                        var headerContent = document.createElement("div");
                        var headerButtons = document.createElement("div");
                        headerContent.className = "tgrid-header-cell-content";
                        headerButtons.className = "tgrid-header-cell-buttons";
                        headerMainContainer.appendChild(headerContent);
                        headerMainContainer.appendChild(headerButtons);
                        headerCell.appendChild(headerMainContainer);

                        headerCell.setAttribute("width", option.columns[i].width);

                        if (option.columns[i].header != null) {
                            option.columns[i].header.applyTemplate(headerContent);
                        } else {
                            var headerText = option.columns[i].member != null ? option.columns[i].member : "";
                            this.createDefaultHeader(headerContent, headerText);
                        }

                        // Method changing sorting
                        (function (i) {
                            headerCell.onclick = function (e) {
                                return TGrid.Grid.getGridObject(e.target).sortBy(option.columns[i].sortMemberPath);
                            };
                        })(i);

                        if (isSortable) {
                            if (option.sortDescriptor.path == option.columns[i].sortMemberPath) {
                                this.addArrows(headerButtons, option, i);
                            }
                        }

                        if (option.isEnableFiltering) {
                            var filter = document.createElement("div");
                            filter.classList.add("tgrid-filter-button");
                            (function (i) {
                                filter.onclick = function (e) {
                                    var left = (e.target).offsetLeft;
                                    for (var j = 0; j < i; j++) {
                                        left += parseInt(option.columns[j].width);
                                    }
                                    var el = header.getElementsByClassName("tgrid-table-indent-cell");
                                    if (el.length > 0) {
                                        for (var j = 0; j < option.groupBySortDescriptor.length; j++) {
                                            left += 20;
                                        }
                                    }
                                    TGrid.Grid.getGridObject(e.target).showFilterBox((filterPopupContainer), option.columns[i].sortMemberPath, left);
                                    e.cancelBubble = true;
                                };
                            })(i);
                            headerButtons.appendChild(filter);
                        }

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
                    var placeholderColumn = document.createElement("th");
                    placeholderColumn.classList.add("tgrid-placeholder");
                    head.appendChild(placeholderColumn);

                    header.appendChild(head);
                    ko.applyBindings(option.parentViewModel, head);
                }
            };

            KnockoutHtmlProvider.prototype.updateTableBodyElement = function (option, container, items, selected) {
                if (!option.showDetailFor.isDetailColumn) {
                    option.showDetailFor.column = -1;
                }

                for (var i = 0; i < items.length; i++) {
                    this.appendTableElement(option, container, items[i], 0, selected);
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
                container.classList.add(bodyClass);
            };

            KnockoutHtmlProvider.prototype.updateTableDetailRow = function (option, container, item) {
                var detailRow = container.getElementsByClassName("details");
                if (detailRow.length > 0) {
                    detailRow[0].parentNode.removeChild(detailRow[0]);
                }

                if (option.selectionMode == TGrid.SelectionMode.Multi) {
                    if (!option.ctrlKey) {
                        for (var i = 0; i < container.children.length; i++) {
                            (container.children.item(i)).classList.remove("selected");
                        }
                    }
                    if (option.isSelected(item)) {
                        option.selectedRow.classList.add("selected");
                    } else {
                        option.selectedRow.classList.remove("selected");
                    }
                }
                if (option.selectionMode == TGrid.SelectionMode.Single) {
                    for (var i = 0; i < container.children.length; i++) {
                        (container.children.item(i)).classList.remove("selected");
                    }
                    if (option.isSelected(item)) {
                        option.selectedRow.classList.add("selected");
                    } else {
                        option.selectedRow.classList.remove("selected");
                    }
                }

                var selectedElement = container.getElementsByClassName("selected");

                if (this.hasDetails(selectedElement, option)) {
                    var details = this.buildDetailsRow(option);
                    details.classList.add("details");
                    insertAfter(selectedElement[0], details);
                    ko.applyBindings(option.showDetailFor, details);
                }
            };

            KnockoutHtmlProvider.prototype.updateTableFooterElement = function (option, footer, totalItemsCount, footerModel) {
                if (option.tableFooterTemplate == null && option.isEnablePaging) {
                    this.updateTableFooterElementDefault(option, footer, totalItemsCount);
                } else if (option.tableFooterTemplate != null) {
                    var footerContainer = document.createElement("div");
                    if (option.isEnablePaging) {
                        this.updateTableFooterElementDefault(option, footer, totalItemsCount);
                    }
                    option.tableFooterTemplate.applyTemplate(footerContainer);
                    ko.applyBindings(footerModel, footerContainer);

                    footer.appendChild(footerContainer);
                }
            };

            KnockoutHtmlProvider.prototype.addFiltringPopUp = function (option, filterPopup, filterPopupModel) {
                if (option.filterPopup == null) {
                    this.defaultFiltringPopUp(option, filterPopup);
                } else {
                    var filterContainer = document.createElement("div");
                    filterContainer.className = "tgrid-filter-popup-container";
                    option.filterPopup.applyTemplate(filterContainer);
                    filterPopup.innerHTML = "";
                    filterPopup.appendChild(filterContainer);

                    ko.applyBindings(filterPopupModel, filterPopup);
                }
            };

            KnockoutHtmlProvider.prototype.appendTableElement = function (option, container, item, groupLevel, selected) {
                var itemWithDetails;
                var rowWithDetail;

                if (item.isGroupHeader) {
                    var groupHeader = this.buildGroupHeaderRow(option, item.item);
                    container.appendChild(groupHeader);
                    ko.applyBindings(item, groupHeader);
                } else {
                    var row = this.buildRowElement(option, item, container, selected);

                    container.appendChild(row);
                    ko.applyBindings(item, row);
                }
            };

            KnockoutHtmlProvider.prototype.upadeteTableColumnsWidth = function (option, container) {
            };

            KnockoutHtmlProvider.prototype.buildRowElement = function (option, item, container, selected) {
                var row = document.createElement("tr");
                row.classList.add("table-body-row");

                if (option.isSelected(item.item)) {
                    row.classList.add("selected");
                }

                this.appendIndent(row, option.groupBySortDescriptor.length, false);

                for (var i = 0; i < option.columns.length; i++) {
                    var cell = document.createElement("td");

                    if (option.columns[i].cell != null) {
                        option.columns[i].cell.applyTemplate(cell);
                    } else {
                        if (option.columns[i].member != null) {
                            cell = this.createDefaultCell(cell, option.columns[i].member);
                        }
                    }
                    row.appendChild(cell);
                }

                var placeholderColumn = document.createElement("td");
                placeholderColumn.classList.add("tgrid-placeholder");
                row.appendChild(placeholderColumn);

                (function (item) {
                    row.onclick = function (e) {
                        if (option.selectionMode != TGrid.SelectionMode.None) {
                            option.ctrlKey = e.ctrlKey;
                            option.selectedRow = this;
                            selected(item, e.ctrlKey);
                        }
                    };
                })(item);

                return row;
            };

            KnockoutHtmlProvider.prototype.buildDetailsRow = function (option) {
                var detailTr = document.createElement("tr");
                var detailTd = document.createElement("td");

                this.appendIndent(detailTr, option.groupBySortDescriptor.length, false);

                detailTr.classList.add("details");
                detailTd.setAttribute("colspan", (option.columns.length + 1).toString());
                option.showDetailFor.column == -1 ? option.detailsTemplateHtml.applyTemplate(detailTd) : option.columns[option.showDetailFor.column].cellDetail.applyTemplate(detailTd);
                detailTr.appendChild(detailTd);

                return detailTr;
            };

            KnockoutHtmlProvider.prototype.buildGroupHeaderRow = function (option, groupHeaderDescriptor) {
                var headerTr = document.createElement("tr");
                var headerTd = document.createElement("td");

                this.appendIndent(headerTr, groupHeaderDescriptor.level, false);

                var colspan = option.columns.length + 1 + option.groupBySortDescriptor.length - groupHeaderDescriptor.level;
                headerTd.setAttribute("colspan", colspan.toString());
                headerTd.classList.add("tgrid-table-group-header");
                headerTr.classList.add("tgrid-table-group-header");
                if (option.isEnableCollapsing) {
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
                if (option.groupHeaderTemplate != null) {
                    option.groupHeaderTemplate.applyTemplate(headerTd);
                } else {
                    headerTd = this.createDefaultGroupHeader(headerTd);
                }

                headerTr.appendChild(headerTd);

                return headerTr;
            };

            KnockoutHtmlProvider.prototype.addArrows = function (sortArrowContainer, option, columnNumber) {
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

            KnockoutHtmlProvider.prototype.removeArrows = function (htmlNode) {
                var element = htmlNode.getElementsByClassName("tgrid-arrow-up");
                if (element.length == 1) {
                    element[0].parentNode.removeChild(element[0]);
                }
                var element = htmlNode.getElementsByClassName("tgrid-arrow-down");
                if (element.length == 1) {
                    element[0].parentNode.removeChild(element[0]);
                }
            };

            KnockoutHtmlProvider.prototype.appendIndent = function (target, level, isHeader) {
                var tag = isHeader ? "th" : "td";
                for (var i = 0; i < level; i++) {
                    var cell = document.createElement(tag);
                    cell.className = "tgrid-table-indent-cell";
                    target.appendChild(cell);
                }
            };

            // Mobile Methods
            KnockoutHtmlProvider.prototype.updateMobileHeadElement = function (option, mobileHeader, isSortable) {
                if (mobileHeader.innerHTML != null && mobileHeader.innerHTML != "") {
                    // Update mobile sort arrow
                    this.removeArrows(mobileHeader);
                    var arrowUpdate = mobileHeader.getElementsByClassName("arrows");
                    if (option.sortDescriptor.asc) {
                        var up = document.createElement("div");
                        up.classList.add("tgrid-arrow-up");
                        arrowUpdate[0].appendChild(up);
                    } else {
                        var down = document.createElement("div");
                        down.classList.add("tgrid-arrow-down");
                        arrowUpdate[0].appendChild(down);
                    }

                    // Update mobile sort column
                    var selectUpdate = document.getElementsByTagName("select");
                    for (var i = 0; i < option.columns.length; i++) {
                        if (option.columns[i].sortMemberPath == option.sortDescriptor.path) {
                            selectUpdate[0].selectedIndex = i;
                        }
                    }
                } else {
                    // Create mobile header
                    // Hide table on mobile devices
                    var headerClass = mobileHeader.getAttribute("class");
                    if (headerClass == null || headerClass == undefined || headerClass == '') {
                        headerClass = "mobile";
                    } else {
                        headerClass += " mobile";
                    }
                    mobileHeader.setAttribute("class", headerClass);

                    if (isSortable) {
                        var mobileSortingContainer = document.createElement("div");
                        var mobileHeaderButtons = document.createElement("div");
                        var arrows = document.createElement("span");
                        var select = document.createElement("select");

                        select.onchange = function (e) {
                            TGrid.Grid.getGridObject(e.target).sortBy(select.options[select.selectedIndex].value);
                        };

                        for (var i = 0; i < option.columns.length; i++) {
                            var selectOption = document.createElement("option");
                            selectOption.value = option.columns[i].sortMemberPath;
                            selectOption.text = option.columns[i].sortMemberPath;
                            select.appendChild(selectOption);
                            if (option.columns[i].sortMemberPath == option.sortDescriptor.path) {
                                arrows = this.addArrows(arrows, option, i);
                            }
                        }

                        mobileHeaderButtons.classList.add("tgrid-header-cell-buttons");
                        arrows.classList.add("arrows");
                        mobileHeaderButtons.appendChild(arrows);
                        mobileSortingContainer.classList.add("tgrid-inline-block");
                        mobileSortingContainer.innerHTML += "Sorting by ";
                        mobileSortingContainer.appendChild(select);
                        mobileSortingContainer.appendChild(mobileHeaderButtons);

                        arrows.onclick = function (e) {
                            TGrid.Grid.getGridObject(e.target).sortBy(select.options[select.selectedIndex].value);
                        };

                        mobileHeader.appendChild(mobileSortingContainer);
                    } else {
                        mobileHeader.innerHTML = "<div></div>";
                    }
                }
            };

            KnockoutHtmlProvider.prototype.updateMobileItemsList = function (option, container, items, selected) {
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

            KnockoutHtmlProvider.prototype.updateMobileDetailRow = function (option, container, item) {
                var detailRow = container.getElementsByClassName("details");
                if (detailRow.length > 0) {
                    detailRow[0].parentNode.removeChild(detailRow[0]);
                }

                if (option.selectionMode == TGrid.SelectionMode.Multi) {
                    if (!option.ctrlKey) {
                        for (var i = 0; i < container.children.length; i++) {
                            (container.children.item(i)).classList.remove("selected");
                        }
                    }
                    if (option.isSelected(item.item)) {
                        option.selectedRow.classList.add("selected");
                    } else {
                        (container.children.item(i)).classList.remove("selected");
                    }
                }
                if (option.selectionMode == TGrid.SelectionMode.Single) {
                    for (var i = 0; i < container.children.length; i++) {
                        (container.children.item(i)).classList.remove("selected");
                    }
                    if (option.isSelected(item)) {
                        option.selectedRow.classList.add("selected");
                    } else {
                        (container.children.item(i)).classList.remove("selected");
                    }
                }

                var selectedElement = container.getElementsByClassName("selected");

                if (this.hasDetails(selectedElement, option)) {
                    var details = this.buildMobileDetailsRow(option);
                    details.classList.add("details");
                    insertAfter(selectedElement[0], details);
                    ko.applyBindings(option.showDetailFor, details);
                }
            };

            KnockoutHtmlProvider.prototype.appendMobileElement = function (option, container, item, groupLevel, selected) {
                var itemWithDetails;
                var rowWithDetail;
                if (item.isGroupHeader && option.groupHeaderTemplate != null) {
                    var mobileGroupHeader = this.buildGroupMobileHeaderRow(option, item.item);
                    container.appendChild(mobileGroupHeader);
                    ko.applyBindings(item, mobileGroupHeader);
                } else {
                    var row = this.buildMobileRowElement(option, item, container, selected);

                    container.appendChild(row);
                    ko.applyBindings(item, row);
                }
            };

            KnockoutHtmlProvider.prototype.buildMobileRowElement = function (option, item, container, selected) {
                var row = document.createElement("div");
                row.classList.add("tgrid-mobile-row");

                if (option.isSelected(item.item)) {
                    row.classList.add("selected");
                }

                for (var i = 0; i < option.groupBySortDescriptor.length; i++) {
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

                var placeholderColumn = document.createElement("td");
                placeholderColumn.classList.add("tgrid-placeholder");
                row.appendChild(placeholderColumn);

                (function (item) {
                    row.onclick = function (e) {
                        if (option.selectionMode != TGrid.SelectionMode.None) {
                            option.ctrlKey = e.ctrlKey;
                            option.selectedRow = this;
                            var s = container;
                            selected(item, e.ctrlKey);
                        }
                    };
                })(item);

                return row;
            };

            KnockoutHtmlProvider.prototype.buildMobileDetailsRow = function (option) {
                var detailDiv = document.createElement("div");

                detailDiv.classList.add("tgrid-mobile-details");
                option.showDetailFor.column == -1 ? option.detailsTemplateHtml.applyTemplate(detailDiv) : option.columns[option.showDetailFor.column].cellDetail.applyTemplate(detailDiv);

                return detailDiv;
            };

            KnockoutHtmlProvider.prototype.createDefaultCell = function (cell, defaultCellBindingName) {
                var spanForCell = document.createElement("span");
                var textBinding = "text: item.".concat(defaultCellBindingName);
                spanForCell.setAttribute("data-bind", textBinding);
                cell.appendChild(spanForCell);

                return cell;
            };

            KnockoutHtmlProvider.prototype.createDefaultGroupHeader = function (tableRowElement) {
                var groupHeaderContainer = document.createElement("div");
                var groupHeaderName = document.createElement("span");
                groupHeaderName.setAttribute("data-bind", "text: item.value");
                groupHeaderName.setAttribute("style", "color: green;");
                groupHeaderContainer.appendChild(groupHeaderName);
                tableRowElement.appendChild(groupHeaderContainer);
                return tableRowElement;
            };

            KnockoutHtmlProvider.prototype.bindData = function (option, elementForBinding) {
                var viewModel = ko.contextFor(option.target);
                ko.applyBindings(viewModel, elementForBinding);
            };
            return KnockoutHtmlProvider;
        })(TGrid.BaseHtmlProvider);
        TGrid.KnockoutHtmlProvider = KnockoutHtmlProvider;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=KnockoutHtmlProvider.js.map
