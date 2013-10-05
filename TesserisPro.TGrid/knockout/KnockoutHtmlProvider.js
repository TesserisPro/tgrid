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

            KnockoutHtmlProvider.prototype.getTableHeadElement = function (option, isSortable) {
                var header = document.createElement("thead");
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
                        if (option.sortDescriptor.column == option.columns[i].sortMemberPath && option.sortDescriptor.asc) {
                            var up = document.createElement("div");
                            up.classList.add("arrow-up");
                            headerCell.appendChild(up);
                        }
                        if (option.sortDescriptor.column == option.columns[i].sortMemberPath && !option.sortDescriptor.asc) {
                            var down = document.createElement("div");
                            down.classList.add("arrow-down");
                            headerCell.appendChild(down);
                        }
                    }
                    head.appendChild(headerCell);
                }

                header.appendChild(head);

                return header;
            };

            KnockoutHtmlProvider.prototype.updateTableBodyElement = function (option, body, items) {
                for (var itemIndex = 0; itemIndex < items.length; itemIndex++) {
                    var row = document.createElement("tr");
                    for (var i = 0; i < option.columns.length; i++) {
                        var cell = document.createElement("td");
                        cell.setAttribute("width", option.columns[i].width);
                        option.columns[i].cell.applyTemplate(cell);
                        row.appendChild(cell);
                    }
                    body.appendChild(row);
                    ko.applyBindings(items[itemIndex], row);
                }
            };
            return KnockoutHtmlProvider;
        })(TGrid.BaseHtmlProvider);
        TGrid.KnockoutHtmlProvider = KnockoutHtmlProvider;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=KnockoutHtmlProvider.js.map
