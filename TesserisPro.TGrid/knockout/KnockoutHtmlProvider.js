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

            KnockoutHtmlProvider.prototype.getTableHeadElement = function (option) {
                var header = document.createElement("thead");
                var head = document.createElement("tr");
                head.className = "tgrid-header";

                for (var i = 0; i < option.columnHeaders.length; i++) {
                    var headerCell = document.createElement("th");
                    headerCell.setAttribute("width", option.columnWidth[i]);
                    option.columnHeaders[i].applyTemplate(headerCell);

                    // Method changing sorting
                    headerCell.onclick = function (e) {
                        return TGrid.Grid.getGridObject(e.target).sortBy(columnName);
                    };

                    // Arrows
                    var up = document.createElement("div");
                    up.classList.add("arrow-up");
                    up.setAttribute("data-bind", "visible:sort().order == 1 && sort().column == \"" + columnName + "\"");
                    headerCell.appendChild(up);
                    var down = document.createElement("div");
                    down.classList.add("arrow-down");
                    down.setAttribute("data-bind", "visible:sort().order == -1 && sort().column == \"" + columnName + "\"");
                    headerCell.appendChild(down);

                    head.appendChild(headerCell);
                }

                header.appendChild(head);

                return header;
            };

            KnockoutHtmlProvider.prototype.updateTableBodyElement = function (option, body, items) {
                for (var itemIndex = 0; itemIndex < items.length; itemIndex++) {
                    var row = document.createElement("tr");
                    for (var i = 0; i < option.columnDataField.length; i++) {
                        var cell = document.createElement("td");
                        cell.setAttribute("width", option.columnWidth[i]);
                        option.columnDataField[i].applyTemplate(cell);
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
