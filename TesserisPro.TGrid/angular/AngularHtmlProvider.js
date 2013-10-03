var TesserisPro;
(function (TesserisPro) {
    /// <reference path="../TGrid.ts" />
    /// <reference path="../IHtmlProvider.ts" />
    (function (TGrid) {
        var AngularHtmlProvider = (function () {
            function AngularHtmlProvider() {
            }
            AngularHtmlProvider.prototype.getTableElement = function (option) {
                var controllerName = "Ctrl";
                var table = document.createElement("table");
                table.setAttribute("ng-controller", controllerName);

                //table.setAttribute("border", "2");
                table.className = "tgrid-table";
                return table;
            };

            AngularHtmlProvider.prototype.getTableHeadElement = function (option) {
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
                return header;
            };

            AngularHtmlProvider.prototype.getTableBodyElement = function (option) {
                var body = document.createElement("tbody");
                var row = document.createElement("tr");
                row.setAttribute("ng-repeat", "item in items|orderBy:sortColumn:sortOrder| startFrom:currentPage*pageSize | limitTo:pageSize");
                for (var i = 0; i < option.columnDataField.length; i++) {
                    var cell = document.createElement("td");
                    cell.setAttribute("width", option.columnWidth[i]);
                    option.columnDataField[i].applyAngular(cell, "item.");
                    row.appendChild(cell);
                }
                body.appendChild(row);
                return body;
            };

            AngularHtmlProvider.prototype.getTableFooterElement = function (option) {
                var footer = document.createElement("tfoot");
                var footrow = document.createElement("tr");
                var footcell = document.createElement("td");
                footcell.setAttribute("align", "center");
                footcell.setAttribute("colspan", option.columnHeaders.length.toString());
                var data = document.createElement("div");

                // add paging hire
                data.innerHTML = "<div>\
                    {{firstItemIndex()}} - {{lastItemIndex()}} of {{totalItemCount}} total results.\
                 </div>\
                 <ul>\
                    <li><a href ng-class=\"{disabledPage:currentPage == 0}\" ng-click=\"currentPage = 0\">&laquo;&laquo;</a ></li>\
                    <li><a href ng-class=\"{disabledPage:currentPage == 0}\" ng-click=\"previousPage()\">&laquo;</a ></li>\
                    <li class=\"active\">{{currentPage+1}}</li>\
                    <li><a href ng-class=\"{disabledPage:currentPage == maxPage()}\" ng-click=\"nextPage()\">&raquo;</a></li>\
                    <li><a href ng-class=\"{disabledPage:currentPage == maxPage()}\" ng-click=\"currentPage = maxPage()\">&raquo;&raquo;</a></li>\
                 </ul>";

                footcell.appendChild(data);
                footrow.appendChild(footcell);
                footer.appendChild(footrow);
                return footer;
            };
            return AngularHtmlProvider;
        })();
        TGrid.AngularHtmlProvider = AngularHtmlProvider;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=AngularHtmlProvider.js.map
