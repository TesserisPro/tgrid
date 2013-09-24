var TesserisPro;
(function (TesserisPro) {
    /// <reference path="Options.ts" />
    (function (TGrid) {
        var Grid = (function () {
            function Grid(element, option) {
                if (option.framework == TesserisPro.TGrid.Framework.Knockout) {
                    var table = document.createElement("table");
                    table.setAttribute("border", "1");

                    // header
                    var header = document.createElement("thead");
                    var head = document.createElement("tr");
                    for (var i = 0; i < option.columnHeaders.length; i++) {
                        var headerCell = document.createElement("th");
                        headerCell.setAttribute("width", option.columnWidth[i]);
                        option.columnHeaders[i].apply(headerCell, TesserisPro.TGrid.Framework.Knockout);
                        head.appendChild(headerCell);
                    }
                    header.appendChild(head);
                    table.appendChild(header);

                    //cells
                    var body = document.createElement("tbody");
                    body.setAttribute("data-bind", "foreach:" + option.mainBinding.split(':')[1]);
                    var row = document.createElement("tr");
                    for (var i = 0; i < option.columnDataField.length; i++) {
                        var cell = document.createElement("td");
                        cell.setAttribute("width", option.columnWidth[i]);
                        option.columnDataField[i].apply(cell, TesserisPro.TGrid.Framework.Knockout);
                        row.appendChild(cell);
                    }
                    body.appendChild(row);
                    table.appendChild(body);
                    element.append(table);

                    //element.find("script").remove();
                    this.table = table;
                }
                if (option.framework == TesserisPro.TGrid.Framework.Angular) {
                    var table = document.createElement("table");
                    table.setAttribute("ng-controller", "agrid");
                    table.setAttribute("border", "2");

                    // header
                    var header = document.createElement("thead");
                    var head = document.createElement("tr");

                    for (var i = 0; i < option.columnHeaders.length; i++) {
                        var headerCell = document.createElement("th");
                        headerCell.setAttribute("width", option.columnWidth[i]);
                        option.columnHeaders[i].apply(headerCell, TesserisPro.TGrid.Framework.Angular, "");
                        head.appendChild(headerCell);
                    }
                    //head.appendChild(headerCell);
                    header.appendChild(head);
                    table.appendChild(header);

                    //cells
                    var body = document.createElement("tbody");
                    var row = document.createElement("tr");
                    row.setAttribute("ng-repeat", "item in items");
                    for (var i = 0; i < option.columnDataField.length; i++) {
                        var cell = document.createElement("td");
                        cell.setAttribute("width", option.columnWidth[i]);
                        option.columnDataField[i].apply(cell, TesserisPro.TGrid.Framework.Angular, "item.");
                        row.appendChild(cell);
                    }
                    body.appendChild(row);
                    table.appendChild(body);
                    var div = document.createElement("div");
                    div.setAttribute("ng-app", "app");
                    div.setAttribute("compile", "html");
                    div.appendChild(table);
                    element.append(div);

                    //element.find("script").remove();
                    this.table = table;
                }
            }
            return Grid;
        })();
        TGrid.Grid = Grid;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=TGrid.js.map
