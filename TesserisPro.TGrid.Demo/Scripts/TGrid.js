var TesserisPro;
(function (TesserisPro) {
    /// <reference path="Options.ts" />
    (function (TGrid) {
        var Grid = (function () {
            function Grid(element, option) {
                var table = this.getTableElement(option);

                // header
                var header = this.getTableHeadElement(option);
                table.appendChild(header);

                //cells
                var body = this.getTableBodyElement(option);
                table.appendChild(body);

                element.appendChild(table);

                var script = element.getElementsByTagName("script").item(0);
                element.removeChild(script);
                element.removeAttribute("data-bind");

                this.table = table;
            }
            Grid.prototype.getHtmlProvider = function (options) {
            };

            Grid.prototype.getTableElement = function (option) {
                var table = document.createElement("table");
                table.border = "1";
                table.className = "tp-tgrid";
                return table;
            };

            Grid.prototype.getTableHeadElement = function (option) {
                var header = document.createElement("thead");
                header.className = "tp-tgrid";
                var headRow = document.createElement("tr");
                headRow.className = "tp-tgrid";

                for (var i = 0; i < option.columnHeaders.length; i++) {
                    var headerCell = document.createElement("th");
                    headerCell.setAttribute("width", option.columnWidth[i]);
                    headerCell.className = "tp-tgrid";
                    option.columnHeaders[i].apply(headerCell);
                    headRow.appendChild(headerCell);
                }
                header.appendChild(headRow);

                return header;
            };

            Grid.prototype.getTableBodyElement = function (option) {
                var body = document.createElement("tbody");
                body.setAttribute("data-bind", "foreach:" + option.mainBinding.split(':')[1]);
                var row = document.createElement("tr");
                for (var i = 0; i < option.columnDataField.length; i++) {
                    var cell = document.createElement("td");
                    cell.setAttribute("width", option.columnWidth[i]);
                    option.columnDataField[i].apply(cell);
                    row.appendChild(cell);
                }
                body.appendChild(row);

                return body;
            };
            return Grid;
        })();
        TGrid.Grid = Grid;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=TGrid.js.map
