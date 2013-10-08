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

            KnockoutHtmlProvider.prototype.updateTableBodyElement = function (option, body, items, selected) {
                for (var itemIndex = 0; itemIndex < items.length; itemIndex++) {
                    var row = document.createElement("tr");

                    if (option.isSelected(items[itemIndex].item)) {
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

                    body.appendChild(row);
                    ko.applyBindings(items[itemIndex], row);
                    (function (item) {
                        row.onclick = function (e) {
                            selected(item, e.ctrlKey);

                            if (!e.ctrlKey) {
                                for (var i = 0; i < body.children.length; i++) {
                                    body.children.item(i).removeAttribute("class");
                                }
                            }

                            if (option.isSelected(item.item)) {
                                (this).setAttribute("class", "selected");
                            } else {
                                (this).removeAttribute("class");
                            }
                        };
                    })(items[itemIndex]);
                }

                //Hide table on mobile devices
                var bodyClass = body.getAttribute("class");
                if (bodyClass == null || bodyClass == undefined || bodyClass == '') {
                    bodyClass = "desktop";
                } else {
                    if (bodyClass.indexOf("desktop") == -1) {
                        bodyClass += " desktop";
                    }
                }
                body.setAttribute("class", bodyClass);
            };

            KnockoutHtmlProvider.prototype.updateMobileItemsList = function (option, container, items, selected) {
                for (var itemIndex = 0; itemIndex < items.length; itemIndex++) {
                    var row = document.createElement("div");
                    row.setAttribute("class", "tgrid-mobile-row");
                    row.innerHTML = option.mobileTemplateHtml;
                    container.appendChild(row);
                    ko.applyBindings(items[itemIndex], row);

                    if (option.isSelected(items[itemIndex].item)) {
                        row.setAttribute("class", "tgrid-mobile-row selected");
                    }

                    (function (item) {
                        row.onclick = function (e) {
                            selected(item, e.ctrlKey);

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
                        };
                    })(items[itemIndex]);
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
