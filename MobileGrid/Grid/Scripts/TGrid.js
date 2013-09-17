var TesserisPro;
(function (TesserisPro) {
    /// <reference path="Options.ts" />
    (function (TGrid) {
        var Grid = (function () {
            function Grid(element, option) {
                var table = document.createElement("table");
                table.setAttribute("border", 1);

                // header
                var header = document.createElement("thead");
                var head = document.createElement("tr");
                for (var i = 0; i < option.columnHeaders.length; i++) {
                    var cell = document.createElement("th");
                    cell.setAttribute("width", option.columnWidth[i]);
                    cell.innerText = option.columnHeaders[i];
                    head.appendChild(cell);
                }
                header.appendChild(head);
                table.appendChild(header);

                //cells
                var body = document.createElement("tbody");
                var row = document.createElement("tr");
                for (var i = 0; i < option.columnDataField.length; i++) {
                    var cell = document.createElement("td");
                    cell.setAttribute("width", option.columnWidth[i]);
                    cell.setAttribute("data-bind", option.columnDataField[i]);
                    cell.innerText = option.columnDataField[i];
                    row.appendChild(cell);
                }
                body.appendChild(row);
                table.appendChild(body);
                element.append(table);
                element.find("script").remove();
                this.table = table;
            }
            return Grid;
        })();
        TGrid.Grid = Grid;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=TGrid.js.map
