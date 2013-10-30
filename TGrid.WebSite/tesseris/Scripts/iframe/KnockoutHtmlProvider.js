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

            KnockoutHtmlProvider.prototype.updateTableHeadElement = function (option, header, isSortable) {
                if (header.innerHTML != null && header.innerHTML != "") {
                    if (isSortable) {
                        this.removeArrows(header);
                        var element = header.getElementsByTagName("th");

                        for (var i = option.groupBySortDescriptor.length; i < element.length && i - option.groupBySortDescriptor.length < option.columns.length; i++) {
                            element[i] = this.addArrows(element[i], option, i - option.groupBySortDescriptor.length);
                        }
                    }
                } else {
                    // Create table header
                    var head = document.createElement("tr");

                    this.appendIndent(head, option.groupBySortDescriptor.length, true);

                    for (var i = 0; i < option.columns.length; i++) {
                        var headerCell = document.createElement("th");
                        headerCell.setAttribute("width", option.columns[i].width);
                        option.columns[i].header.applyTemplate(headerCell);

                        // Method changing sorting
                        (function (i) {
                            headerCell.onclick = function (e) {
                                return TGrid.Grid.getGridObject(e.target).sortBy(option.columns[i].sortMemberPath);
                            };
                        })(i);

                        if (isSortable) {
                            headerCell = this.addArrows(headerCell, option, i);
                        }
                        head.appendChild(headerCell);
                    }
                    var placeholderColumn = document.createElement("th");
                    placeholderColumn.setAttribute("class", "tgrid-placeholder");
                    head.appendChild(placeholderColumn);

                    header.appendChild(head);
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
                container.setAttribute("class", bodyClass);
            };

            KnockoutHtmlProvider.prototype.updateTableDetailRow = function (option, container, item) {
                var detailRow = container.getElementsByClassName("details");
                if (detailRow.length > 0) {
                    detailRow[0].parentNode.removeChild(detailRow[0]);
                }

                if (option.selectionMode == TGrid.SelectionMode.Multi) {
                    if (!option.ctrlKey) {
                        for (var i = 0; i < container.children.length; i++) {
                            container.children.item(i).removeAttribute("class");
                        }
                    }
                    if (option.isSelected(item)) {
                        option.selectedRow.setAttribute("class", "selected");
                    } else {
                        option.selectedRow.removeAttribute("class");
                    }
                }
                if (option.selectionMode == TGrid.SelectionMode.Single) {
                    for (var i = 0; i < container.children.length; i++) {
                        container.children.item(i).removeAttribute("class");
                    }
                    if (option.isSelected(item)) {
                        option.selectedRow.setAttribute("class", "selected");
                    } else {
                        option.selectedRow.removeAttribute("class");
                    }
                }

                var selectedElement = container.getElementsByClassName("selected");
                var details = this.buildDetailsRow(option);
                details.setAttribute("class", "details");

                if (selectedElement != null && selectedElement.length == 1) {
                    insertAfter(selectedElement[0], details);
                    ko.applyBindings(option.showDetailFor, details);
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

            KnockoutHtmlProvider.prototype.buildRowElement = function (option, item, container, selected) {
                var row = document.createElement("tr");

                if (option.isSelected(item.item)) {
                    row.setAttribute("class", "selected");
                }

                this.appendIndent(row, option.groupBySortDescriptor.length, false);

                for (var i = 0; i < option.columns.length; i++) {
                    var cell = document.createElement("td");
                    cell.setAttribute("width", option.columns[i].width);
                    option.columns[i].cell.applyTemplate(cell);
                    row.appendChild(cell);
                }

                var placeholderColumn = document.createElement("td");
                placeholderColumn.setAttribute("class", "tgrid-placeholder");
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

                detailTr.setAttribute("class", "details");
                detailTd.setAttribute("colspan", (option.columns.length + 1).toString());
                detailTd.innerHTML = option.showDetailFor.column == -1 ? option.detailsTemplateHtml : option.columns[option.showDetailFor.column].cellDetail;
                detailTr.appendChild(detailTd);

                return detailTr;
            };

            KnockoutHtmlProvider.prototype.buildGroupHeaderRow = function (option, groupHeaderDescriptor) {
                var headerTr = document.createElement("tr");
                var headerTd = document.createElement("td");

                this.appendIndent(headerTr, groupHeaderDescriptor.level, false);

                var colspan = option.columns.length + 1 + option.groupBySortDescriptor.length - groupHeaderDescriptor.level;
                headerTd.setAttribute("colspan", colspan.toString());
                headerTd.setAttribute("class", "tgrid-table-group-header");

                //if (!groupHeaderDescriptor.collapse) {
                //    headerTd.onclick = (e) => {
                //        TesserisPro.TGrid.Grid.getGridObject(<HTMLElement>e.target).setFilters(groupHeaderDescriptor.value, groupHeaderDescriptor.level);
                //    }
                //} else {
                //    headerTd.onclick = (e) => {
                //        TesserisPro.TGrid.Grid.getGridObject(<HTMLElement>e.target).removeFilters(groupHeaderDescriptor.value, groupHeaderDescriptor.level);
                //    }
                //}
                headerTd.innerHTML = option.groupHeaderTemplate;

                headerTr.appendChild(headerTd);

                return headerTr;
            };

            KnockoutHtmlProvider.prototype.addArrows = function (htmlNode, option, columnNumber) {
                if (option.sortDescriptor.path == option.columns[columnNumber].sortMemberPath && option.sortDescriptor.asc) {
                    var up = document.createElement("div");
                    up.classList.add("tgrid-arrow-up");
                    htmlNode.appendChild(up);
                }
                if (option.sortDescriptor.path == option.columns[columnNumber].sortMemberPath && !option.sortDescriptor.asc) {
                    var down = document.createElement("div");
                    down.classList.add("tgrid-arrow-down");
                    htmlNode.appendChild(down);
                }
                return htmlNode;
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
                    var arrowUpdate = document.getElementsByClassName("tgrid-inline-block");
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
                        var div = document.createElement("div");
                        var arrow = document.createElement("div");
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
                                arrow = this.addArrows(arrow, option, i);
                            }
                        }

                        arrow.classList.add("tgrid-inline-block");
                        div.innerHTML += "Sorting by ";
                        div.appendChild(select);
                        div.appendChild(arrow);

                        arrow.onclick = function (e) {
                            TGrid.Grid.getGridObject(e.target).sortBy(select.options[select.selectedIndex].value);
                        };

                        mobileHeader.appendChild(div);
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
                            container.children.item(i).setAttribute("class", "tgrid-mobile-row");
                        }
                    }
                    if (option.isSelected(item.item)) {
                        option.selectedRow.setAttribute("class", option.selectedRow.getAttribute("class") + " selected");
                    } else {
                        container.children.item(i).setAttribute("class", "tgrid-mobile-row");
                    }
                }
                if (option.selectionMode == TGrid.SelectionMode.Single) {
                    for (var i = 0; i < container.children.length; i++) {
                        container.children.item(i).setAttribute("class", "tgrid-mobile-row");
                    }
                    if (option.isSelected(item)) {
                        option.selectedRow.setAttribute("class", option.selectedRow.getAttribute("class") + " selected");
                    } else {
                        container.children.item(i).setAttribute("class", "tgrid-mobile-row");
                    }
                }

                var selectedElement = container.getElementsByClassName("selected");
                var details = this.buildMobileDetailsRow(option);
                details.setAttribute("class", "details");

                if (selectedElement != null && selectedElement.length == 1) {
                    insertAfter(selectedElement[0], details);
                    ko.applyBindings(option.showDetailFor, details);
                }
            };

            KnockoutHtmlProvider.prototype.appendMobileElement = function (option, container, item, groupLevel, selected) {
                var itemWithDetails;
                var rowWithDetail;
                if (item.isGroupHeader) {
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
                row.setAttribute("class", "tgrid-mobile-row");

                if (option.isSelected(item.item)) {
                    row.setAttribute("class", "selected tgrid-mobile-row");
                }

                for (var i = 0; i < option.groupBySortDescriptor.length; i++) {
                    row.innerHTML += "<div class='tgrid-mobile-indent-div'></div>";
                }

                row.innerHTML += "<div class='tgrid-mobile-div'>" + option.mobileTemplateHtml + "</div>";

                var placeholderColumn = document.createElement("td");
                placeholderColumn.setAttribute("class", "tgrid-placeholder");
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

                detailDiv.setAttribute("class", "tgrid-mobile-details ");
                detailDiv.innerHTML = option.showDetailFor.column == -1 ? option.detailsTemplateHtml : option.columns[option.showDetailFor.column].cellDetail;

                return detailDiv;
            };

            KnockoutHtmlProvider.prototype.buildGroupMobileHeaderRow = function (option, groupHeaderDescriptor) {
                var headerDiv = document.createElement("div");

                headerDiv.setAttribute("class", "tgrid-mobile-group-header ");
                headerDiv.setAttribute("style", "padding-left: " + (20 * groupHeaderDescriptor.level) + "px !important;");

                headerDiv.innerHTML = option.groupHeaderTemplate;

                return headerDiv;
            };
            return KnockoutHtmlProvider;
        })(TGrid.BaseHtmlProvider);
        TGrid.KnockoutHtmlProvider = KnockoutHtmlProvider;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=KnockoutHtmlProvider.js.map
