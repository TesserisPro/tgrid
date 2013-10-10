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
    /// <reference path="../IGroup.ts" />
    (function (TGrid) {
        var KnockoutHtmlProvider = (function (_super) {
            __extends(KnockoutHtmlProvider, _super);
            function KnockoutHtmlProvider() {
                _super.apply(this, arguments);
            }
            KnockoutHtmlProvider.prototype.getTableElement = function (option) {
                var table = document.createElement("table");
                table.className = "tgrid-table";
                return table;
            };

            KnockoutHtmlProvider.prototype.addArrows = function (htmlNode, option, columnNumber) {
                if (option.sortDescriptor.column == option.columns[columnNumber].sortMemberPath && option.sortDescriptor.asc) {
                    var up = document.createElement("div");
                    up.classList.add("tgrid-arrow-up");
                    htmlNode.appendChild(up);
                }
                if (option.sortDescriptor.column == option.columns[columnNumber].sortMemberPath && !option.sortDescriptor.asc) {
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

            KnockoutHtmlProvider.prototype.updateTableHeadElement = function (option, header, isSortable) {
                if (header.innerHTML != null && header.innerHTML != "") {
                    if (isSortable) {
                        this.removeArrows(header);
                        var element = header.getElementsByTagName("th");
                        for (var i = 0; i < element.length && i < option.columns.length; i++) {
                            element[i] = this.addArrows(element[i], option, i);
                        }
                    }
                } else {
                    // Create table header
                    var head = document.createElement("tr");

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
                if (!option.showDetailFor.isApply) {
                    option.showDetailFor.column = -1;
                }

                for (var i = 0; i < items.length; i++) {
                    this.appendGroupElement(option, container, items[i], 0, selected);
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

            KnockoutHtmlProvider.prototype.buildDetailsRow = function (option) {
                var detailTr = document.createElement("tr");
                var detailTd = document.createElement("td");

                detailTr.setAttribute("class", "details");
                detailTd.setAttribute("colspan", (option.columns.length + 1).toString());
                detailTd.innerHTML = option.showDetailFor.column == -1 ? option.detailsTemplateHtml : option.columns[option.showDetailFor.column].cellDetail;
                detailTr.appendChild(detailTd);

                return detailTr;
            };

            KnockoutHtmlProvider.prototype.buildRowElement = function (option, item, container, selected) {
                var row = document.createElement("tr");

                if (option.isSelected(item.item)) {
                    row.setAttribute("class", "selected");
                }

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
                        if (option.selectMode != TGrid.SelectMode.None) {
                            selected(item, e.ctrlKey);
                        }
                        if (option.selectMode == TGrid.SelectMode.Multi) {
                            if (!e.ctrlKey) {
                                for (var i = 0; i < container.children.length; i++) {
                                    container.children.item(i).removeAttribute("class");
                                }
                            }
                            if (option.isSelected(item.item)) {
                                (this).setAttribute("class", "selected");
                            } else {
                                (this).removeAttribute("class");
                            }
                        }
                        if (option.selectMode == TGrid.SelectMode.Single) {
                            for (var i = 0; i < container.children.length; i++) {
                                container.children.item(i).removeAttribute("class");
                            }
                            if (option.isSelected(item.item)) {
                                (this).setAttribute("class", "selected");
                            } else {
                                (this).removeAttribute("class");
                            }
                        }
                    };
                })(item);

                return row;
            };

            KnockoutHtmlProvider.prototype.appendGroupElement = function (option, container, item, groupLevel, selected) {
                var maxGroupLevel = 1;

                if (groupLevel != maxGroupLevel) {
                    var groupElement = document.createElement("tr");
                    var groupColumnElement = document.createElement("td");
                    var shiftingElement = document.createElement("div");
                    shiftingElement.setAttribute("style", "display: inline-block; width:" + (groupLevel * 10).toString + "px;");
                    groupColumnElement.setAttribute("colspan", (option.columns.length + 1).toString());
                    groupColumnElement.appendChild(shiftingElement);
                    var groupDescription = document.createElement("span");
                    groupDescription.innerHTML = "Group";
                    groupColumnElement.appendChild(groupDescription);
                    groupElement.appendChild(groupColumnElement);
                    container.appendChild(groupElement);

                    for (var i = 0; i < item.children.length; i++) {
                        this.appendGroupElement(option, container, item.children[i], groupLevel + 1, selected);
                    }
                }

                if (groupLevel == maxGroupLevel || item.children == null) {
                    var itemWithDetails;
                    var rowWithDetail;

                    var row = this.buildRowElement(option, item, container, selected);

                    container.appendChild(row);
                    ko.applyBindings(item, row);

                    if (option.showDetailFor.item == item.item) {
                        itemWithDetails = item;
                        rowWithDetail = row;
                    }

                    var details = this.buildDetailsRow(option);

                    if (itemWithDetails != null) {
                        insertAfter(rowWithDetail, details);
                        ko.applyBindings(itemWithDetails, details);
                    }
                }
            };

            KnockoutHtmlProvider.prototype.updateMobileItemsList = function (option, container, items, selected) {
                if (!option.showDetailFor.isApply) {
                    option.showDetailFor.column = -1;
                }
                var detailDiv = document.createElement("div");
                detailDiv.innerHTML = option.showDetailFor.column == -1 ? option.detailsTemplateHtml : option.columns[option.showDetailFor.column].cellDetail;
                detailDiv.setAttribute("class", "details tgrid-mobile-row");
                var selectedRow;

                var itemWithDetails;

                for (var itemIndex = 0; itemIndex < items.length; itemIndex++) {
                    var row = document.createElement("div");
                    row.setAttribute("class", "tgrid-mobile-row");
                    row.innerHTML = option.mobileTemplateHtml;
                    container.appendChild(row);
                    ko.applyBindings(items[itemIndex], row);

                    if (option.isSelected(items[itemIndex].item)) {
                        row.setAttribute("class", "tgrid-mobile-row selected");
                    }

                    if (option.showDetailFor.item == items[itemIndex].item) {
                        itemWithDetails = items[itemIndex];
                    }

                    (function (item) {
                        row.onclick = function (e) {
                            if (option.selectMode != TGrid.SelectMode.None) {
                                selected(item, e.ctrlKey);
                            }
                            if (option.selectMode == TGrid.SelectMode.Multi) {
                                if (!e.ctrlKey) {
                                    for (var i = 0; i < container.children.length; i++) {
                                        container.children.item(i).setAttribute("class", "tgrid-mobile-row");
                                    }
                                }

                                if (option.isSelected(item.item)) {
                                    (this).setAttribute("class", "tgrid-mobile-row selected");
                                } else {
                                    (this).setAttribute("class", "tgrid-mobile-row");
                                }
                            }
                            if (option.selectMode == TGrid.SelectMode.Single) {
                                for (var i = 0; i < container.children.length; i++) {
                                    container.children.item(i).setAttribute("class", "tgrid-mobile-row");
                                }
                                if (option.isSelected(item.item)) {
                                    (this).setAttribute("class", "tgrid-mobile-row selected");
                                } else {
                                    (this).setAttribute("class", "tgrid-mobile-row");
                                }
                            }
                        };
                    })(items[itemIndex]);

                    selectedRow = container.getElementsByClassName("selected");
                }

                if (itemWithDetails != null) {
                    insertAfter(selectedRow[0], detailDiv);
                    ko.applyBindings(itemWithDetails, detailDiv);
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
                option.showDetailFor.isApply = false;
            };

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
                        if (option.columns[i].sortMemberPath == option.sortDescriptor.column) {
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
                            if (option.columns[i].sortMemberPath == option.sortDescriptor.column) {
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
            return KnockoutHtmlProvider;
        })(TGrid.BaseHtmlProvider);
        TGrid.KnockoutHtmlProvider = KnockoutHtmlProvider;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=KnockoutHtmlProvider.js.map
