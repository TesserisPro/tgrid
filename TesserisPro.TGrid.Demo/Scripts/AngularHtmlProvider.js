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
        var AngularHtmlProvider = (function (_super) {
            __extends(AngularHtmlProvider, _super);
            function AngularHtmlProvider() {
                _super.apply(this, arguments);
            }
            AngularHtmlProvider.prototype.getTableElement = function (option) {
                var controllerName = "Ctrl";
                var table = document.createElement("table");
                table.setAttribute("ng-controller", controllerName);
                table.className = "tgrid-table";
                return table;
            };

            AngularHtmlProvider.prototype.getTableHeadElement = function (option) {
                var header = document.createElement("thead");
                var head = document.createElement("tr");
                for (var i = 0; i < option.columns.length; i++) {
                    var headerCell = document.createElement("th");
                    headerCell.setAttribute("width", option.columns[i].width);
                    option.columns[i].header.applyTemplate(headerCell);

                    // Get column
                    /*var columnName = option.columnDataField[i].GetBinding();
                    if (columnName != null && columnName != "") {
                    columnName = columnName.split(':')[1].trim();
                    }
                    // Method changing sorting
                    headerCell.setAttribute("ng-click",
                    "sortColumn = \"" + columnName + "\";" +
                    "sortOrder=!sortOrder;");
                    
                    // Arrows
                    var up = document.createElement("div");
                    up.classList.add("arrow-up");
                    up.setAttribute("ng-show", "!sortOrder&&sortColumn==\"" + columnName + "\"");
                    headerCell.appendChild(up);
                    var down = document.createElement("div");
                    down.classList.add("arrow-down");
                    down.setAttribute("ng-show", "sortOrder&&sortColumn==\"" + columnName + "\"");
                    headerCell.appendChild(down);
                    */
                    head.appendChild(headerCell);
                }
                head.appendChild(headerCell);

                header.appendChild(head);
                return header;
            };

            AngularHtmlProvider.prototype.updateTableBodyElement = function (option, body, items) {
                var row = document.createElement("tr");
                row.setAttribute("ng-repeat", "item in items|orderBy:sortColumn:sortOrder| startFrom:currentPage*pageSize | limitTo:pageSize");
                for (var i = 0; i < option.columns.length; i++) {
                    var cell = document.createElement("td");
                    cell.setAttribute("width", option.columns[i].width);
                    option.columns[i].cell.applyTemplate(cell);
                    row.appendChild(cell);
                }
                body.appendChild(row);
            };
            return AngularHtmlProvider;
        })(TGrid.BaseHtmlProvider);
        TGrid.AngularHtmlProvider = AngularHtmlProvider;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=AngularHtmlProvider.js.map
