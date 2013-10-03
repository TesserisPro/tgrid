var TesserisPro;
(function (TesserisPro) {
    /// <reference path="../TGrid.ts" />
    /// <reference path="../IHtmlProvider.ts" />
    (function (TGrid) {
        var KnockoutHtmlProvider = (function () {
            function KnockoutHtmlProvider() {
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
                    option.columnHeaders[i].applyKnockout(headerCell);

                    // Get column
                    var columnName = option.columnDataField[i].GetBinding();
                    if (columnName != null && columnName != "") {
                        columnName = columnName.split(':')[1].trim();
                    }

                    // Method changing sorting
                    headerCell.setAttribute("data-bind", "click: function(){" + "if(sort().column == \"" + columnName + "\"){sort({ column : \"" + columnName + "\", order: -1 * sort().order});}" + "else {sort({ column : \"" + columnName + "\", order: 1}); }" + "}");

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

            KnockoutHtmlProvider.prototype.getTableBodyElement = function (option) {
                var body = document.createElement("tbody");
                body.setAttribute("data-bind", "foreach: pagedData");
                var row = document.createElement("tr");
                for (var i = 0; i < option.columnDataField.length; i++) {
                    var cell = document.createElement("td");
                    cell.setAttribute("width", option.columnWidth[i]);
                    option.columnDataField[i].applyKnockout(cell);
                    row.appendChild(cell);
                }
                body.appendChild(row);

                return body;
            };

            KnockoutHtmlProvider.prototype.getTableFooterElement = function (option) {
                var footer = document.createElement("tfoot");
                var footrow = document.createElement("tr");
                var footcell = document.createElement("td");
                footcell.setAttribute("align", "center");
                footcell.setAttribute("colspan", option.columnHeaders.length.toString());
                var data = document.createElement("div");

                // add paging hire
                data.innerHTML = "<div class=\"pagination\"  data-bind=\"template:{ name: 'tpl-pager', data: Pager }\" >" + footcell.appendChild(data);
                footrow.appendChild(footcell);
                footer.appendChild(footrow);

                return footer;
            };
            return KnockoutHtmlProvider;
        })();
        TGrid.KnockoutHtmlProvider = KnockoutHtmlProvider;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=KnockoutHtmlProvider.js.map
