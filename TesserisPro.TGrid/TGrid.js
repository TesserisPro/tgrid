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
                        option.columnHeaders[i].applyKnockout(headerCell);

                        // Get column
                        var columnName = option.columnDataField[i].GetBinding();
                        if (columnName != null && columnName != "") {
                            columnName = columnName.split(':')[1].trim();
                        }

                        // Method changing sorting
                        headerCell.setAttribute("data-bind", "click: function(){" + "if(sort().column == \"" + columnName + "\")" + "{sort({ column : \"" + columnName + "\", order: -1 * sort().order});}" + "else {sort({ column : \"" + columnName + "\", order: 1}); }" + "}");

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
                    table.appendChild(header);

                    //cells
                    var body = document.createElement("tbody");
                    body.setAttribute("data-bind", "foreach:sortedData");
                    var row = document.createElement("tr");
                    for (var i = 0; i < option.columnDataField.length; i++) {
                        var cell = document.createElement("td");
                        cell.setAttribute("width", option.columnWidth[i]);
                        option.columnDataField[i].applyKnockout(cell);
                        row.appendChild(cell);
                    }
                    body.appendChild(row);
                    table.appendChild(body);
                    element.append(table);
                    this.table = table;
                }

                if (option.framework == TesserisPro.TGrid.Framework.Angular) {
                    var controllerName = "Ctrl";
                    var appName = "App";

                    var table = document.createElement("table");
                    table.setAttribute("ng-controller", controllerName);
                    table.setAttribute("border", "2");

                    // header
                    var header = document.createElement("thead");
                    var head = document.createElement("tr");
                    for (var i = 0; i < option.columnHeaders.length; i++) {
                        var headerCell = document.createElement("th");
                        headerCell.setAttribute("width", option.columnWidth[i]);
                        option.columnHeaders[i].applyAngular(headerCell, "");

                        // Get column
                        var columnName = option.columnDataField[i].GetBinding();
                        if (columnName != null && columnName != "") {
                            columnName = columnName.split(':')[1].trim();
                        }

                        // Method changing sorting
                        headerCell.setAttribute("ng-click", "sortColumn = \"" + columnName + "\";" + "sortOrder=!sortOrder;");

                        // Arrows
                        var up = document.createElement("div");
                        up.classList.add("arrow-up");
                        up.setAttribute("ng-show", "!sortOrder&&sortColumn==\"" + columnName + "\"");
                        headerCell.appendChild(up);
                        var down = document.createElement("div");
                        down.classList.add("arrow-down");
                        down.setAttribute("ng-show", "sortOrder&&sortColumn==\"" + columnName + "\"");
                        headerCell.appendChild(down);

                        head.appendChild(headerCell);
                    }
                    head.appendChild(headerCell);

                    header.appendChild(head);
                    table.appendChild(header);

                    //cells
                    var body = document.createElement("tbody");
                    var row = document.createElement("tr");
                    row.setAttribute("ng-repeat", "item in items|orderBy:sortColumn:sortOrder");
                    for (var i = 0; i < option.columnDataField.length; i++) {
                        var cell = document.createElement("td");
                        cell.setAttribute("width", option.columnWidth[i]);
                        option.columnDataField[i].applyAngular(cell, "item.");
                        row.appendChild(cell);
                    }
                    body.appendChild(row);
                    table.appendChild(body);
                    var div = document.createElement("div");
                    div.setAttribute("ng-app", appName);
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
