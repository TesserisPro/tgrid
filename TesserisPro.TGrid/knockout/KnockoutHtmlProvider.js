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

            KnockoutHtmlProvider.prototype.updateTableHeadElement = function (option, header, isSortable) {
                if (header.innerHTML != null && header.innerHTML != "") {
                    if (isSortable) {
                        var element = header.getElementsByClassName("tgrid-arrow-up");
                        if (element.length == 1) {
                            element[0].parentNode.removeChild(element[0]);
                        }
                        var element = header.getElementsByClassName("tgrid-arrow-down");
                        if (element.length == 1) {
                            element[0].parentNode.removeChild(element[0]);
                        }
                        element = header.getElementsByTagName("th");
                        for (var i = 0; i < element.length && i < option.columns.length; i++) {
                            element[i] = this.addArrows(element[i], option, i);
                        }
                    }
                } else {
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
                    bodyClass += " desktop";
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

                    (function (item) {
                        row.onclick = function (e) {
                            if (!e.ctrlKey) {
                                if (selected(item, false)) {
                                    for (var i = 0; i < container.children.length; i++) {
                                        container.children.item(i).removeAttribute("class");
                                    }
                                    (this).setAttribute("class", "selected");
                                }
                            } else {
                                if ((this).getAttribute("class") == "selected") {
                                    if (selected(item, true)) {
                                        (this).removeAttribute("class");
                                    }
                                } else {
                                    if (selected(item, true)) {
                                        (this).setAttribute("class", "selected");
                                    }
                                }
                            }
                        };
                    })(items[itemIndex]);
                }

                //Hide table on mobile devices
                var bodyClass = container.getAttribute("class");
                if (bodyClass == null || bodyClass == undefined || bodyClass == '') {
                    bodyClass = "mobile";
                } else {
                    bodyClass += " mobile";
                }
                container.setAttribute("class", bodyClass);
            };
            return KnockoutHtmlProvider;
        })(TGrid.BaseHtmlProvider);
        TGrid.KnockoutHtmlProvider = KnockoutHtmlProvider;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=KnockoutHtmlProvider.js.map
